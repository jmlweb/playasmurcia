import { municipalityToSlug } from '@/lib/slugs'
import type { Beach, Municipality } from '@/types/beach'

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

export function buildCharacteristicCounts(
  beaches: Beach[],
): NavCharacteristic[] {
  return [
    {
      label: 'Bandera azul',
      href: '/colecciones/bandera-azul',
      count: beaches.filter((b) => b.certifications?.includes('blue-flag'))
        .length,
    },
    {
      label: 'Accesible',
      href: '/colecciones/accesibles',
      count: beaches.filter((b) => b.accessDifficulty === 'easy').length,
    },
    {
      label: 'Nudista',
      href: '/colecciones/playas-nudistas',
      count: beaches.filter((b) => b.nudist).length,
    },
    {
      label: 'Pet friendly',
      href: '/colecciones/playas-para-perros',
      count: beaches.filter((b) => b.dogFriendly).length,
    },
    {
      label: 'Familiares',
      href: '/colecciones/playas-familiares',
      count: beaches.filter((b) => b.childSafe).length,
    },
  ]
}

export function countBlueFlag(beaches: Beach[]): number {
  return beaches.filter((b) => b.certifications?.includes('blue-flag')).length
}
