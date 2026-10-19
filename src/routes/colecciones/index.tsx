import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { PageHero } from '@/components/layout/page-hero'
import { CollectionCard } from '@/features/collections/collection-card'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { pickCoverPicture } from '@/lib/collection-covers'
import {
  collections,
  filterBeachesByCollection,
  seaCollections,
} from '@/lib/collections'
import { pictureUrl } from '@/lib/images'

const fetchCollectionsData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches } = await import('@/lib/db-data/beach-queries')
    const beaches = await getAllBeaches()
    const usedCoverCodes = new Set<string>()
    // Seas first: they are the flagship collections, so they get the best photos.
    const toItem = (collection: (typeof collections)[number]) => {
      const members = filterBeachesByCollection(beaches, collection)
      return {
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        beachCount: members.length,
        coverPicture: pickCoverPicture(members, usedCoverCodes),
      }
    }
    const seas = seaCollections.map(toItem)
    const items = collections.map(toItem)
    return { items, seas }
  },
)

export const Route = createFileRoute('/colecciones/')({
  loader: () => fetchCollectionsData(),
  head: () => ({
    meta: [
      {
        title: 'Colecciones de Playas - Playas de Murcia',
      },
      {
        name: 'description',
        content:
          'Explora nuestras colecciones temáticas de playas: familiares, nudistas, con chiringuito, bandera azul y más.',
      },
      ogUrlMeta('/colecciones'),
    ],
    links: [canonicalLink('/colecciones')],
  }),
  component: ColeccionesPage,
})

function ColeccionesPage() {
  const { items, seas } = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Playas de la Región de Murcia"
        backgroundImage={pictureUrl('hero-colecciones.png')}
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Colecciones' }]}
        optimizedName="hero-colecciones"
      >
        <p className="mb-3 text-sm font-semibold tracking-widest text-coral-300 uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Colecciones de playas
        </h1>
        <p className="max-w-xl text-lg text-ocean-100">
          Encuentra la playa perfecta según tus preferencias
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <section className="mb-12">
          <h2 className="mb-5 text-3xl font-semibold text-gray-900">
            Playas por mar
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {seas.map((sea) => (
              <li key={sea.slug}>
                <CollectionCard {...sea} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-5 text-3xl font-semibold text-gray-900">
            Colecciones temáticas
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {items.map((item) => (
              <li key={item.slug}>
                <CollectionCard {...item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
