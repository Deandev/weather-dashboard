import { ArrowsClockwise } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useWeather } from "@/hooks/useWeather"
import { formatHour } from "@/lib/format"
import { backgroundFor } from "@/lib/weather-codes"
import type { Place, Units } from "@/types/weather"
import { CurrentHero } from "./CurrentHero"
import { DailyForecast } from "./DailyForecast"
import { HourlyForecast } from "./HourlyForecast"
import { SunCard } from "./SunCard"
import { ErrorState, LoadingState } from "./StatusStates"
import { WeatherDetails } from "./WeatherDetails"

interface Props {
  place: Place
  units: Units
}

const PANEL = "rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur-xl sm:p-6"

export function Dashboard({ place, units }: Props) {
  const { status, busy, refresh } = useWeather(place)

  if (status.kind === "loading") return <LoadingState label="Memuat data cuaca…" />
  if (status.kind === "error") return <ErrorState message={status.message} onRetry={refresh} busy={busy} />

  const { current, hourly, daily, astro } = status.report
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 transition-[background] duration-700"
        style={{ background: backgroundFor(current.weatherCode, current.isDay) }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-4 pb-16 sm:gap-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 text-xs text-white/90">
          <span>Diperbarui pukul {formatHour(current.time)}</span>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={busy} className="h-11 px-3 sm:h-7">
            <ArrowsClockwise data-icon="inline-start" className={busy ? "animate-spin" : undefined} />
            Muat ulang
          </Button>
        </div>

        <CurrentHero place={place} current={current} units={units} />

        <div className={`${PANEL} grid grid-cols-1 gap-8 lg:grid-cols-3`}>
          <div className="min-w-0 lg:col-span-2">
            <HourlyForecast hourly={hourly} units={units} />
          </div>
          <div className="min-w-0">
            <SunCard astro={astro} now={current.time} />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`${PANEL} min-w-0`}>
            <DailyForecast daily={daily} units={units} />
          </div>
          <div className={`${PANEL} min-w-0 lg:col-span-2`}>
            <WeatherDetails current={current} units={units} />
          </div>
        </div>
      </div>
    </>
  )
}
