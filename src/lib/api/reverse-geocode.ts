// Open-Meteo only offers forward (name → coordinates) geocoding. Client-side reverse lookup
// for the auto-detected location uses BigDataCloud's keyless endpoint. Returns null on any failure.
const URL_BASE = "https://api.bigdatacloud.net/data/reverse-geocode-client"

export interface ReverseResult {
  name: string
  country: string
  admin1?: string
}

interface RawReverse {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseResult | null> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), localityLanguage: "id" })
  try {
    const res = await fetch(`${URL_BASE}?${params}`, { signal: AbortSignal.timeout(5_000) })
    if (!res.ok) return null
    const body = (await res.json()) as RawReverse
    const name = body.city || body.locality || body.principalSubdivision
    if (!name) return null
    return { name, country: body.countryName ?? "", admin1: body.principalSubdivision }
  } catch {
    return null
  }
}
