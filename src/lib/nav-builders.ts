import type { Beach, Municipality } from '@/types/beach'

import { getCollectionBySlug } from '@/lib/collections'
import { municipalityToSlug } from '@/lib/slugs'

export type NavMunicipality = {
  name: string
  slug: string
  beachCount: number
}

export type NavMunicipalityWithBlueFlag = NavMunicipality & {
  blueFlagCount: number
}

export type NavCharacteristic = {
  label: string
  href: string
  count: number
}

export type NavData = {
  municipalities: NavMunicipality[]
  characteristics: NavCharacteristic[]
}

export function buildMunicipalityNav(
  beaches: Beach[],
  municipalities: Municipality[],
): NavMunicipality[] {
  return municipalities.map((m, i) => ({
    name: m.name,
    slug: municipalityToSlug(m),
    beachCount: beaches.filter((b) => b.municipality === i).length,
  }))
}

export function buildMunicipalityNavWithBlueFlag(
  beaches: Beach[],
  municipalities: Municipality[],
): NavMunicipalityWithBlueFlag[] {
  return municipalities.map((m, i) => {
    const municipalityBeaches = beaches.filter((b) => b.municipality === i)
    return {
      name: m.name,
      slug: municipalityToSlug(m),
      beachCount: municipalityBeaches.length,
      blueFlagCount: municipalityBeaches.filter((b) =>
        b.certifications?.includes('blue-flag'),
      ).length,
    }
  })
}

// Footer counts must match the collection pages they link to, so they reuse
// each collection's filter instead of duplicating the criteria here.
const FOOTER_COLLECTIONS = [
  { label: 'Bandera Azul', slug: 'bandera-azul' },
  { label: 'Accesibles', slug: 'accesibles' },
  { label: 'Nudistas', slug: 'playas-nudistas' },
  { label: 'Para perros', slug: 'playas-para-perros' },
  { label: 'Familiares', slug: 'playas-familiares' },
] as const

export function buildCharacteristicCounts(
  beaches: Beach[],
): NavCharacteristic[] {
  return FOOTER_COLLECTIONS.map(({ label, slug }) => {
    const collection = getCollectionBySlug(slug)
    return {
      label,
      href: `/colecciones/${slug}`,
      count: collection ? beaches.filter(collection.filterFn).length : 0,
    }
  })
}

export function countBlueFlag(beaches: Beach[]): number {
  return beaches.filter((b) => b.certifications?.includes('blue-flag')).length
}
