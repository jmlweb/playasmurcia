export type LatLng = readonly [number, number]

const EARTH_RADIUS_KM = 6371

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/** Straight-line distance over the Earth's surface, in kilometres. */
export function haversineKm(from: LatLng, to: LatLng): number {
  const dLat = toRadians(to[0] - from[0])
  const dLng = toRadians(to[1] - from[1])
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from[0])) *
      Math.cos(toRadians(to[0])) *
      Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/**
 * Rounds before choosing the unit, so 0.95 km reads "1,0 km" rather than
 * "1000 m" and 9.96 km reads "10 km" rather than "10,0 km".
 */
export function formatDistance(km: number): string {
  const tenthsOfKm = Math.round(km * 10)
  if (tenthsOfKm < 10) return `${tenthsOfKm * 100} m`
  if (tenthsOfKm < 100) {
    return `${(tenthsOfKm / 10).toFixed(1).replace('.', ',')} km`
  }
  return `${Math.round(km)} km`
}
