import type { Beach, Municipality } from '@/types/beach'

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[().]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// URLs indexed before parentheses and periods were stripped; kept only so
// they can 301 to the current slug.
export function legacyNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Beaches that share a name with another beach in a different municipality.
 * The other beach of each pair keeps the bare name slug because that URL is
 * already indexed; only the beaches listed here get a municipality suffix.
 */
const MUNICIPALITY_QUALIFIED_BEACHES: Readonly<Record<string, string>> = {
  '586': 'mazarron', // Playa Amarilla (615 in Águilas keeps the bare slug)
  '693': 'aguilas', // Playa de Levante (525 in Cartagena)
  '596': 'aguilas', // Playa de Poniente (564 in San Javier)
  '627': 'cartagena', // Playa Larga (5907 in Lorca)
  '6703': 'lorca', // Playa Parazuelos (633 in Mazarrón)
}

/**
 * Retired URLs that cannot be derived from the current name (the period was
 * removed from the name itself, so its legacy slug no longer matches).
 */
const RETIRED_SLUG_REDIRECTS: Readonly<Record<string, string>> = {
  'cala-mijo.-(cueva-de-las-palomas)': 'cala-mijo-cueva-de-las-palomas',
}

type SluggableBeach = Pick<Beach, 'code' | 'name'>

export function beachToSlug<T extends SluggableBeach>(beach: T): string {
  const base = nameToSlug(beach.name)
  const municipalitySuffix = MUNICIPALITY_QUALIFIED_BEACHES[beach.code]
  return municipalitySuffix ? `${base}-${municipalitySuffix}` : base
}

export function municipalityToSlug(municipality: Municipality): string {
  return nameToSlug(municipality.name)
}

export type SlugIndex = {
  slugToCode: Map<string, string>
  retiredSlugToSlug: Map<string, string>
}

export function buildSlugIndex(beaches: readonly SluggableBeach[]): SlugIndex {
  const slugToCode = new Map(beaches.map((b) => [beachToSlug(b), b.code]))
  const retiredSlugToSlug = new Map<string, string>([
    ...beaches
      .map((b) => [legacyNameToSlug(b.name), beachToSlug(b)] as const)
      // A legacy slug that is still a live slug must keep serving its beach.
      .filter(
        ([legacy, current]) => legacy !== current && !slugToCode.has(legacy),
      ),
    ...Object.entries(RETIRED_SLUG_REDIRECTS),
  ])
  return { slugToCode, retiredSlugToSlug }
}
