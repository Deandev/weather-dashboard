import { describeWeather } from "@/lib/weather-codes"
import { formatHour, formatTemp } from "@/lib/format"
import type { HourlyPoint, Units } from "@/types/weather"

interface Props {
  hourly: HourlyPoint[]
  units: Units
}

export function HourlyForecast({ hourly, units }: Props) {
  return (
    <section aria-labelledby="hourly-title" className="flex min-w-0 flex-col gap-4">
      <h2 id="hourly-title" className="text-sm font-medium text-white/90">
        24 jam ke depan
      </h2>
      {/* Bleeds to the panel edge so the row reads as scrollable instead of clipped. */}
      <div
        role="list"
        aria-label="Prakiraan per jam"
        className="-mx-5 flex snap-x scroll-px-5 gap-1 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [mask-image:linear-gradient(to_right,#000_86%,transparent)] [-webkit-mask-image:linear-gradient(to_right,#000_86%,transparent)]"
      >
        {hourly.map((hour, i) => {
          const { label, Icon } = describeWeather(hour.weatherCode, hour.isDay)
          return (
            <div
              role="listitem"
              key={hour.time}
              className={
                "flex min-w-[4.25rem] snap-start flex-col items-center gap-2 rounded-2xl px-2 py-3 transition-colors hover:bg-white/10 " +
                (i === 0 ? "bg-white/15" : "")
              }
            >
              <span className="text-xs text-white/90">{formatHour(hour.time)}</span>
              <Icon weight="duotone" size={28} aria-label={label} role="img" />
              <span className="text-base font-medium tabular-nums">{formatTemp(hour.temperature, units)}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
