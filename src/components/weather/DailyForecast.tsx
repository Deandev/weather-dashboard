import { describeWeather } from "@/lib/weather-codes"
import { formatDayLabel, formatTemp } from "@/lib/format"
import type { DailyPoint, Units } from "@/types/weather"

interface Props {
  daily: DailyPoint[]
  units: Units
}

export function DailyForecast({ daily, units }: Props) {
  const today = daily[0]?.date
  // Scale every bar against the week's overall range so the rows are comparable.
  const weekMin = Math.min(...daily.map((d) => d.min))
  const weekMax = Math.max(...daily.map((d) => d.max))
  const span = weekMax - weekMin || 1

  return (
    <section aria-labelledby="daily-title" className="flex flex-col gap-4">
      <h2 id="daily-title" className="text-sm font-medium text-white/90">
        7 hari ke depan
      </h2>
      <ul className="flex flex-col gap-3">
        {daily.map((day) => {
          const { label, Icon } = describeWeather(day.weatherCode, true)
          const left = ((day.min - weekMin) / span) * 100
          const width = Math.max(((day.max - day.min) / span) * 100, 3)
          return (
            <li key={day.date} className="grid grid-cols-[3.5rem_1.75rem_1fr_auto] items-center gap-3 text-sm">
              <span className="text-white/90">{formatDayLabel(day.date, today)}</span>
              <Icon weight="duotone" size={22} aria-label={label} role="img" />
              <div className="relative h-1.5 rounded-full bg-white/15" aria-hidden>
                <div
                  className="absolute h-full rounded-full bg-linear-to-r from-sky-300 to-amber-200"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
              <span className="w-20 text-right tabular-nums">
                <span className="text-white/90">{formatTemp(day.min, units)}</span>
                <span className="mx-1 text-white/30">/</span>
                <span>{formatTemp(day.max, units)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
