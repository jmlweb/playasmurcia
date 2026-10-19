import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import type { Beach } from '@/types/beach'

import { PageHero } from '@/components/layout/page-hero'
import { CollectionIcon } from '@/components/ui/icons'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import {
  collections,
  filterBeachesByCollection,
  seaCollections,
} from '@/lib/collections'
import { parseImageFilename, pictureUrl } from '@/lib/images'

const FEATURED_SLUGS = new Set([
  'calas-escondidas',
  'playas-familiares',
  'bandera-azul',
  'snorkel',
])

// Best-rated photo of the most recommended beach, so each featured card shows
// a real place instead of an empty colour band. `usedCodes` keeps covers
// distinct, since popular beaches belong to several collections.
function pickCoverPicture(
  beaches: Beach[],
  usedCodes: Set<string>,
): string | undefined {
  const cover = beaches
    .filter((b) => b.pictures?.length && !usedCodes.has(b.code))
    .sort(
      (a, b) =>
        (b.pictureQualityScore ?? 0) - (a.pictureQualityScore ?? 0) ||
        b.recommendationScore - a.recommendationScore,
    )[0]
  if (!cover) return undefined
  usedCodes.add(cover.code)
  return cover.pictures?.[0]
}

const fetchCollectionsData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches } = await import('@/lib/db-data/beach-queries')
    const beaches = await getAllBeaches()
    const usedCoverCodes = new Set<string>()
    const items = collections.map((collection) => {
      const members = filterBeachesByCollection(beaches, collection)
      return {
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        beachCount: members.length,
        coverPicture: FEATURED_SLUGS.has(collection.slug)
          ? pickCoverPicture(members, usedCoverCodes)
          : undefined,
      }
    })
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
      ogUrlMeta('/colecciones'),
    ],
    links: [canonicalLink('/colecciones')],
  }),
  component: ColeccionesPage,
})

/**
 * Thematic color map — restricted to brand-harmonized hues:
 *   ocean (custom), teal, cyan, sky   → water/marine themes
 *   sand (custom), amber              → warm/land themes
 *   coral (custom via amber-warm)     → accent/highlight themes
 *
 * See docs/ui-guidelines.md § Color Palette for allowed tokens.
 */
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
    bg: 'bg-sand-100',
    text: 'text-sand-500',
    gradient: 'from-sand-100 to-sand-200',
  },
  'playas-para-perros': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    gradient: 'from-amber-100 to-amber-200',
  },
  'playas-nudistas': {
    bg: 'bg-sand-50',
    text: 'text-sand-500',
    gradient: 'from-sand-200 to-sand-300',
  },
  'con-chiringuito': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    gradient: 'from-amber-50 to-amber-100',
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
    bg: 'bg-ocean-50',
    text: 'text-ocean-600',
    gradient: 'from-ocean-100 to-ocean-200',
  },
  'mejores-atardeceres': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    gradient: 'from-amber-100 to-sand-200',
  },
  'playas-tranquilas': {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    gradient: 'from-teal-50 to-teal-100',
  },
  accesibles: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    gradient: 'from-sky-50 to-sky-100',
  },
  'playas-fotogenicas': {
    bg: 'bg-ocean-50',
    text: 'text-ocean-500',
    gradient: 'from-ocean-50 to-ocean-100',
  },
}

function CollectionCard({
  slug,
  title,
  description,
  beachCount,
  coverPicture,
}: {
  slug: string
  title: string
  description: string
  beachCount: number
  coverPicture?: string
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
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
        params={{ slug }}
        to="/colecciones/$slug"
      >
        <div
          className={`relative flex h-40 items-end bg-gradient-to-br p-4 ${theme.gradient}`}
        >
          {coverPicture && (
            <>
              <ResponsiveImage
                alt=""
                aria-hidden="true"
                baseName={parseImageFilename(coverPicture).baseName}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                ext={parseImageFilename(coverPicture).ext}
                variant="thumb"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
              />
            </>
          )}
          <div
            className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} ${theme.text} shadow-md`}
          >
            <CollectionIcon className="h-7 w-7" slug={slug} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
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
            <span className="text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
              Ver colección →
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/colecciones/$slug"
    >
      {/* Compact colour band */}
      <div className={`h-2 bg-gradient-to-br ${theme.gradient}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}
          >
            <CollectionIcon className="h-5 w-5" slug={slug} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
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
          <span className="text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
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
  beachCount,
}: {
  slug: string
  title: string
  beachCount: number
}) {
  const isMediterraneo = slug === 'mar-mediterraneo'

  return (
    <Link
      className="group relative flex h-44 items-end overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/colecciones/$slug"
    >
      {/* Background photo — real beach from each sea */}
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        src={
          isMediterraneo
            ? pictureUrl('recurso-1-524-1p_g.jpg')
            : pictureUrl('recurso-1-687-8p_g.jpg')
        }
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
            <h3 className="text-lg font-semibold text-white">{title}</h3>
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
        {/* Seas — horizontal banners */}
        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-semibold text-gray-900">
            Playas por mar
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            {seas.map((sea) => (
              <SeaCollectionCard
                key={sea.slug}
                beachCount={sea.beachCount}
                slug={sea.slug}
                title={sea.title}
              />
            ))}
          </div>
        </section>

        {/* Thematic collections */}
        <section className="rounded-3xl bg-sand-100 p-4 sm:p-6 lg:p-8">
          <h2 className="mb-6 text-3xl font-semibold text-gray-900">
            Colecciones temáticas
          </h2>

          {/* Featured (larger) */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
            {featured.map((item) => (
              <CollectionCard
                key={item.slug}
                beachCount={item.beachCount}
                coverPicture={item.coverPicture}
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
