import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { PageHero } from '@/components/layout/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { BeachCard } from '@/features/beaches/beach-card'
import { useCardFlags } from '@/features/beaches/use-card-flags'
import { useCardWeather } from '@/features/beaches/use-card-weather'
import { PageInfo } from '@/features/listing/page-info'
import { Pagination } from '@/features/listing/pagination'
import { SortSelect } from '@/features/listing/sort-select'
import { sortBeaches } from '@/lib/beach-filters'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { parseImageFilename, pictureUrl } from '@/lib/images'
import { generateMunicipalitySchema } from '@/lib/schema'
import { beachToSlug } from '@/lib/slugs'

const fetchMunicipalityData = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => {
    if (typeof data.slug !== 'string' || !data.slug.trim()) {
      throw new Error('Invalid slug')
    }
    return { slug: data.slug.trim() }
  })
  .handler(async ({ data }) => {
    const { getAllTags, getBeachesByMunicipality, getMunicipalityBySlug } =
      await import('@/lib/db-data/beach-queries')
    const result = await getMunicipalityBySlug(data.slug)
    if (!result) return null

    const { municipality, index } = result
    const [beaches, tags] = await Promise.all([
      getBeachesByMunicipality(index),
      getAllTags(),
    ])

    const { countBlueFlag } = await import('@/lib/nav-builders')
    const blueFlagCount = countBlueFlag(beaches)

    const beachesWithPics = beaches.filter(
      (b): b is typeof b & { pictures: [string, ...string[]] } =>
        Array.isArray(b.pictures) && b.pictures.length > 0,
    )
    const bestBeach = beachesWithPics.sort(
      (a, b) =>
        (b.pictureQualityScore ?? 0) - (a.pictureQualityScore ?? 0) ||
        b.pictures.length - a.pictures.length,
    )[0]

    const heroImage = bestBeach
      ? pictureUrl(
          `${parseImageFilename(bestBeach.pictures[0]).baseName}.${parseImageFilename(bestBeach.pictures[0]).ext}`,
        )
      : pictureUrl('hero-municipios.png')

    return {
      municipality,
      beaches,
      tags,
      blueFlagCount,
      slug: data.slug,
      heroImage,
    }
  })

// La Manga was wrongly listed as a municipality; keep its indexed URL alive
const RETIRED_MUNICIPALITY_SLUGS: Record<string, string> = {
  'la-manga': 'san-javier',
}

export const Route = createFileRoute('/municipios/$slug')({
  beforeLoad: ({ params }) => {
    const target = RETIRED_MUNICIPALITY_SLUGS[params.slug]
    if (target) {
      throw redirect({
        to: '/municipios/$slug',
        params: { slug: target },
        statusCode: 301,
      })
    }
  },
  loader: async ({ params }) => {
    const data = await fetchMunicipalityData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Municipio no encontrado' }] }
    }

    const { municipality, beaches, blueFlagCount, slug } = loaderData
    const schema = generateMunicipalitySchema(
      municipality,
      beaches.length,
      slug,
    )

    return {
      meta: [
        { title: `Playas de ${municipality.name} - Playas de Murcia` },
        {
          name: 'description',
          content: `Descubre ${beaches.length === 1 ? 'la playa' : `las ${beaches.length} playas`} de ${municipality.name}${blueFlagCount > 0 ? `, con ${blueFlagCount} ${blueFlagCount === 1 ? 'bandera azul' : 'banderas azules'}` : ''}, en la Región de Murcia.`,
        },
        ogUrlMeta(`/municipios/${slug}`),
      ],
      links: [canonicalLink(`/municipios/${slug}`)],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    }
  },
  component: MunicipalityPage,
})

function MunicipalityPage() {
  const { municipality, beaches, tags, blueFlagCount, heroImage, slug } =
    Route.useLoaderData()
  const weatherData = useCardWeather(beaches)
  const flagData = useCardFlags(beaches)
  const PAGE_SIZE = 15
  const [sort, setSort] =
    useState<NonNullable<BeachSearchParams['sort']>>('recomendados')
  const sortedBeaches = useMemo(
    () => sortBeaches(beaches, sort),
    [beaches, sort],
  )
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sortedBeaches.length / PAGE_SIZE)
  const visibleBeaches = sortedBeaches.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function handlePageChange(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-sand-50">
      {/* Hero */}
      <PageHero
        backgroundAlt={`Costa de ${municipality.name}`}
        backgroundImage={heroImage}
        breadcrumb={[
          { label: 'Inicio', href: '/' },
          { label: 'Municipios', href: '/municipios' },
          { label: municipality.name },
        ]}
        lifted={slug === 'mazarron'}
      >
        <h1 className="mb-4 text-3xl font-normal tracking-tight text-white sm:text-4xl">
          Playas de {municipality.name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-ocean-100">
          <span>
            <strong className="font-semibold text-white">
              {beaches.length}
            </strong>{' '}
            {beaches.length === 1 ? 'playa' : 'playas'}
          </span>
          {blueFlagCount > 0 && (
            <span>
              <strong className="font-semibold text-ocean-300">
                {blueFlagCount}
              </strong>{' '}
              {blueFlagCount === 1 ? 'bandera azul' : 'banderas azules'}
            </span>
          )}
        </div>
      </PageHero>

      {/* Beach grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {beaches.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
              <SortSelect value={sort} onChange={setSort} />
            </div>
            <PageInfo
              currentPage={currentPage}
              totalItems={sortedBeaches.length}
              totalPages={totalPages}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
              {visibleBeaches.map((beach) => (
                <BeachCard
                  key={beach.code}
                  beach={beach}
                  flag={flagData[beach.code]}
                  municipality={municipality}
                  slug={beachToSlug(beach)}
                  tags={tags}
                  weather={weatherData[beach.code]}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            description="Este municipio no tiene playas catalogadas en nuestra base de datos."
            title="No hay playas registradas"
          />
        )}

        <div className="mt-12 text-center">
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-medium text-ocean-600 transition-colors hover:bg-ocean-50 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            to="/"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
