import type { LatLng } from './geo'

// ITREM marina pages, filtered to real leisure ports; see docs/data-schema.md.
import marinas from '../../data/marinas.json'
import { haversineKm } from './geo'

export type Marina = {
  itremId: number
  name: string
  /** INE code of the municipality */
  municipality: string
  coordinates: [number, number]
  url?: string
  phone?: string
}

export type NearestMarina = Marina & { distanceKm: number }

const list: Marina[] = marinas.values as Marina[]

export const marinasSource = {
  label: marinas.source,
  verifiedOn: marinas.verifiedOn,
}

export const getMarinas = (): Marina[] => list

/** Straight-line nearest marina; undefined when none lies within `maxKm` */
export function getNearestMarina(
  coordinates: LatLng,
  maxKm = 15,
): NearestMarina | undefined {
  let best: NearestMarina | undefined
  for (const marina of list) {
    const distanceKm = haversineKm(coordinates, marina.coordinates)
    if (distanceKm <= maxKm && (!best || distanceKm < best.distanceKm)) {
      best = { ...marina, distanceKm }
    }
  }
  return best
}
