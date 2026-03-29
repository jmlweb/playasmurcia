import type { Beach } from '@/types/beach'

// ---------------------------------------------------------------------------
// Named constants for 0-based indices (insertion-order in data/*.json).
// These MUST stay in sync with the DB seed data. If a migration reorders
// rows, update these constants accordingly.
// ---------------------------------------------------------------------------

// Tags (data/tags.json)
const TAG_CALAS = 1
const TAG_FAMILIAR = 2
const TAG_AGUAS_TRANQUILAS = 3
const TAG_ACCESIBLE = 6
const TAG_SNORKEL = 8
const TAG_SALVAJE = 9
const TAG_AISLADA = 10
const TAG_FOTOGENICA = 15
const TAG_PUESTA_SOL = 16

// Services (data/services.json)
const SERVICE_CHIRINGUITO = 6
const SERVICE_WHEELCHAIR_RAMP = 8

// Activities (data/activities.json)
const ACTIVITY_SNORKELING = 1
const ACTIVITY_KAYAK = 2
const ACTIVITY_PADDLEBOARD = 3
const ACTIVITY_DIVING = 4
const ACTIVITY_VOLLEYBALL = 9

// Seas (data/seas.json)
const SEA_MEDITERRANEO = 0
const SEA_MAR_MENOR = 1

// ---------------------------------------------------------------------------

export type Collection = {
  slug: string
  title: string
  description: string
  metaDescription: string
  filterFn: (beach: Beach) => boolean
}

export const seaCollections: Collection[] = [
  {
    slug: 'mar-mediterraneo',
    title: 'Mar Mediterráneo',
    description:
      'Aguas cristalinas y profundas, calas espectaculares entre acantilados y oleaje moderado ideal para deportes acuáticos.',
    metaDescription:
      'Playas del Mediterráneo en Murcia. Calas, acantilados y aguas cristalinas en la Costa Cálida.',
    filterFn: (b) => b.sea === SEA_MEDITERRANEO,
  },
  {
    slug: 'mar-menor',
    title: 'Mar Menor',
    description:
      'La laguna salada más grande de Europa. Aguas cálidas, poco profundas y sin oleaje, perfectas para familias y deportes de vela.',
    metaDescription:
      'Playas del Mar Menor en Murcia. Aguas cálidas y tranquilas, ideales para familias.',
    filterFn: (b) => b.sea === SEA_MAR_MENOR,
  },
]

