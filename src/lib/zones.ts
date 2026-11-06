// Curated by hand from the ITREM locality labels; see docs/data-schema.md.
import curation from '../../data/zones.json'

export type ZoneKind = 'locality' | 'area'

export type Zone = {
  id: string
  name: string
  kind: ZoneKind
  municipalities: number[]
}

export type ItremSnapshot = {
  withoutPage: string[]
  labels: Record<string, string | null>
}

export type ZoneResolution =
  | { zone: string; source: 'itrem' | 'manual'; reason?: string }
  | { unresolved: string; source: 'unresolved' }

type ManualAssignment = { zone: string; reason: string }

export const zones = curation.zones as Zone[]

const zonesById = new Map(zones.map((zone) => [zone.id, zone]))
const zoneOrder = new Map(zones.map((zone, index) => [zone.id, index]))
const itremLabels: Record<string, string | null> = curation.itremLabels
const manualAssignments: Record<string, ManualAssignment> = curation.manual
const unresolvedReasons: Record<string, string> = curation.unresolved

export const getZone = (id: string | undefined): Zone | undefined =>
  id === undefined ? undefined : zonesById.get(id)

// null means the label names no zone (missing, or just the municipality)
export const zoneFromItremLabel = (label: string | null): string | null => {
  if (label === null) return null
  if (!(label in itremLabels)) {
    throw new Error(`ITREM label not curated in data/zones.json: "${label}"`)
  }
  return itremLabels[label]
}

// Hand review wins over the ITREM label, which mixes localities and areas
export const resolveBeachZone = (
  code: string,
  snapshot: ItremSnapshot,
): ZoneResolution => {
  const unresolved = unresolvedReasons[code]
  if (unresolved) return { unresolved, source: 'unresolved' }

  const manual = manualAssignments[code]
  if (manual) return { ...manual, source: 'manual' }

  const zone = zoneFromItremLabel(snapshot.labels[code] ?? null)
  if (zone) return { zone, source: 'itrem' }

  return {
    unresolved: `Beach ${code} needs a hand-reviewed zone in data/zones.json`,
    source: 'unresolved',
  }
}

export type ZoneGroup<T> = { zone: Zone | undefined; beaches: T[] }

// Groups follow the coastal order of the zone list; beaches without zone go last
export const groupBeachesByZone = <T extends { zone?: string }>(
  beaches: T[],
): ZoneGroup<T>[] => {
  const groups = new Map<Zone | undefined, T[]>()
  for (const beach of beaches) {
    const zone = getZone(beach.zone)
    groups.set(zone, [...(groups.get(zone) ?? []), beach])
  }
  const position = (zone: Zone | undefined) =>
    zone ? (zoneOrder.get(zone.id) ?? 0) : Number.POSITIVE_INFINITY
  return [...groups.entries()]
    .map(([zone, members]) => ({ zone, beaches: members }))
    .sort((a, b) => position(a.zone) - position(b.zone))
}

export const formatBeachLocation = (
  zoneId: string | undefined,
  municipalityName: string,
): string => {
  const zone = getZone(zoneId)
  if (!zone || zone.name === municipalityName) return municipalityName
  return `${zone.name} · ${municipalityName}`
}

// A single group adds a heading without telling the visitor anything
export const shouldGroupByZone = (beaches: { zone?: string }[]): boolean =>
  groupBeachesByZone(beaches).length > 1
