import type { BeachSearchParams } from '@/lib/beach-filters'
import type {
  Activity,
  Beach,
  Municipality,
  Sea,
  Service,
  Tag,
} from '@/types/beach'

import {
  AccessDifficultyLabels,
  normalizeText,
  OccupancyLabels,
} from '@/lib/beach-filters'
import { canonicalUrl } from '@/lib/canonical'
import { beachToSlug } from '@/lib/slugs'

import type { SearchFlagKey, SearchToolInput } from './tool-input'

import { SearchFlagKeys } from './tool-input'

/** Lookup tables the explorer already loads; indexes are array positions. */
export type BeachCatalog = {
  municipalities: Municipality[]
  seas: Sea[]
  services: Service[]
  activities: Activity[]
  tags: Tag[]
}

export type ResolvedSearch = {
  params: BeachSearchParams
  // Names the agent sent that match nothing, so it can rephrase
  unresolved: string[]
}

function findIndex(
  items: readonly { name: string; id?: string }[],
  needle: string,
): number {
  const target = normalizeText(needle)
  const exact = items.findIndex(
    (item) =>
      normalizeText(item.name) === target ||
      (item.id !== undefined && normalizeText(item.id) === target),
  )
  if (exact >= 0) return exact
  return items.findIndex((item) => normalizeText(item.name).includes(target))
}

function resolveList(
  items: readonly { name: string; id?: string }[],
  needles: string[] | undefined,
  unresolved: string[],
): number[] | undefined {
  if (!needles) return undefined
  const indexes = needles
    .map((needle) => {
      const index = findIndex(items, needle)
      if (index < 0) unresolved.push(needle)
      return index
    })
    .filter((index) => index >= 0)
  return indexes.length > 0 ? [...new Set(indexes)] : undefined
}

/** Maps human-readable agent input onto the explorer's numeric filters. */
export function buildSearchParams(
  input: SearchToolInput,
  catalog: BeachCatalog,
): ResolvedSearch {
  const unresolved: string[] = []
  const flags = Object.fromEntries(
    SearchFlagKeys.filter((key) => input[key]).map((key) => [key, true]),
  ) as Partial<Record<SearchFlagKey, true>>

  const params: BeachSearchParams = {
    q: input.query,
    municipality: resolveList(
      catalog.municipalities,
      input.municipality ? [input.municipality] : undefined,
      unresolved,
    ),
    sea: resolveList(
      catalog.seas,
      input.sea ? [input.sea] : undefined,
      unresolved,
    ),
    services: resolveList(catalog.services, input.services, unresolved),
    activities: resolveList(catalog.activities, input.activities, unresolved),
    tags: resolveList(catalog.tags, input.tags, unresolved),
    accessDifficulty: input.accessDifficulty
      ? [input.accessDifficulty]
      : undefined,
    occupancy: input.occupancy ? [input.occupancy] : undefined,
    sort: input.sort,
    ...flags,
  }

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]: [string, unknown]) => value !== undefined,
    ),
  ) as BeachSearchParams

  return { params: cleaned, unresolved }
}

export type BeachSummary = {
  name: string
  slug: string
  url: string
  municipality: string
  sea: string
  coordinates: [number, number]
  lengthMeters?: number
  occupancy?: string
  accessDifficulty?: string
  dogFriendly: boolean
  lifeguard: boolean
  childSafe: boolean
  naturalShade: boolean
  nudist: boolean
  certifications: string[]
  services: string[]
  activities: string[]
  tags: string[]
}

const names = (items: readonly { name: string }[], indexes: number[]) =>
  indexes.map((index) => items[index]?.name).filter((name) => !!name)

/** Compact, agent-friendly view of a beach with ids resolved to names. */
export function summarizeBeach(
  beach: Beach,
  catalog: BeachCatalog,
): BeachSummary {
  const slug = beachToSlug(beach)
  return {
    name: beach.name,
    slug,
    url: canonicalUrl(`/playas/${slug}`),
    municipality: catalog.municipalities[beach.municipality]?.name ?? '',
    sea: catalog.seas[beach.sea]?.name ?? '',
    coordinates: beach.coordinates,
    lengthMeters: beach.length,
    occupancy: beach.occupancyLevel
      ? OccupancyLabels[beach.occupancyLevel]
      : undefined,
    accessDifficulty: beach.accessDifficulty
      ? AccessDifficultyLabels[beach.accessDifficulty]
      : undefined,
    dogFriendly: beach.dogFriendly,
    lifeguard: beach.lifeguard,
    childSafe: beach.childSafe === true,
    naturalShade: beach.naturalShade === true,
    nudist: beach.nudist,
    certifications: beach.certifications ?? [],
    services: names(catalog.services, beach.services),
    activities: names(catalog.activities, beach.activities),
    tags: names(catalog.tags, beach.tags ?? []),
  }
}
