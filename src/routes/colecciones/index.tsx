import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Breadcrumb } from '@/components/breadcrumb'
import { PageHero } from '@/components/page-hero'
import {
  collections,
  filterBeachesByCollection,
  seaCollections,
} from '@/lib/collections'

const fetchCollectionsData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches } = await import('@/lib/db-data')
    const beaches = await getAllBeaches()
    const items = collections.map((collection) => ({
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      beachCount: filterBeachesByCollection(beaches, collection).length,
    }))
    const seas = seaCollections.map((collection) => ({
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      beachCount: filterBeachesByCollection(beaches, collection).length,
    }))
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
          'Explora nuestras colecciones tematicas de playas: familiares, nudistas, con chiringuito, bandera azul y mas.',
      },
    ],
  }),
  component: ColeccionesPage,
})

const ThematicIcons: Record<string, { icon: string; bg: string; text: string; bar: string }> = {
  'calas-escondidas': { icon: '🏝️', bg: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-500' },
  'playas-familiares': { icon: '👨‍👩‍👧‍👦', bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
  'playas-para-perros': { icon: '🐕', bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500' },
  'playas-nudistas': { icon: '☀️', bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500' },
  'con-chiringuito': { icon: '🍹', bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
  'bandera-azul': { icon: '🏳️', bg: 'bg-sky-50', text: 'text-sky-600', bar: 'bg-sky-500' },
  snorkel: { icon: '🤿', bg: 'bg-cyan-50', text: 'text-cyan-600', bar: 'bg-cyan-500' },
  'deportes-acuaticos': { icon: '🏄', bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500' },
  'mejores-atardeceres': { icon: '🌅', bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
  'playas-tranquilas': { icon: '🧘', bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500' },
  accesibles: { icon: '♿', bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
  'playas-fotogenicas': { icon: '📸', bg: 'bg-pink-50', text: 'text-pink-600', bar: 'bg-pink-500' },
}

function CollectionCard({
  slug,
  title,
  description,
  beachCount,
}: {
  slug: string
  title: string
  description: string
  beachCount: number
}) {
  const theme = ThematicIcons[slug] ?? {
    icon: '🏖️',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    bar: 'bg-gray-500',
  }

  return (
    <a
      className="group hover:ring-ocean-200 focus:ring-ocean-500 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg focus:ring-2 focus:outline-none"
      href={`/colecciones/${slug}`}
    >
      <div className={`h-2 ${theme.bar}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${theme.bg}`}
          >
            {theme.icon}
          </div>
          <h3 className="group-hover:text-ocean-600 text-xl font-bold text-gray-900 transition-colors">
            {title}
          </h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-gray-500">
            <strong className="font-semibold text-gray-900">
              {beachCount}
            </strong>{' '}
            {beachCount === 1 ? 'playa' : 'playas'}
          </span>
          <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
            Ver coleccion →
          </span>
        </div>
      </div>
    </a>
  )
}

function SeaCollectionCard({
  slug,
  title,
  description,
  beachCount,
}: {
  slug: string
  title: string
  description: string
  beachCount: number
}) {
  const isMediterraneo = slug === 'mar-mediterraneo'

  return (
    <a
      className="group hover:ring-ocean-200 focus:ring-ocean-500 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg focus:ring-2 focus:outline-none"
      href={`/colecciones/${slug}`}
    >
      <div
        className={`h-2 ${isMediterraneo ? 'bg-ocean-500' : 'bg-emerald-500'}`}
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${isMediterraneo ? 'bg-ocean-50 text-ocean-600' : 'bg-emerald-50 text-emerald-600'}`}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <h3 className="group-hover:text-ocean-600 text-xl font-bold text-gray-900 transition-colors">
            {title}
          </h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-gray-500">
            <strong className="font-semibold text-gray-900">
              {beachCount}
            </strong>{' '}
            playas
          </span>
          <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
            Explorar →
          </span>
        </div>
      </div>
    </a>
  )
}

function ColeccionesPage() {
  const { items, seas } = Route.useLoaderData()

  return (
    <main className="bg-sand-50 min-h-screen">
      <PageHero>
        <p className="text-ocean-300 mb-3 text-sm font-medium tracking-widest uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Colecciones de playas
        </h1>
        <p className="text-ocean-200 mx-auto max-w-xl text-lg">
          Encuentra la playa perfecta segun tus preferencias
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Colecciones' }]}
        />

        {/* Seas — featured */}
        <section className="mb-14">
          <p className="text-ocean-600 mb-1 text-sm font-semibold tracking-wider uppercase">
            Por mar
          </p>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Segun su mar
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {seas.map((sea) => (
              <SeaCollectionCard
                key={sea.slug}
                beachCount={sea.beachCount}
                description={sea.description}
                slug={sea.slug}
                title={sea.title}
              />
            ))}
          </div>
        </section>

        {/* Thematic collections */}
        <section className="border-t border-gray-200 pt-10">
          <p className="text-ocean-600 mb-1 text-sm font-semibold tracking-wider uppercase">
            Por tematica
          </p>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Segun tus preferencias
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {items.map((item) => (
              <CollectionCard
                key={item.slug}
                beachCount={item.beachCount}
                description={item.description}
                slug={item.slug}
                title={item.title}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
