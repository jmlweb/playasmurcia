import type { BeachSearchParams } from '@/lib/beach-filters'

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
    sort:
      search.sort === 'recomendados' ||
      search.sort === 'name' ||
      search.sort === 'municipality' ||
      search.sort === 'length' ||
      search.sort === 'occupancy'
        ? search.sort
        : undefined,
    page:
      typeof search.page === 'number' && search.page > 0
        ? Math.floor(search.page)
        : undefined,
  }
}
