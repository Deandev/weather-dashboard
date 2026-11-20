import { useEffect, useState } from "react"
import { reverseGeocode } from "@/lib/api/reverse-geocode"
import { getCurrentCoords } from "@/lib/geolocation"
import type { Place } from "@/types/weather"

export type AutoLocation = { status: "detecting" } | { status: "resolved"; place: Place } | { status: "unavailable" }

// Headless browsers and unanswered permission prompts can leave getCurrentPosition
// without any callback, so give up after this long and fall back to manual search.
const WATCHDOG_MS = 12_000

export function useAutoLocation(): AutoLocation {
  const [state, setState] = useState<AutoLocation>({ status: "detecting" })

  useEffect(() => {
    let active = true
    const watchdog = window.setTimeout(() => {
      if (active) setState({ status: "unavailable" })
    }, WATCHDOG_MS)

    getCurrentCoords()
      .then(async ({ latitude, longitude }) => {
        window.clearTimeout(watchdog)
        const named = await reverseGeocode(latitude, longitude)
        if (!active) return
        setState({
          status: "resolved",
          place: {
            name: named?.name ?? "Lokasi Anda",
            country: named?.country ?? "",
            admin1: named?.admin1,
            latitude,
            longitude,
          },
        })
      })
      .catch(() => {
        window.clearTimeout(watchdog)
        if (active) setState({ status: "unavailable" })
      })

    return () => {
      active = false
      window.clearTimeout(watchdog)
    }
  }, [])

  return state
}
