import type { Units } from "@/types/weather"

const COMPASS = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"]

export function convertTemp(celsius: number, units: Units): number {
  return units === "celsius" ? celsius : (celsius * 9) / 5 + 32
}

export function formatTemp(celsius: number, units: Units): string {
  return `${Math.round(convertTemp(celsius, units))}°`
}

// timezone=auto makes Open-Meteo return local wall-clock time without offset, so slicing is exact.
export function formatHour(iso: string): string {
  return iso.slice(11, 16)
}

export function formatDayLabel(date: string, today: string): string {
  if (date === today) return "Hari ini"
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", { weekday: "short" })
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h} j ${m} m`
}

export function windDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  return COMPASS[Math.round(normalized / 45) % 8]
}

export function uvLabel(uv: number): string {
  const v = Math.round(uv)
  if (v <= 2) return "Rendah"
  if (v <= 5) return "Sedang"
  if (v <= 7) return "Tinggi"
  if (v <= 10) return "Sangat tinggi"
  return "Ekstrem"
}

export function formatVisibility(meters: number): string {
  return meters >= 10000 ? "10+ km" : `${(meters / 1000).toFixed(1)} km`
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`
}

export function toMinutes(iso: string): number {
  const [h, m] = iso.slice(11, 16).split(":").map(Number)
  return h * 60 + m
}

// Where "now" sits between sunrise (0) and sunset (1), clamped.
export function sunProgress(now: string, sunrise: string, sunset: string): number {
  const start = toMinutes(sunrise)
  const end = toMinutes(sunset)
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (toMinutes(now) - start) / (end - start)))
}
