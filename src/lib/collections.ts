import type { Beach } from '@/types/beach'

export interface Collection {
  slug: string
  title: string
  description: string
  metaDescription: string
  filterFn: (beach: Beach) => boolean
}

export const collections: Array<Collection> = [
  {
    slug: 'calas-escondidas',
    title: 'Calas Escondidas',
    description:
      'Descubre las calas mas secretas y aisladas de la costa murciana. Rincones naturales alejados del turismo masivo.',
    metaDescription:
      'Calas escondidas y secretas en Murcia. Descubre rincones naturales aislados en la Costa Calida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return tags.includes(1) && (tags.includes(10) || tags.includes(9))
    },
  },
  {
    slug: 'playas-familiares',
    title: 'Playas Familiares',
    description:
      'Playas seguras y comodas para disfrutar en familia. Aguas tranquilas, servicios y socorristas.',
    metaDescription:
      'Mejores playas familiares en Murcia. Aguas tranquilas, arena fina y servicios para toda la familia.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (tags.includes(2) || tags.includes(3)) && b.lifeguard
    },
  },
  {
    slug: 'playas-para-perros',
    title: 'Playas para Perros',
    description:
      'Playas caninas oficiales donde tu mascota es bienvenida. Disfruta de la costa con tu mejor amigo.',
    metaDescription:
      'Playas para perros en Murcia. Encuentra las playas caninas oficiales de la Costa Calida.',
    filterFn: (b) => b.dogFriendly,
  },
  {
    slug: 'playas-nudistas',
    title: 'Playas Nudistas',
    description:
      'Las mejores playas nudistas y de practica libre de la Region de Murcia.',
    metaDescription:
      'Playas nudistas en Murcia. Descubre las playas naturistas de la Costa Calida.',
    filterFn: (b) => b.nudist,
  },
  {
    slug: 'con-chiringuito',
    title: 'Con Chiringuito',
    description:
      'Playas con chiringuito o restaurante donde disfrutar de una comida o bebida frente al mar.',
    metaDescription:
      'Playas con chiringuito en Murcia. Come y bebe frente al mar en la Costa Calida.',
    filterFn: (b) => b.services.includes(6),
  },
  {
    slug: 'bandera-azul',
    title: 'Bandera Azul',
    description:
      'Playas certificadas con Bandera Azul, garantia de calidad del agua, servicios y gestion ambiental.',
    metaDescription:
      'Playas Bandera Azul en Murcia. Las playas con mejor calidad certificada de la Costa Calida.',
    filterFn: (b) => b.certifications?.includes('blue-flag') ?? false,
  },
  {
    slug: 'snorkel',
    title: 'Para Hacer Snorkel',
    description:
      'Las mejores playas y calas para practicar snorkel. Fondos marinos espectaculares.',
    metaDescription:
      'Mejores playas para snorkel en Murcia. Fondos marinos y aguas cristalinas en la Costa Calida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return tags.includes(8) || b.activities.includes(1)
    },
  },
  {
    slug: 'deportes-acuaticos',
    title: 'Deportes Acuaticos',
    description:
      'Playas ideales para kayak, paddle surf, windsurf y kitesurf en la costa murciana.',
    metaDescription:
      'Deportes acuaticos en playas de Murcia. Kayak, paddle surf, windsurf y mas.',
    filterFn: (b) =>
      b.activities.includes(2) ||
      b.activities.includes(3) ||
      b.activities.includes(4) ||
      b.activities.includes(9),
  },
  {
    slug: 'mejores-atardeceres',
    title: 'Mejores Atardeceres',
    description:
      'Playas con orientacion oeste donde disfrutar de puestas de sol espectaculares.',
    metaDescription:
      'Mejores atardeceres en playas de Murcia. Puestas de sol impresionantes en la Costa Calida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return (
        tags.includes(16) ||
        b.orientation === 'west' ||
        b.orientation === 'southwest'
      )
    },
  },
  {
    slug: 'playas-tranquilas',
    title: 'Playas Poco Masificadas',
    description:
      'Playas con baja ocupacion para quienes buscan tranquilidad y espacio.',
    metaDescription:
      'Playas tranquilas y poco masificadas en Murcia. Encuentra tu rincon de paz en la Costa Calida.',
    filterFn: (b) => b.occupancyLevel === 'low',
  },
  {
    slug: 'accesibles',
    title: 'Playas Accesibles',
    description:
      'Playas con accesibilidad adaptada: rampas, pasarelas y servicios para personas con movilidad reducida.',
    metaDescription:
      'Playas accesibles en Murcia. Rampas, pasarelas y servicios adaptados en la Costa Calida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return tags.includes(6) || b.services.includes(8)
    },
  },
  {
    slug: 'playas-fotogenicas',
    title: 'Playas Fotogenicas',
    description:
      'Las playas mas fotografiadas de la Region de Murcia. Paisajes de postal.',
    metaDescription:
      'Playas mas bonitas y fotogenicas de Murcia. Paisajes espectaculares en la Costa Calida.',
    filterFn: (b) => {
      const tags = b.tags ?? []
      return tags.includes(15)
    },
  },
]

export function getCollectionBySlug(
  slug: string,
): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}

export function filterBeachesByCollection(
  beaches: Array<Beach>,
  collection: Collection,
): Array<Beach> {
  return beaches.filter(collection.filterFn)
}
