import type { LatLng } from '@/lib/geo'
import type { Beach } from '@/types/beach'

import { haversineKm } from '@/lib/geo'

export const NeedFilterKeys = [
  'dogFriendly',
  'lifeguard',
  'childSafe',
  'naturalShade',
  'nudist',
] as const
export type NeedFilterKey = (typeof NeedFilterKeys)[number]

export const NeedFilterLabels: Record<NeedFilterKey, string> = {
  dogFriendly: 'Admite perros',
  lifeguard: 'Con socorrista',
  childSafe: 'Apta para niños',
  naturalShade: 'Sombra natural',
  nudist: 'Nudista',
}

export const AccessDifficultyLabels = {
  easy: 'Acceso fácil',
  moderate: 'Acceso moderado',
  hard: 'Acceso difícil',
} as const
export type AccessDifficulty = keyof typeof AccessDifficultyLabels

export const OccupancyLabels = {
  low: 'Poca ocupación',
  medium: 'Ocupación media',
  high: 'Mucha ocupación',
} as const
export type OccupancyLevel = keyof typeof OccupancyLabels

export type BeachSearchParams = {
  q?: string
  municipality?: number[]
  sea?: number[]
  services?: number[]
  activities?: number[]
  tags?: number[]
  dogFriendly?: true
  lifeguard?: true
  childSafe?: true
  naturalShade?: true
  nudist?: true
  accessDifficulty?: AccessDifficulty[]
  occupancy?: OccupancyLevel[]
  sort?:
    | 'recomendados'
    | 'name'
    | 'municipality'
    | 'length'
    | 'occupancy'
    | 'cercania'
}

export function countActiveFilters(filters: BeachSearchParams): number {
  return (
    (filters.municipality?.length ?? 0) +
    (filters.sea?.length ?? 0) +
    (filters.services?.length ?? 0) +
    (filters.activities?.length ?? 0) +
    (filters.tags?.length ?? 0) +
    NeedFilterKeys.filter((key) => filters[key]).length +
    (filters.accessDifficulty?.length ?? 0) +
    (filters.occupancy?.length ?? 0)
  )
}

const OccupancyOrder = { low: 0, medium: 1, high: 2 } as const

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function filterBeaches(
  beaches: Beach[],
  params: BeachSearchParams,
): Beach[] {
  let result = beaches

  if (params.q?.trim()) {
    const query = normalizeText(params.q.trim())
    result = result.filter((beach) => normalizeText(beach.name).includes(query))
  }

  if (params.municipality && params.municipality.length > 0) {
    const set = new Set(params.municipality)
    result = result.filter((beach) => set.has(beach.municipality))
  }

  if (params.sea && params.sea.length > 0) {
    const set = new Set(params.sea)
    result = result.filter((beach) => set.has(beach.sea))
  }

  if (params.services && params.services.length > 0) {
    const required = params.services
    result = result.filter((beach) =>
      required.every((s) => beach.services.includes(s)),
    )
  }

  if (params.activities && params.activities.length > 0) {
    const required = params.activities
    result = result.filter((beach) =>
      required.every((a) => beach.activities.includes(a)),
    )
  }

  if (params.tags && params.tags.length > 0) {
    const required = params.tags
    result = result.filter(
      (beach) => beach.tags && required.every((t) => beach.tags!.includes(t)),
    )
  }

  for (const key of NeedFilterKeys) {
    if (params[key]) {
      result = result.filter((beach) => beach[key] === true)
    }
  }

  if (params.accessDifficulty && params.accessDifficulty.length > 0) {
    const set = new Set<string>(params.accessDifficulty)
    result = result.filter(
      (beach) => beach.accessDifficulty && set.has(beach.accessDifficulty),
    )
  }

  if (params.occupancy && params.occupancy.length > 0) {
    const set = new Set<string>(params.occupancy)
    result = result.filter(
      (beach) => beach.occupancyLevel && set.has(beach.occupancyLevel),
    )
  }

  return result
}

export function sortBeaches(
  beaches: Beach[],
  sort: BeachSearchParams['sort'],
  origin?: LatLng,
): Beach[] {
  const copy = [...beaches]

  switch (sort) {
    case 'cercania': {
      // Without a known position there is nothing to rank by
      if (!origin) {
        return copy.sort(
          (a, b) => b.recommendationScore - a.recommendationScore,
        )
      }
      const distances = new Map(
        copy.map((beach) => [
          beach.code,
          haversineKm(origin, beach.coordinates),
        ]),
      )
      return copy.sort(
        (a, b) => (distances.get(a.code) ?? 0) - (distances.get(b.code) ?? 0),
      )
    }
    case 'recomendados':
      return copy.sort((a, b) => b.recommendationScore - a.recommendationScore)
    case 'name':
      return copy.sort((a, b) =>
        normalizeText(a.name).localeCompare(normalizeText(b.name)),
      )
    case 'municipality':
      return copy.sort((a, b) => a.municipality - b.municipality)
    case 'length':
      return copy.sort((a, b) => {
        if (a.length == null && b.length == null) return 0
        if (a.length == null) return 1
        if (b.length == null) return -1
        return b.length - a.length
      })
    case 'occupancy':
      return copy.sort((a, b) => {
        const aOrder = a.occupancyLevel ? OccupancyOrder[a.occupancyLevel] : -1
        const bOrder = b.occupancyLevel ? OccupancyOrder[b.occupancyLevel] : -1
        return aOrder - bOrder
      })
    default:
      return copy.sort((a, b) => b.recommendationScore - a.recommendationScore)
  }
}

export function applyFiltersAndSort(
  beaches: Beach[],
  params: BeachSearchParams,
  origin?: LatLng,
): Beach[] {
  return sortBeaches(filterBeaches(beaches, params), params.sort, origin)
}
