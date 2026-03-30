import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Breadcrumb } from '@/components/breadcrumb'
import { CollectionIcon } from '@/components/icons'
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
          'Explora nuestras colecciones temáticas de playas: familiares, nudistas, con chiringuito, bandera azul y más.',
      },
    ],
  }),
  component: ColeccionesPage,
})

const FEATURED_SLUGS = new Set([
  'calas-escondidas',
  'playas-familiares',
  'bandera-azul',
  'snorkel',
])

const ThematicThemes: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  'calas-escondidas': {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    gradient: 'from-teal-100 to-teal-200',
  },
  'playas-familiares': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    gradient: 'from-amber-100 to-amber-200',
  },
  'playas-para-perros': {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    gradient: 'from-orange-100 to-orange-200',
  },
  'playas-nudistas': {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    gradient: 'from-rose-100 to-rose-200',
  },
  'con-chiringuito': {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    gradient: 'from-purple-100 to-purple-200',
  },
  'bandera-azul': {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    gradient: 'from-sky-100 to-sky-200',
  },
  snorkel: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    gradient: 'from-cyan-100 to-cyan-200',
  },
  'deportes-acuaticos': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    gradient: 'from-indigo-100 to-indigo-200',
  },
  'mejores-atardeceres': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    gradient: 'from-yellow-100 to-yellow-200',
  },
  'playas-tranquilas': {
    bg: 'bg-green-50',
    text: 'text-green-600',
    gradient: 'from-green-100 to-green-200',
  },
  accesibles: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    gradient: 'from-blue-100 to-blue-200',
  },
  'playas-fotogenicas': {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'from-pink-100 to-pink-200',
  },
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
  const theme = ThematicThemes[slug] ?? {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    gradient: 'from-gray-100 to-gray-200',
  }
  const isFeatured = FEATURED_SLUGS.has(slug)

  if (isFeatured) {
    return (
      <Link
        className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-1"
        params={{ slug }}
        to="/colecciones/$slug"
      >
        {/* Hero gradient area */}
        <div
          className={`relative flex h-28 items-end bg-gradient-to-br p-4 ${theme.gradient}`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} ${theme.text} shadow-sm`}
          >
            <CollectionIcon className="h-7 w-7" slug={slug} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="group-hover:text-ocean-600 mb-2 text-xl font-bold text-gray-900 transition-colors">
            {title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <strong className="font-semibold text-gray-900">
                {beachCount}
              </strong>{' '}
              {beachCount === 1 ? 'playa' : 'playas'}
            </span>
            <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
              Ver colección →
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/colecciones/$slug"
    >
      {/* Compact colour band */}
      <div className={`h-16 bg-gradient-to-br ${theme.gradient}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}
          >
            <CollectionIcon className="h-5 w-5" slug={slug} />
          </div>
          <h3 className="group-hover:text-ocean-600 text-base font-bold text-gray-900 transition-colors">
            {title}
          </h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-gray-600">
            <strong className="font-semibold text-gray-900">
              {beachCount}
            </strong>{' '}
            {beachCount === 1 ? 'playa' : 'playas'}
          </span>
          <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
            Ver colección →
          </span>
        </div>
      </div>
    </Link>
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
    <Link
      className="group focus-visible:ring-ocean-500 relative flex h-44 items-end overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/colecciones/$slug"
    >
      {/* Background photo */}
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        src="/pictures/hero-colecciones.png"
      />
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${isMediterraneo ? 'from-ocean-900/80 via-ocean-800/30' : 'from-emerald-900/80 via-emerald-800/30'} to-transparent`}
      />
      {/* Content */}
      <div className="relative flex w-full items-end justify-between p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isMediterraneo ? 'bg-ocean-500/30 text-white' : 'bg-emerald-500/30 text-white'} backdrop-blur-sm`}
          >
            <svg
              aria-hidden="true"
              className="h-7 w-7"
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
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/80">
              <strong className="font-semibold">{beachCount}</strong> playas
            </p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
          Ver colección →
        </span>
      </div>
    </Link>
  )
}

function ColeccionesPage() {
  const { items, seas } = Route.useLoaderData()

  const featured = items.filter((item) => FEATURED_SLUGS.has(item.slug))
  const compact = items.filter((item) => !FEATURED_SLUGS.has(item.slug))

  return (
    <main className="bg-sand-50 min-h-screen">
      <PageHero
        backgroundAlt="Playas de la Región de Murcia"
        backgroundImage="/pictures/hero-colecciones.png"
        optimizedName="hero-colecciones"
      >
        <p className="text-ocean-300 mb-3 text-sm font-medium tracking-widest uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Colecciones de playas
        </h1>
        <p className="text-ocean-200 mx-auto max-w-xl text-lg">
          Encuentra la playa perfecta según tus preferencias
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Colecciones' }]}
        />

        {/* Seas — horizontal banners */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-semibold text-gray-900">
            Playas por mar
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
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
        <section className="bg-sand-100 rounded-3xl p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Colecciones temáticas
          </h2>

          {/* Featured (larger) */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            {featured.map((item) => (
              <CollectionCard
                key={item.slug}
                beachCount={item.beachCount}
                description={item.description}
                slug={item.slug}
                title={item.title}
              />
            ))}
          </div>

          {/* Compact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {compact.map((item) => (
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
