import type { BeachSearchParams } from '@/lib/beach-filters'

import {
  AccessDifficultyLabels,
  NeedFilterKeys,
  OccupancyLabels,
} from '@/lib/beach-filters'

type ListingSearchParams = Pick<BeachSearchParams, 'sort'> & { page?: number }
type ExplorerSearchParams = BeachSearchParams & {
  page?: number
  view?: 'map'
}

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

function parseSort(value: unknown): BeachSearchParams['sort'] {
  return value === 'recomendados' ||
    value === 'name' ||
    value === 'municipality' ||
    value === 'length' ||
    value === 'occupancy' ||
    value === 'cercania'
    ? value
    : undefined
}

function parsePage(value: unknown): number | undefined {
  return typeof value === 'number' && value > 0 ? Math.floor(value) : undefined
}

function parseNeedFilters(search: Record<string, unknown>) {
  return Object.fromEntries(
    NeedFilterKeys.map((key) => [key, parseFlag(search[key])]),
  )
}

/** Sort and page of a listing that has no position to rank "Cerca de mí" by */
export function validateListingSearch(
  search: Record<string, unknown>,
): ListingSearchParams {
  const sort = parseSort(search.sort)
  return {
    sort: sort === 'cercania' ? undefined : sort,
    page: parsePage(search.page),
  }
}

export function validateMunicipalitySearch(
  search: Record<string, unknown>,
): BeachSearchParams & ListingSearchParams {
  return {
    ...validateListingSearch(search),
    ...parseNeedFilters(search),
    accessDifficulty: parseEnumArray(
      search.accessDifficulty,
      AccessDifficultyLabels,
    ),
    occupancy: parseEnumArray(search.occupancy, OccupancyLabels),
  }
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
    ...parseNeedFilters(search),
    accessDifficulty: parseEnumArray(
      search.accessDifficulty,
      AccessDifficultyLabels,
    ),
    occupancy: parseEnumArray(search.occupancy, OccupancyLabels),
    sort: parseSort(search.sort),
    page: parsePage(search.page),
    view: search.view === 'map' ? 'map' : undefined,
  }
}
