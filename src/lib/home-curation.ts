import type { Beach } from '@/types/beach'

import type { NavMunicipalityWithBlueFlag } from './nav-builders'

// pictureQualityScore only measures resolution and framing, not subject: its
// top entries include a signpost and high-rises. Editors pick these by eye,
// and the first entry becomes the large feature card.
export const FEATURED_BEACH_CODES = [
  '645', // Playa de El Rincón
  '512', // Cala Cortina
  '668', // Playa de Colón, so the Mar Menor is always represented
  '590', // Playa de Calblanque
  '589', // Playa La Carolina
  '614', // Playa de El Hornillo
] as const

// One daylight water-and-sand photo per coastal municipality, none of them a
// featured beach, so no photo repeats on the page. Order is irrelevant: each
// code is matched to its municipality through the beach.
const MUNICIPALITY_COVER_CODES = [
  '556', // Cartagena: Cala del Barco
  '663', // Lorca: Cala de Calnegre
  '615', // Águilas: Playa Amarilla
  '646', // Mazarrón: Playa de Bolnuevo
  '543', // San Javier: Playa Chica
  '690', // Los Alcázares: Playa del Espejo
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
