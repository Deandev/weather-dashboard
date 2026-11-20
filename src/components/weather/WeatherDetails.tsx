import type { Icon } from "@phosphor-icons/react"
import { Cloud, Drop, Eye, Gauge, NavigationArrow, SunDim, Thermometer, Wind } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { formatPressure, formatTemp, formatVisibility, uvLabel, windDirection } from "@/lib/format"
import type { CurrentWeather, Units } from "@/types/weather"

interface Props {
  current: CurrentWeather
  units: Units
}

interface Tile {
  key: string
  label: string
  value: string
  hint?: string
  Icon: Icon
  extra?: React.ReactNode
}

export function WeatherDetails({ current, units }: Props) {
  const tiles: Tile[] = [
    { key: "humidity", label: "Kelembapan", value: `${Math.round(current.humidity)}%`, Icon: Drop },
    {
      key: "wind",
      label: "Kecepatan angin",
      value: `${Math.round(current.windSpeed)} km/j`,
      Icon: Wind,
    },
    {
      key: "wind-dir",
      label: "Arah angin",
      value: windDirection(current.windDirection),
      hint: `${Math.round(current.windDirection)}°`,
      Icon: NavigationArrow,
      extra: (
        <NavigationArrow
          aria-hidden
          weight="fill"
          className="size-3.5 text-white/90"
          style={{ transform: `rotate(${current.windDirection}deg)` }}
        />
      ),
    },
    {
      key: "uv",
      label: "Indeks UV",
      value: String(Math.round(current.uvIndex)),
      hint: uvLabel(current.uvIndex),
      Icon: SunDim,
    },
    { key: "visibility", label: "Jarak pandang", value: formatVisibility(current.visibility), Icon: Eye },
    { key: "pressure", label: "Tekanan udara", value: formatPressure(current.pressure), Icon: Gauge },
    { key: "clouds", label: "Tutupan awan", value: `${Math.round(current.cloudCover)}%`, Icon: Cloud },
    {
      key: "dew",
      label: "Titik embun",
      value: formatTemp(current.dewPoint, units),
      Icon: Thermometer,
    },
  ]

  return (
    <section aria-labelledby="details-title" className="flex flex-col gap-4">
      <h2 id="details-title" className="text-sm font-medium text-white/90">
        Detail cuaca
      </h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {tiles.map(({ key, label, value, hint, Icon, extra }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <dt className="flex items-center gap-1.5 text-xs text-white/90">
              <Icon aria-hidden className="size-3.5" />
              {label}
            </dt>
            <dd className="flex items-center gap-2 text-xl font-medium tabular-nums">
              {value}
              {extra}
            </dd>
            {hint && (
              <Badge variant="secondary" className="w-fit bg-white/10 text-[0.7rem] text-white/90">
                {hint}
              </Badge>
            )}
          </div>
        ))}
      </dl>
    </section>
  )
}
