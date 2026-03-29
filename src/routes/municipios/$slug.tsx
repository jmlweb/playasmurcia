import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'

import { BeachCard } from '@/components/beach-card'
import { Breadcrumb } from '@/components/breadcrumb'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { PageInfo } from '@/components/page-info'
import { Pagination } from '@/components/pagination'
import { SortSelect } from '@/components/sort-select'
import type { BeachSearchParams } from '@/lib/beach-filters'
import { sortBeaches } from '@/lib/beach-filters'
import { generateMunicipalitySchema } from '@/lib/schema'
import { beachToSlug } from '@/lib/slugs'

const fetchMunicipalityData = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => {
    if (typeof data.slug !== 'string' || !data.slug.trim()) {
      throw new Error('Invalid slug')
    }
    return { slug: data.slug.trim() }
  })
  .handler(async ({ data }) => {
    const { getAllTags, getBeachesByMunicipality, getMunicipalityBySlug } =
      await import('@/lib/db-data')
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const result = await getMunicipalityBySlug(data.slug)
    if (!result) return null

    const { municipality, index } = result
    const [beaches, tags] = await Promise.all([
      getBeachesByMunicipality(index),
      getAllTags(),
    ])

    const weatherMap = await fetchBatchCardWeather(beaches)
    const weatherData = Object.fromEntries(weatherMap)
    const blueFlagCount = beaches.filter((b) =>
      b.certifications?.includes('blue-flag'),
    ).length
    return {
      municipality,
      beaches,
      tags,
      blueFlagCount,
      slug: data.slug,
      weatherData,
    }
  })

export const Route = createFileRoute('/municipios/$slug')({
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
      ],
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
  const { municipality, beaches, tags, blueFlagCount, weatherData } =
    Route.useLoaderData()
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
    <main className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <PageHero>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Playas de {municipality.name}
        </h1>
        <div className="text-ocean-200 flex flex-wrap justify-center gap-4 text-sm">
          <span>
            <strong className="font-semibold text-white">
              {beaches.length}
            </strong>{' '}
            {beaches.length === 1 ? 'playa' : 'playas'}
          </span>
          {blueFlagCount > 0 && (
            <span>
              <strong className="text-ocean-300 font-semibold">
                {blueFlagCount}
              </strong>{' '}
              {blueFlagCount === 1 ? 'bandera azul' : 'banderas azules'}
            </span>
          )}
        </div>
      </PageHero>

      {/* Beach grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Municipios', href: '/municipios' },
            { label: municipality.name },
          ]}
        />
        {beaches.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                <strong className="font-semibold text-gray-900">
                  {beaches.length}
                </strong>{' '}
                {beaches.length === 1 ? 'playa' : 'playas'}
              </span>
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
            className="text-ocean-600 hover:text-ocean-700 text-sm font-medium transition-colors focus-visible:underline focus-visible:outline-none"
            to="/municipios"
          >
            ← Volver a municipios
          </Link>
        </div>
      </div>
    </main>
  )
}
