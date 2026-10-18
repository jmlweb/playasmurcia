import type { AccessDifficulty, OccupancyLevel } from '@/lib/beach-filters'

import { AccessDifficultyLabels, OccupancyLabels } from '@/lib/beach-filters'

export const SearchSortValues = [
  'recomendados',
  'name',
  'municipality',
  'length',
  'occupancy',
] as const
export type SearchSort = (typeof SearchSortValues)[number]

export const SearchFlagKeys = [
  'dogFriendly',
  'lifeguard',
  'childSafe',
  'naturalShade',
  'nudist',
] as const
export type SearchFlagKey = (typeof SearchFlagKeys)[number]

export type SearchToolInput = {
  query?: string
  municipality?: string
  sea?: string
  services?: string[]
  activities?: string[]
  tags?: string[]
  accessDifficulty?: AccessDifficulty
  occupancy?: OccupancyLevel
  sort?: SearchSort
  limit: number
} & Partial<Record<SearchFlagKey, true>>

export const DEFAULT_SEARCH_LIMIT = 10
export const MAX_SEARCH_LIMIT = 50

function asText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function asTextList(value: unknown): string[] | undefined {
  const items = Array.isArray(value) ? value : [value]
  const texts = items.map(asText).filter((item): item is string => !!item)
  return texts.length > 0 ? texts : undefined
}

function asEnum<TValue extends string>(
  value: unknown,
  allowed: Record<TValue, string>,
): TValue | undefined {
  return typeof value === 'string' && value in allowed
    ? (value as TValue)
    : undefined
}

function asLimit(value: unknown): number {
  const n = typeof value === 'string' ? Number(value) : value
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_SEARCH_LIMIT
  return Math.min(MAX_SEARCH_LIMIT, Math.max(1, Math.floor(n)))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Coerces untrusted agent input into a typed search request. */
export function parseSearchInput(data: unknown): SearchToolInput {
  const input = isRecord(data) ? data : {}
  const flags = Object.fromEntries(
    SearchFlagKeys.filter(
      (key) => input[key] === true || input[key] === 'true',
    ).map((key) => [key, true as const]),
  )
  const sort = SearchSortValues.find((value) => value === input.sort)

  return {
    query: asText(input.query),
    municipality: asText(input.municipality),
    sea: asText(input.sea),
    services: asTextList(input.services),
    activities: asTextList(input.activities),
    tags: asTextList(input.tags),
    accessDifficulty: asEnum(input.accessDifficulty, AccessDifficultyLabels),
    occupancy: asEnum(input.occupancy, OccupancyLabels),
    sort,
    limit: asLimit(input.limit),
    ...flags,
  }
}

export function parseSlugInput(data: unknown): { slug: string } {
  const slug = isRecord(data) ? asText(data.slug) : undefined
  if (!slug) throw new Error('Invalid slug')
  return { slug: slug.toLowerCase() }
}
