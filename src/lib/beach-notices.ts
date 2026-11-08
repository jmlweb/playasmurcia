// Small per-beach facts bundled at build time (see LRN-027): no DB column, no migration.
import accessRestrictions from '../../data/access-restrictions.json'
import smokeFreeBeaches from '../../data/smoke-free-beaches.json'

export type SmokeFreeEntry = {
  /** Beach name as the regional list writes it */
  name: string
  /** Covered stretch when the list names only part of the beach */
  stretch?: string
}

export type AccessRestriction = {
  /** Year the rule was published for */
  year: number
  /** Whether a new order is published each year */
  recurring: boolean
  summary: string
  shuttle?: string
  sourceLabel: string
  sourceUrl: string
  shuttleSourceLabel?: string
  shuttleSourceUrl?: string
}

const smokeFreeValues: Record<string, SmokeFreeEntry> = smokeFreeBeaches.values
const accessValues: Record<string, AccessRestriction> =
  accessRestrictions.values

export const smokeFreeSource = {
  label: smokeFreeBeaches.source,
  url: smokeFreeBeaches.sourceUrl,
  listDate: smokeFreeBeaches.listDate,
}

export const getSmokeFreeEntry = (code: string): SmokeFreeEntry | undefined =>
  smokeFreeValues[code]

export const getAccessRestriction = (
  code: string,
): AccessRestriction | undefined => accessValues[code]
