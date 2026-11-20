export type Units = "celsius" | "fahrenheit"

export interface Place {
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  dewPoint: number
  pressure: number
  cloudCover: number
  windSpeed: number
  windDirection: number
  weatherCode: number
  isDay: boolean
  uvIndex: number
  visibility: number
  high: number
  low: number
}

export interface HourlyPoint {
  time: string
  temperature: number
  weatherCode: number
  isDay: boolean
}

export interface DailyPoint {
  date: string
  weatherCode: number
  max: number
  min: number
}

export interface Astro {
  sunrise: string
  sunset: string
  daylightSeconds: number
}

export interface WeatherReport {
  current: CurrentWeather
  hourly: HourlyPoint[]
  daily: DailyPoint[]
  astro: Astro
  fetchedAt: number
}
