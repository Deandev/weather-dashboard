import { ArrowDown, ArrowUp, SunHorizon } from "@phosphor-icons/react"
import { formatDuration, formatHour, sunProgress, toMinutes } from "@/lib/format"
import type { Astro } from "@/types/weather"

interface Props {
  astro: Astro
  now: string
}

// Arc from sunrise (left) to sunset (right); the dot moves along it with the current time.
export function SunCard({ astro, now }: Props) {
  const progress = sunProgress(now, astro.sunrise, astro.sunset)
  const nowMin = toMinutes(now)
  const riseMin = toMinutes(astro.sunrise)
  const setMin = toMinutes(astro.sunset)
  const status =
    nowMin < riseMin ? "Belum terbit" : nowMin > setMin ? "Sudah terbenam" : "Matahari sedang terbit"

  const angle = Math.PI * (1 - progress)
  const dotX = 50 + 40 * Math.cos(angle)
  const dotY = 50 - 40 * Math.sin(angle)

  return (
    <section aria-labelledby="sun-title" className="flex h-full flex-col gap-4">
      <h2 id="sun-title" className="flex items-center gap-2 text-sm font-medium text-white/90">
        <SunHorizon aria-hidden />
        Matahari
      </h2>
      <svg viewBox="0 0 100 58" className="w-full" role="img" aria-label={`${status}. Siang ${formatDuration(astro.daylightSeconds)}`}>
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" />
        {progress > 0 && progress < 1 && (
          <path
            d={`M10 50 A40 40 0 0 1 ${dotX.toFixed(2)} ${dotY.toFixed(2)}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
        )}
        <circle cx={dotX} cy={dotY} r="4" className="fill-amber-200" />
        <line x1="4" x2="96" y1="50" y2="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
      <p className="text-sm text-white/90">{status}</p>
      <div className="mt-auto grid grid-cols-3 gap-2 text-sm">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-xs text-white/90">
            <ArrowUp aria-hidden /> Terbit
          </span>
          <span className="font-medium tabular-nums">{formatHour(astro.sunrise)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-xs text-white/90">
            <ArrowDown aria-hidden /> Terbenam
          </span>
          <span className="font-medium tabular-nums">{formatHour(astro.sunset)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/90">Siang</span>
          <span className="font-medium tabular-nums">{formatDuration(astro.daylightSeconds)}</span>
        </div>
      </div>
    </section>
  )
}
