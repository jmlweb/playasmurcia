import type { LatLng } from './geo'

// Bundled at build time like beach-notices.ts (see LRN-027): no DB column, no migration.
import protectedAreasData from '../../data/protected-areas.json'

/** `enp`: regional protected natural space; `natura2000`: LIC, ZEC or ZEPA */
export type ProtectedAreaNetwork = 'enp' | 'natura2000'

export type ProtectedArea = {
  /** ENP code (ENP000005) or Natura 2000 site code (ES6200001) */
  code: string
  name: string
  /** Figure as the source writes it: Parque Regional, Paisaje Protegido, LIC, ZEC, ZEPA… */
  designation: string
  network: ProtectedAreaNetwork
}

type Ring = readonly (readonly number[])[]

/** GeoJSON polygon geometry, positions in [lng, lat] order */
export type AreaGeometry =
  | { type: 'Polygon'; coordinates: readonly Ring[] }
  | { type: 'MultiPolygon'; coordinates: readonly (readonly Ring[])[] }

export type ProtectedAreaFeature = {
  area: ProtectedArea
  geometry: AreaGeometry
}

export type ProtectedAreasLayer = {
  typeName: string
  title: string
  version: string
  featureCount: number
}

export type ProtectedAreasFile = {
  source: string
  serviceUrl: string
  /** Public map viewer of the same infrastructure, for readers */
  viewerUrl: string
  retrievedOn: string
  layers: ProtectedAreasLayer[]
  excludedMarineSites: string[]
  toleranceMeters: number
  values: Record<string, ProtectedArea[]>
}

// Even-odd ray casting: crossing an outer ring and then a hole cancels out
const crossingsOfRing = (lng: number, lat: number, ring: Ring): number =>
  ring.reduce((crossings, current, index) => {
    const previous = ring[(index + ring.length - 1) % ring.length]
    const [currentLng, currentLat] = current
    const [previousLng, previousLat] = previous
    const straddles = currentLat > lat !== previousLat > lat
    if (!straddles) return crossings
    const edgeLngAtLat =
      ((previousLng - currentLng) * (lat - currentLat)) /
        (previousLat - currentLat) +
      currentLng
    return lng < edgeLngAtLat ? crossings + 1 : crossings
  }, 0)

const polygonsOf = (geometry: AreaGeometry): readonly (readonly Ring[])[] =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

/** `point` is [lng, lat], the GeoJSON order */
export const isPointInGeometry = (
  [lng, lat]: readonly [number, number],
  geometry: AreaGeometry,
): boolean =>
  polygonsOf(geometry).some(
    (rings) =>
      rings.reduce((sum, ring) => sum + crossingsOfRing(lng, lat, ring), 0) %
        2 ===
      1,
  )

const METERS_PER_DEGREE_LAT = 110_574
const METERS_PER_DEGREE_LNG_AT_EQUATOR = 111_320

// Equirectangular projection around the point: exact enough for a few hundred metres
const segmentDistanceMeters = (
  [lng, lat]: readonly [number, number],
  start: readonly number[],
  end: readonly number[],
): number => {
  const lngScale =
    METERS_PER_DEGREE_LNG_AT_EQUATOR * Math.cos((lat * Math.PI) / 180)
  const toPlane = (position: readonly number[]) => [
    (position[0] - lng) * lngScale,
    (position[1] - lat) * METERS_PER_DEGREE_LAT,
  ]
  const [startX, startY] = toPlane(start)
  const [endX, endY] = toPlane(end)
  const deltaX = endX - startX
  const deltaY = endY - startY
  const lengthSquared = deltaX * deltaX + deltaY * deltaY
  const along =
    lengthSquared === 0
      ? 0
      : Math.min(
          1,
          Math.max(0, -(startX * deltaX + startY * deltaY) / lengthSquared),
        )
  return Math.hypot(startX + along * deltaX, startY + along * deltaY)
}

/** Metres from `point` ([lng, lat]) to the geometry; zero inside it */
export const distanceToGeometryMeters = (
  point: readonly [number, number],
  geometry: AreaGeometry,
): number => {
  if (isPointInGeometry(point, geometry)) return 0
  let nearest = Number.POSITIVE_INFINITY
  for (const rings of polygonsOf(geometry)) {
    for (const ring of rings) {
      for (let index = 1; index < ring.length; index += 1) {
        nearest = Math.min(
          nearest,
          segmentDistanceMeters(point, ring[index - 1], ring[index]),
        )
      }
    }
  }
  return nearest
}

/**
 * Areas that hold the beach or lie within `toleranceMeters` of it, each code
 * and designation once (a site can be both ZEC and ZEPA). Beach coordinates are [lat, lng]; the tolerance absorbs beach points
 * that sit on the waterline of a limit drawn along the shore.
 */
export const findContainingAreas = (
  [lat, lng]: LatLng,
  features: readonly ProtectedAreaFeature[],
  toleranceMeters = 0,
): ProtectedArea[] =>
  features
    .filter(
      (feature) =>
        distanceToGeometryMeters([lng, lat], feature.geometry) <=
        toleranceMeters,
    )
    .map((feature) => feature.area)
    .filter(
      (area, index, areas) =>
        areas.findIndex(
          (other) =>
            other.code === area.code && other.designation === area.designation,
        ) === index,
    )

const protectedAreasFile = protectedAreasData as ProtectedAreasFile

export const protectedAreasSource = {
  label: protectedAreasFile.source,
  serviceUrl: protectedAreasFile.serviceUrl,
  viewerUrl: protectedAreasFile.viewerUrl,
  retrievedOn: protectedAreasFile.retrievedOn,
  layers: protectedAreasFile.layers,
  excludedMarineSites: protectedAreasFile.excludedMarineSites,
  toleranceMeters: protectedAreasFile.toleranceMeters,
}

export const getProtectedAreas = (code: string): ProtectedArea[] =>
  protectedAreasFile.values[code] ?? []
