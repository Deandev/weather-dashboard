export interface Coords {
  latitude: number
  longitude: number
}

export function getCurrentCoords(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation tidak tersedia."))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10_000, maximumAge: 600_000 },
    )
  })
}
