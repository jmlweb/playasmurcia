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

function nonEmpty<TValue>(values: TValue[] | undefined) {
  return values?.length ? values : undefined
}

/**
 * Next URL state for a filter change. `next` is the whole filter selection: a
 * filter it omits is off, so a reset only has to leave keys out.
 */
export function mergeExplorerSearch(
  prev: ExplorerSearchParams,
  next: BeachSearchParams,
  page?: number,
): ExplorerSearchParams {
  return {
    ...prev,
    ...next,
    ...Object.fromEntries(
      NeedFilterKeys.map((key) => [key, next[key] || undefined]),
    ),
    municipality: nonEmpty(next.municipality),
    sea: nonEmpty(next.sea),
    services: nonEmpty(next.services),
    activities: nonEmpty(next.activities),
    tags: nonEmpty(next.tags),
    accessDifficulty: nonEmpty(next.accessDifficulty),
    occupancy: nonEmpty(next.occupancy),
    q: next.q || undefined,
    page: page && page > 1 ? page : undefined,
  }
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
    blueFlag: parseFlag(search.blueFlag),
    flagGreen: parseFlag(search.flagGreen),
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
