import type { BeachSearchParams } from '@/lib/beach-filters'

import {
  AccessDifficultyLabels,
  NeedFilterKeys,
  NeedFilterLabels,
  OccupancyLabels,
  TodayFilterLabels,
} from '@/lib/beach-filters'

type Named = { name: string }

export type FilterLookups = {
  municipalities: readonly Named[]
  seas: readonly Named[]
  services: readonly Named[]
  activities: readonly Named[]
  tags: readonly Named[]
}

export type ActiveFilter = {
  key: string
  label: string
  /** The filters with only this one removed */
  without: BeachSearchParams
}

type IndexKey = 'municipality' | 'sea' | 'services' | 'activities' | 'tags'

const IndexedGroups: readonly {
  key: IndexKey
  prefix: string
  lookup: keyof FilterLookups
}[] = [
  { key: 'municipality', prefix: 'm', lookup: 'municipalities' },
  { key: 'sea', prefix: 's', lookup: 'seas' },
  { key: 'services', prefix: 'sv', lookup: 'services' },
  { key: 'activities', prefix: 'a', lookup: 'activities' },
  { key: 'tags', prefix: 't', lookup: 'tags' },
]

/** Every filter in effect as a removable item; the text search is not included. */
export function listActiveFilters(
  filters: BeachSearchParams,
  lookups: FilterLookups,
): ActiveFilter[] {
  const indexed = IndexedGroups.flatMap(({ key, prefix, lookup }) =>
    (filters[key] ?? []).flatMap((index) => {
      const item = lookups[lookup][index]
      return item
        ? [
            {
              key: `${prefix}-${index}`,
              label: item.name,
              without: {
                ...filters,
                [key]: filters[key]?.filter((value) => value !== index),
              },
            },
          ]
        : []
    }),
  )

  const flags = NeedFilterKeys.filter((key) => filters[key]).map((key) => ({
    key: `need-${key}`,
    label: NeedFilterLabels[key],
    without: { ...filters, [key]: undefined },
  }))

  const today = (['flagGreen', 'blueFlag'] as const)
    .filter((key) => filters[key])
    .map((key) => ({
      key: `today-${key}`,
      label: TodayFilterLabels[key],
      without: { ...filters, [key]: undefined },
    }))

  const access = (filters.accessDifficulty ?? []).map((level) => ({
    key: `access-${level}`,
    label: AccessDifficultyLabels[level],
    without: {
      ...filters,
      accessDifficulty: filters.accessDifficulty?.filter((v) => v !== level),
    },
  }))

  const occupancy = (filters.occupancy ?? []).map((level) => ({
    key: `occupancy-${level}`,
    label: OccupancyLabels[level],
    without: {
      ...filters,
      occupancy: filters.occupancy?.filter((v) => v !== level),
    },
  }))

  return [...today, ...indexed, ...flags, ...access, ...occupancy]
}
