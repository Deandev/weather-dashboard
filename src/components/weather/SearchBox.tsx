import { useEffect, useId, useState } from "react"
import { MagnifyingGlass, MapPin } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { searchPlaces } from "@/lib/api/open-meteo"
import { cn } from "@/lib/utils"
import type { Place } from "@/types/weather"

interface Props {
  onSelect: (place: Place) => void
  autoFocus?: boolean
}

const MIN_CHARS = 2

export function SearchBox({ onSelect, autoFocus }: Props) {
  const listId = useId()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [result, setResult] = useState<{ term: string; items: Place[]; failed: boolean } | null>(null)
  const term = query.trim()

  useEffect(() => {
    if (term.length < MIN_CHARS) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      searchPlaces(term, controller.signal)
        .then((items) => setResult({ term, items, failed: false }))
        .catch(() => {
          if (!controller.signal.aborted) setResult({ term, items: [], failed: true })
        })
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [term])

  // Ignore results that belong to an earlier query so the list never shows stale matches.
  const current = result && result.term === term ? result : null
  const items = current?.items ?? []
  const showList = open && term.length >= MIN_CHARS

  function pick(place: Place) {
    onSelect(place)
    setQuery("")
    setActive(-1)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => Math.min(items.length - 1, i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(-1, i - 1))
    } else if (e.key === "Enter" && active >= 0 && items[active]) {
      e.preventDefault()
      pick(items[active])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <MagnifyingGlass aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/90" />
      <Input
        type="text"
        role="combobox"
        aria-label="Cari kota"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Cari kota di seluruh dunia"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(-1)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-11 rounded-xl border-white/15 bg-white/10 pl-9 text-base backdrop-blur-xl placeholder:text-white/90"
      />
      <div aria-live="polite" className="sr-only">
        {showList && current && items.length > 0 ? `${items.length} hasil` : ""}
      </div>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Hasil pencarian kota"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-zinc-900/90 p-1 shadow-none backdrop-blur-xl"
        >
          {!current && <li className="px-3 py-2 text-sm text-white/90">Mencari…</li>}
          {current?.failed && <li className="px-3 py-2 text-sm text-white/90">Pencarian gagal. Coba lagi.</li>}
          {current && !current.failed && items.length === 0 && (
            <li className="px-3 py-2 text-sm text-white/90">Kota tidak ditemukan.</li>
          )}
          {items.map((place, i) => (
            <li
              key={`${place.latitude},${place.longitude}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(place)
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                i === active && "bg-white/15",
              )}
            >
              <MapPin aria-hidden className="shrink-0 text-white/90" />
              <span className="truncate font-medium">{place.name}</span>
              <span className="truncate text-white/90">
                {[place.admin1, place.country].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
