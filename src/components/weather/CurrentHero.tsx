import { MapPin } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { formatLongDate, formatTemp } from "@/lib/format"
import { describeWeather } from "@/lib/weather-codes"
import type { CurrentWeather, Place, Units } from "@/types/weather"

interface Props {
  place: Place
  current: CurrentWeather
  units: Units
}

export function CurrentHero({ place, current, units }: Props) {
  const { label, Icon } = describeWeather(current.weatherCode, current.isDay)
  const region = [place.admin1, place.country].filter(Boolean).join(", ")

  return (
    <section aria-labelledby="current-title" className="flex flex-col gap-8 pt-6 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-1.5 text-sm text-white/90">
          <MapPin aria-hidden />
          {region}
        </p>
        <h1 id="current-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {place.name}
        </h1>
        <p className="text-sm text-white/90">{formatLongDate(current.time)}</p>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <Icon weight="duotone" size={88} aria-label={label} role="img" className="shrink-0" />
        <div className="flex flex-col">
          <p className="text-[5.5rem] leading-none sm:text-[6.5rem] font-extralight tracking-tighter tabular-nums">
            {formatTemp(current.temperature, units)}
          </p>
          <p className="mt-2 text-lg text-white/90">{label}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/90">
            <Badge variant="secondary" className="bg-white/10 text-white">
              Terasa {formatTemp(current.apparentTemperature, units)}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              Tinggi {formatTemp(current.high, units)}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white">
              Rendah {formatTemp(current.low, units)}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
