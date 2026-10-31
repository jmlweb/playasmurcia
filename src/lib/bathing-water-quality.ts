import type { WaterQuality, WaterQualitySource } from '@/types/beach'

import { haversineKm } from './geo'

/**
 * A sampling point beyond this distance describes another stretch of coast.
 * Beach coordinates can sit hundreds of metres from the sand (LRN-022), so a
 * tighter limit drops real matches; a looser one borrows a neighbour's class.
 */
export const MAX_SAMPLING_POINT_DISTANCE_M = 500

// NUTS code of the Región de Murcia; ES521 (Alicante) and ES611 (Almería)
// points near the borders belong to other regional authorities.
const MURCIA_BATHING_WATER_PREFIX = 'ES620'

const EU_CLASSES: Record<string, WaterQuality> = {
  Excellent: 'excellent',
  Good: 'good',
  Sufficient: 'sufficient',
  Poor: 'poor',
}

export type BathingWaterPoint = {
  id: string
  name: string
  latitude: number
  longitude: number
  qualityStatus: string | null
  profileUrl: string | null
}

export type BathingWaterMatch = {
  waterQuality: WaterQuality
  waterQualitySource: WaterQualitySource
}

/** Maps an EEA status to a Directive 2006/7/EC class; anything else has none. */
export const toWaterQualityClass = (
  status: string | null,
): WaterQuality | undefined => (status ? EU_CLASSES[status] : undefined)

const distanceMeters = (
  coordinates: readonly [number, number],
  point: BathingWaterPoint,
) =>
  Math.round(haversineKm(coordinates, [point.latitude, point.longitude]) * 1000)

/** Official class of the nearest classified Murcia sampling point, if close enough. */
export const matchBathingWater = (
  coordinates: readonly [number, number],
  points: readonly BathingWaterPoint[],
  season: number,
): BathingWaterMatch | undefined => {
  const nearest = points
    .filter((point) => point.id.startsWith(MURCIA_BATHING_WATER_PREFIX))
    .filter((point) => toWaterQualityClass(point.qualityStatus))
    .map((point) => ({ point, distance: distanceMeters(coordinates, point) }))
    .filter(({ distance }) => distance <= MAX_SAMPLING_POINT_DISTANCE_M)
    .sort((a, b) => a.distance - b.distance)[0]

  if (!nearest) return undefined

  const { point, distance } = nearest
  return {
    waterQuality: toWaterQualityClass(point.qualityStatus)!,
    waterQualitySource: {
      season,
      samplingPointId: point.id,
      samplingPointName: point.name,
      distanceMeters: distance,
      ...(point.profileUrl && { profileUrl: point.profileUrl }),
    },
  }
}
