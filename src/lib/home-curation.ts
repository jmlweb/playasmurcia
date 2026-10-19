import type { Beach } from '@/types/beach'

import type { NavMunicipalityWithBlueFlag } from './nav-builders'

// pictureQualityScore only measures resolution and framing, not subject: its
// top entries include a signpost and high-rises. Editors pick these by eye,
// and the first entry becomes the large feature card.
export const FEATURED_BEACH_CODES = [
  '645', // Playa de El Rincón
  '512', // Cala Cortina
  '654', // Playa de El Mojón
  '590', // Playa de Calblanque
  '589', // Playa La Carolina
  '614', // Playa de El Hornillo
] as const

// One daylight water-and-sand photo per coastal municipality. Order is
// irrelevant: each code is matched to its municipality through the beach.
const MUNICIPALITY_COVER_CODES = [
  '512', // Cartagena: Cala Cortina
  '663', // Lorca: Cala de Calnegre
  '589', // Águilas: Playa La Carolina
  '645', // Mazarrón: Playa de El Rincón
  '668', // San Javier: Playa de Colón
  '692', // Los Alcázares: Playa Carrión
  '546', // San Pedro del Pinatar: Playa de La Torre Derribada
  '560', // La Unión: Playa de Portmán
] as const

export type MunicipalityCardData = NavMunicipalityWithBlueFlag & {
  coverPicture?: string
}

function hasPicture(beach: Beach): boolean {
  return Boolean(beach.pictures?.length)
}

export function selectFeaturedBeaches(
  beaches: Beach[],
  codes: readonly string[] = FEATURED_BEACH_CODES,
): Beach[] {
  const byCode = new Map(beaches.map((b) => [b.code, b]))
  return codes
    .map((code) => byCode.get(code))
    .filter((b): b is Beach => b !== undefined && hasPicture(b))
}

export function addMunicipalityCovers(
  nav: NavMunicipalityWithBlueFlag[],
  beaches: Beach[],
  coverCodes: readonly string[] = MUNICIPALITY_COVER_CODES,
): MunicipalityCardData[] {
  const byCode = new Map(beaches.map((b) => [b.code, b]))
  const curated = coverCodes
    .map((code) => byCode.get(code))
    .filter((b): b is Beach => b !== undefined && hasPicture(b))

  return nav.map((m, index) => {
    const cover =
      curated.find((b) => b.municipality === index) ??
      beaches
        .filter((b) => b.municipality === index && hasPicture(b))
        .sort(
          (a, b) => (b.pictureQualityScore ?? 0) - (a.pictureQualityScore ?? 0),
        )
        .at(0)
    return { ...m, coverPicture: cover?.pictures?.[0] }
  })
}
