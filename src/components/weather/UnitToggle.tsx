import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Units } from "@/types/weather"

interface Props {
  value: Units
  onChange: (units: Units) => void
}

export function UnitToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next: string) => {
        if (next === "celsius" || next === "fahrenheit") onChange(next)
      }}
      aria-label="Satuan suhu"
      className="rounded-full bg-white/10 p-0.5"
    >
      <ToggleGroupItem value="celsius" aria-label="Celsius" className="h-11 min-w-11 rounded-full px-3 text-sm sm:h-8 sm:text-xs">
        °C
      </ToggleGroupItem>
      <ToggleGroupItem value="fahrenheit" aria-label="Fahrenheit" className="h-11 min-w-11 rounded-full px-3 text-sm sm:h-8 sm:text-xs">
        °F
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
