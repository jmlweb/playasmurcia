import type { Beach } from '@/types/beach'

export type BeachSearchParams = {
  q?: string
  municipality?: number[]
  sea?: number[]
  services?: number[]
  activities?: number[]
  tags?: number[]
  sort?: 'recomendados' | 'name' | 'municipality' | 'length' | 'occupancy'
}

export function countActiveFilters(filters: BeachSearchParams): number {
  return (
    (filters.municipality?.length ?? 0) +
    (filters.sea?.length ?? 0) +
    (filters.services?.length ?? 0) +
    (filters.activities?.length ?? 0) +
    (filters.tags?.length ?? 0)
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

  return result
}

export function sortBeaches(
  beaches: Beach[],
  sort: BeachSearchParams['sort'],
): Beach[] {
  const copy = [...beaches]

  switch (sort) {
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
): Beach[] {
  return sortBeaches(filterBeaches(beaches, params), params.sort)
}