export const collections: Collection[] = [
  {
    slug: 'calas-escondidas',
    title: 'Calas Escondidas',
    description:
      'Descubre las calas más secretas y aisladas de la costa murciana. Rincones naturales alejados del turismo masivo.',
    metaDescription:
      'Calas escondidas y secretas en Murcia. Descubre rincones naturales aislados en la Costa Cálida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        tags.includes(TAG_CALAS) &&
        (tags.includes(TAG_AISLADA) || tags.includes(TAG_SALVAJE))
      )
    },
  },
  {
    slug: 'playas-familiares',
    title: 'Playas Familiares',
    description:
      'Playas seguras y cómodas para disfrutar en familia. Aguas tranquilas, servicios y socorristas.',
    metaDescription:
      'Mejores playas familiares en Murcia. Aguas tranquilas, arena fina y servicios para toda la familia.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        (tags.includes(TAG_FAMILIAR) || tags.includes(TAG_AGUAS_TRANQUILAS)) &&
        b.lifeguard
      )
    },
  },
  {
    slug: 'playas-para-perros',
    title: 'Playas para Perros',
    description:
      'Playas caninas oficiales donde tu mascota es bienvenida. Disfruta de la costa con tu mejor amigo.',
    metaDescription:
      'Playas para perros en Murcia. Encuentra las playas caninas oficiales de la Costa Cálida.',
    filterFn: (b) => b.dogFriendly,
  },
  {
    slug: 'playas-nudistas',
    title: 'Playas Nudistas',
    description:
      'Las mejores playas nudistas y de práctica libre de la Región de Murcia.',
    metaDescription:
      'Playas nudistas en Murcia. Descubre las playas naturistas de la Costa Cálida.',
    filterFn: (b) => b.nudist,
  },
  {
    slug: 'con-chiringuito',
    title: 'Con Chiringuito',
    description:
      'Playas con chiringuito o restaurante donde disfrutar de una comida o bebida frente al mar.',
    metaDescription:
      'Playas con chiringuito en Murcia. Come y bebe frente al mar en la Costa Cálida.',
    filterFn: (b) => b.services.includes(SERVICE_CHIRINGUITO),
  },
  {
    slug: 'bandera-azul',
    title: 'Bandera Azul',
    description:
      'Playas certificadas con Bandera Azul, garantía de calidad del agua, servicios y gestión ambiental.',
    metaDescription:
      'Playas Bandera Azul en Murcia. Las playas con mejor calidad certificada de la Costa Cálida.',
    filterFn: (b) => b.certifications?.includes('blue-flag') ?? false,
  },
  {
    slug: 'snorkel',
    title: 'Para Hacer Snorkel',
    description:
      'Las mejores playas y calas para practicar snorkel. Fondos marinos espectaculares.',
    metaDescription:
      'Mejores playas para snorkel en Murcia. Fondos marinos y aguas cristalinas en la Costa Cálida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        tags.includes(TAG_SNORKEL) || b.activities.includes(ACTIVITY_SNORKELING)
      )
    },
  },
  {
    slug: 'deportes-acuaticos',
    title: 'Deportes Acuáticos',
    description:
      'Playas ideales para kayak, paddle surf, windsurf y kitesurf en la costa murciana.',
    metaDescription:
      'Deportes acuáticos en playas de Murcia. Kayak, paddle surf, windsurf y más.',
    filterFn: (b) =>
      b.activities.includes(ACTIVITY_KAYAK) ||
      b.activities.includes(ACTIVITY_PADDLEBOARD) ||
      b.activities.includes(ACTIVITY_DIVING) ||
      b.activities.includes(ACTIVITY_VOLLEYBALL),
  },
  {
    slug: 'mejores-atardeceres',
    title: 'Mejores Atardeceres',
    description:
      'Playas con orientación oeste donde disfrutar de puestas de sol espectaculares.',
    metaDescription:
      'Mejores atardeceres en playas de Murcia. Puestas de sol impresionantes en la Costa Cálida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        tags.includes(TAG_PUESTA_SOL) ||
        b.orientation === 'west' ||
        b.orientation === 'southwest'
      )
    },
  },
  {
    slug: 'playas-tranquilas',
    title: 'Playas Poco Masificadas',
    description:
      'Playas con baja ocupación para quienes buscan tranquilidad y espacio.',
    metaDescription:
      'Playas tranquilas y poco masificadas en Murcia. Encuentra tu rincón de paz en la Costa Cálida.',
    filterFn: (b) => b.occupancyLevel === 'low',
  },
  {
    slug: 'accesibles',
    title: 'Playas Accesibles',
    description:
      'Playas con accesibilidad adaptada: rampas, pasarelas y servicios para personas con movilidad reducida.',
    metaDescription:
      'Playas accesibles en Murcia. Rampas, pasarelas y servicios adaptados en la Costa Cálida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        tags.includes(TAG_ACCESIBLE) ||
        b.services.includes(SERVICE_WHEELCHAIR_RAMP)
      )
    },
  },
  {
    slug: 'playas-fotogenicas',
    title: 'Playas Fotogénicas',
    description:
      'Las playas más fotografiadas de la Región de Murcia. Paisajes de postal.',
    metaDescription:
      'Playas más bonitas y fotogénicas de Murcia. Paisajes espectaculares en la Costa Cálida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return tags.includes(TAG_FOTOGENICA)
    },
  },
]

export const allCollections: Collection[] = [...seaCollections, ...collections]

export function getCollectionBySlug(slug: string): Collection | undefined {
  return allCollections.find((c) => c.slug === slug)
}

export function filterBeachesByCollection(
  beaches: Beach[],
  collection: Collection,
): Beach[] {
  return beaches.filter(collection.filterFn)
}
