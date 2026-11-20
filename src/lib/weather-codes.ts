import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
  type Icon,
} from "@phosphor-icons/react"

export type Condition = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm"

// WMO weather interpretation codes used by Open-Meteo.
const LABELS: Record<number, string> = {
  0: "Cerah",
  1: "Cerah berawan tipis",
  2: "Sebagian berawan",
  3: "Berawan",
  45: "Kabut",
  48: "Kabut rime",
  51: "Gerimis ringan",
  53: "Gerimis",
  55: "Gerimis lebat",
  56: "Gerimis beku ringan",
  57: "Gerimis beku lebat",
  61: "Hujan ringan",
  63: "Hujan",
  65: "Hujan lebat",
  66: "Hujan beku ringan",
  67: "Hujan beku lebat",
  71: "Salju ringan",
  73: "Salju",
  75: "Salju lebat",
  77: "Butiran salju",
  80: "Hujan lokal ringan",
  81: "Hujan lokal",
  82: "Hujan lokal lebat",
  85: "Salju lokal ringan",
  86: "Salju lokal lebat",
  95: "Badai petir",
  96: "Badai petir, hujan es ringan",
  99: "Badai petir, hujan es lebat",
}

export function conditionOf(code: number): Condition {
  if (code <= 2) return "clear"
  if (code === 3) return "cloudy"
  if (code === 45 || code === 48) return "fog"
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain"
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow"
  if (code >= 95 && code <= 99) return "storm"
  return "cloudy"
}

const ICON_BY_CONDITION: Record<Condition, Icon> = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
}

export function describeWeather(code: number, isDay: boolean): { label: string; Icon: Icon; condition: Condition } {
  const condition = conditionOf(code)
  let icon: Icon = ICON_BY_CONDITION[condition]
  if (code <= 1) icon = isDay ? Sun : Moon
  if (code === 2) icon = isDay ? CloudSun : CloudMoon
  return { label: LABELS[code] ?? "Tidak diketahui", Icon: icon, condition }
}

const DAY_GRADIENTS: Record<Condition, string> = {
  clear: "linear-gradient(160deg, #1e4a7a 0%, #2c6197 60%, #33709f 100%)",
  cloudy: "linear-gradient(160deg, #333c50 0%, #4a5670 60%, #56617a 100%)",
  fog: "linear-gradient(160deg, #2f333b 0%, #41464f 60%, #4b505a 100%)",
  rain: "linear-gradient(160deg, #1b2432 0%, #26334a 60%, #2c3a52 100%)",
  snow: "linear-gradient(160deg, #3a4a62 0%, #4c5d78 60%, #56688a 100%)",
  storm: "linear-gradient(160deg, #0f1523 0%, #1d2638 60%, #243047 100%)",
}

const NIGHT_GRADIENTS: Record<Condition, string> = {
  clear: "linear-gradient(160deg, #070b1f 0%, #121c45 60%, #22305f 100%)",
  cloudy: "linear-gradient(160deg, #121727 0%, #232c42 60%, #343f5a 100%)",
  fog: "linear-gradient(160deg, #15171c 0%, #2a2e36 100%)",
  rain: "linear-gradient(160deg, #0b1020 0%, #1b2639 100%)",
  snow: "linear-gradient(160deg, #161e2f 0%, #303c56 100%)",
  storm: "linear-gradient(160deg, #080b13 0%, #171f30 100%)",
}

export function backgroundFor(code: number, isDay: boolean): string {
  const condition = conditionOf(code)
  return isDay ? DAY_GRADIENTS[condition] : NIGHT_GRADIENTS[condition]
}
