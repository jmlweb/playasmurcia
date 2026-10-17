import type { BeachSearchParams } from '@/lib/beach-filters'

import {
  AccessDifficultyLabels,
  NeedFilterKeys,
  OccupancyLabels,
} from '@/lib/beach-filters'

type ExplorerSearchParams = BeachSearchParams & { page?: number }

function parseNumberArray(value: unknown): number[] | undefined {
  if (Array.isArray(value)) {
    const nums = value.map(Number).filter((n) => !isNaN(n))
    return nums.length > 0 ? nums : undefined
  }
  if (typeof value === 'string') {
    const n = Number(value)
    return isNaN(n) ? undefined : [n]
  }
  return undefined
}

function parseFlag(value: unknown): true | undefined {
  return value === true || value === 'true' ? true : undefined
}

function parseEnumArray<TValue extends string>(
  value: unknown,
  allowed: Record<TValue, string>,
): TValue[] | undefined {
  const items = Array.isArray(value) ? value : [value]
  const valid = items.filter(
    (item): item is TValue => typeof item === 'string' && item in allowed,
  )
  return valid.length > 0 ? [...new Set(valid)] : undefined
}

export function validateSearch(
  search: Record<string, unknown>,
): ExplorerSearchParams {
  return {
    q: typeof search.q === 'string' ? search.q : undefined,
    municipality: parseNumberArray(search.municipality),
    sea: parseNumberArray(search.sea),
    services: parseNumberArray(search.services),
    activities: parseNumberArray(search.activities),
    tags: parseNumberArray(search.tags),
    ...Object.fromEntries(
      NeedFilterKeys.map((key) => [key, parseFlag(search[key])]),
    ),
    accessDifficulty: parseEnumArray(
      search.accessDifficulty,
      AccessDifficultyLabels,
    ),
    occupancy: parseEnumArray(search.occupancy, OccupancyLabels),
    sort:
      search.sort === 'recomendados' ||
      search.sort === 'name' ||
      search.sort === 'municipality' ||
      search.sort === 'length' ||
      search.sort === 'occupancy' ||
      search.sort === 'cercania'
        ? search.sort
        : undefined,
    page:
      typeof search.page === 'number' && search.page > 0
        ? Math.floor(search.page)
        : undefined,
  }
}
