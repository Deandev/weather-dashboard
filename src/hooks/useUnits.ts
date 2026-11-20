import { useEffect, useState } from "react"
import type { Units } from "@/types/weather"

const KEY = "atmos-units"

export function useUnits() {
  const [units, setUnits] = useState<Units>(() =>
    localStorage.getItem(KEY) === "fahrenheit" ? "fahrenheit" : "celsius",
  )
  useEffect(() => {
    localStorage.setItem(KEY, units)
  }, [units])
  return [units, setUnits] as const
}
