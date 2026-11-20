import { useCallback, useEffect, useState } from "react"
import { fetchWeather } from "@/lib/api/open-meteo"
import { messageOf } from "@/lib/errors"
import type { Place, WeatherReport } from "@/types/weather"

export type WeatherStatus =
  | { kind: "loading" }
  | { kind: "ready"; report: WeatherReport }
  | { kind: "error"; message: string }

// Callers remount this hook per place (via `key`), so the initial state is always "loading".
export function useWeather(place: Place) {
  const [status, setStatus] = useState<WeatherStatus>({ kind: "loading" })
  const [busy, setBusy] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchWeather(place, controller.signal)
      .then((report) => {
        setStatus({ kind: "ready", report })
        setBusy(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setStatus({ kind: "error", message: messageOf(err) })
        setBusy(false)
      })
    return () => controller.abort()
  }, [place, attempt])

  const refresh = useCallback(() => {
    setBusy(true)
    setAttempt((n) => n + 1)
  }, [])

  return { status, busy, refresh }
}
