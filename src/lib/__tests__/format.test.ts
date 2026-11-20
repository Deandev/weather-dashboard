import { describe, expect, it } from "vitest"
import { convertTemp, formatTemp, sunProgress, uvLabel, windDirection } from "@/lib/format"
import { conditionOf, describeWeather } from "@/lib/weather-codes"
import { currentHourIndex, parseForecast, type RawForecast } from "@/lib/api/open-meteo"
import fixture from "@/lib/__fixtures__/forecast.json"

describe("format", () => {
  it("converts celsius to fahrenheit", () => {
    expect(convertTemp(0, "fahrenheit")).toBe(32)
    expect(convertTemp(100, "fahrenheit")).toBe(212)
    expect(formatTemp(29.5, "celsius")).toBe("30°")
  })
  it("maps wind degrees to compass points", () => {
    expect(windDirection(0)).toBe("Utara")
    expect(windDirection(279)).toBe("Barat")
    expect(windDirection(360)).toBe("Utara")
    expect(windDirection(-90)).toBe("Barat")
  })
  it("labels UV bands", () => {
    expect(uvLabel(0)).toBe("Rendah")
    expect(uvLabel(8.35)).toBe("Sangat tinggi")
    expect(uvLabel(11)).toBe("Ekstrem")
  })
  it("clamps sun progress between sunrise and sunset", () => {
    expect(sunProgress("2026-11-20T05:00", "2026-11-20T05:25", "2026-11-20T17:51")).toBe(0)
    expect(sunProgress("2026-11-20T17:51", "2026-11-20T05:25", "2026-11-20T17:51")).toBe(1)
    expect(sunProgress("2026-11-20T11:38", "2026-11-20T05:25", "2026-11-20T17:51")).toBeGreaterThan(0.4)
  })
})

describe("weather codes", () => {
  it("classifies WMO codes", () => {
    expect(conditionOf(0)).toBe("clear")
    expect(conditionOf(3)).toBe("cloudy")
    expect(conditionOf(61)).toBe("rain")
    expect(conditionOf(81)).toBe("rain")
    expect(conditionOf(73)).toBe("snow")
    expect(conditionOf(95)).toBe("storm")
    expect(conditionOf(45)).toBe("fog")
  })
  it("switches the clear-sky icon at night", () => {
    expect(describeWeather(0, true).Icon).not.toBe(describeWeather(0, false).Icon)
  })
})

describe("open-meteo parsing", () => {
  it("starts the hourly list at the current hour", () => {
    const times = ["2026-11-20T00:00", "2026-11-20T01:00", "2026-11-20T02:00"]
    expect(currentHourIndex(times, "2026-11-20T01:45")).toBe(1)
    expect(currentHourIndex(times, "2026-11-20T00:00")).toBe(0)
  })
  it("parses the recorded Jakarta response into the app model", () => {
    const report = parseForecast(fixture as unknown as RawForecast)
    expect(report.daily).toHaveLength(7)
    expect(report.hourly).toHaveLength(24)
    expect(report.current.high).toBe(report.daily[0].max)
    expect(report.current.low).toBe(report.daily[0].min)
    expect(report.astro.daylightSeconds).toBeGreaterThan(0)
    expect(report.current.uvIndex).toBeGreaterThanOrEqual(0)
  })
  it("rejects a response with no hourly data", () => {
    const empty = { ...(fixture as unknown as RawForecast), hourly: { time: [] } } as unknown as RawForecast
    expect(() => parseForecast(empty)).toThrow()
  })
})
