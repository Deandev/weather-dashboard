import { ApiError } from "@/lib/errors"
import type { Astro, CurrentWeather, DailyPoint, HourlyPoint, Place, WeatherReport } from "@/types/weather"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

const CURRENT_VARS = [
  "temperature_2m",
  "relative_humidity_2m",
  "dew_point_2m",
  "apparent_temperature",
  "is_day",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
]
const HOURLY_VARS = ["temperature_2m", "weather_code", "is_day", "uv_index", "visibility"]
const DAILY_VARS = ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration"]

interface RawPlace {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export interface RawForecast {
  error?: boolean
  reason?: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    dew_point_2m: number
    apparent_temperature: number
    is_day: number
    weather_code: number
    cloud_cover: number
    pressure_msl: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    is_day: number[]
    uv_index: number[]
    visibility: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
  }
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ name: query, count: "6", language: "id", format: "json" })
  const res = await fetch(`${GEOCODING_URL}?${params}`, { signal })
  if (!res.ok) throw new ApiError(`Pencarian kota gagal (HTTP ${res.status}).`)
  const body = (await res.json()) as { results?: RawPlace[] }
  return (body.results ?? []).map((r) => ({
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}

export async function fetchWeather(place: Pick<Place, "latitude" | "longitude">, signal?: AbortSignal): Promise<WeatherReport> {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    timezone: "auto",
    forecast_days: "7",
    current: CURRENT_VARS.join(","),
    hourly: HOURLY_VARS.join(","),
    daily: DAILY_VARS.join(","),
  })
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal })
  const body = (await res.json().catch(() => null)) as RawForecast | null
  if (!res.ok || !body || body.error) {
    throw new ApiError(body?.reason ?? `Data cuaca gagal dimuat (HTTP ${res.status}).`)
  }
  return parseForecast(body)
}

// Both `current.time` and `hourly.time` are local wall-clock strings, so string comparison orders them.
export function currentHourIndex(times: string[], now: string): number {
  let idx = 0
  for (let i = 0; i < times.length && times[i] <= now; i++) idx = i
  return idx
}

export function parseForecast(raw: RawForecast): WeatherReport {
  const { current: c, hourly: h, daily: d } = raw
  if (!c || !h?.time?.length || !d?.time?.length) throw new ApiError("Format data cuaca tidak dikenali.")

  const idx = currentHourIndex(h.time, c.time)
  const end = Math.min(idx + 24, h.time.length)

  const daily: DailyPoint[] = d.time.map((date, i) => ({
    date,
    weatherCode: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
  }))

  const hourly: HourlyPoint[] = h.time.slice(idx, end).map((time, j) => ({
    time,
    temperature: h.temperature_2m[idx + j],
    weatherCode: h.weather_code[idx + j],
    isDay: h.is_day[idx + j] === 1,
  }))

  const current: CurrentWeather = {
    time: c.time,
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    dewPoint: c.dew_point_2m,
    pressure: c.pressure_msl,
    cloudCover: c.cloud_cover,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    uvIndex: h.uv_index[idx],
    visibility: h.visibility[idx],
    high: daily[0].max,
    low: daily[0].min,
  }

  const astro: Astro = {
    sunrise: d.sunrise[0],
    sunset: d.sunset[0],
    daylightSeconds: d.daylight_duration[0],
  }

  return { current, hourly, daily, astro, fetchedAt: Date.now() }
}
