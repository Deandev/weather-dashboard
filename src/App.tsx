import { useState } from "react"
import { Crosshair, Sun } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useAutoLocation } from "@/hooks/useAutoLocation"
import { useUnits } from "@/hooks/useUnits"
import { Dashboard } from "@/components/weather/Dashboard"
import { SearchBox } from "@/components/weather/SearchBox"
import { UnitToggle } from "@/components/weather/UnitToggle"
import { LoadingState } from "@/components/weather/StatusStates"
import type { Place } from "@/types/weather"

export default function App() {
  const [units, setUnits] = useUnits()
  const [chosen, setChosen] = useState<Place | null>(null)
  const auto = useAutoLocation()
  const autoPlace = auto.status === "resolved" ? auto.place : null
  const place = chosen ?? autoPlace

  return (
    <div className="dark isolate min-h-svh bg-zinc-950 font-sans text-foreground antialiased">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <Sun weight="duotone" size={20} aria-hidden />
            Atmos
          </div>
          <div className="order-last w-full sm:order-none sm:max-w-sm sm:flex-1">
            <SearchBox onSelect={setChosen} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {chosen && autoPlace && (
              <Button variant="ghost" size="sm" onClick={() => setChosen(null)} className="h-10 sm:h-7">
                <Crosshair data-icon="inline-start" />
                Lokasi saya
              </Button>
            )}
            <UnitToggle value={units} onChange={setUnits} />
          </div>
        </div>
      </header>

      <main>
        {place ? (
          <Dashboard key={`${place.latitude},${place.longitude}`} place={place} units={units} />
        ) : auto.status === "detecting" ? (
          <LoadingState label="Mendeteksi lokasi…" />
        ) : (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-16 sm:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">Cari kota</h1>
            <p className="text-sm text-white/90">
              Lokasi tidak tersedia. Cari kota untuk melihat cuacanya.
            </p>
            <SearchBox onSelect={setChosen} autoFocus />
          </div>
        )}
      </main>
    </div>
  )
}
