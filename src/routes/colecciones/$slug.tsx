import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'

import { BeachCard } from '@/components/beach-card'
import { Breadcrumb } from '@/components/breadcrumb'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { SortSelect } from '@/components/sort-select'
import type { BeachSearchParams } from '@/lib/beach-filters'
import { sortBeaches } from '@/lib/beach-filters'
import {
  allCollections,
  filterBeachesByCollection,
  getCollectionBySlug,
} from '@/lib/collections'

const fetchCollectionData = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { slug: string } }) => {
    const {
      beachToSlug: toSlug,
      getAllBeaches,
      getAllTags,
      getMunicipalityMap,
    } = await import('@/lib/db-data')
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const collection = getCollectionBySlug(ctx.data.slug)
    if (!collection) return null

    const [beaches, tags, municipalityMap] = await Promise.all([
      getAllBeaches(),
      getAllTags(),
      getMunicipalityMap(),
    ])

    const filtered = filterBeachesByCollection(beaches, collection)
    const weatherMap = await fetchBatchCardWeather(filtered)
    const weatherData = Object.fromEntries(weatherMap)
    const items = filtered.map((beach) => ({
      beach,
      municipality: municipalityMap.get(beach.municipality) ?? {
        name: '',
        id: '',
      },
      slug: toSlug(beach),
    }))

    return {
      collection: {
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        metaDescription: collection.metaDescription,
      },
      items,
      tags,
      weatherData,
    }
  },
)

export const Route = createFileRoute('/colecciones/$slug')({
  loader: async ({ params }) => {
    const data = await fetchCollectionData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Coleccion no encontrada' }] }
    }
    return {
      meta: [
        {
          title: `${loaderData.collection.title} - Playas de Murcia`,
        },
        {
          name: 'description',
          content: loaderData.collection.metaDescription,
        },
      ],
    }
  },
  component: CollectionPage,
})

function CollectionPage() {
  const { collection, items, tags, weatherData } = Route.useLoaderData()
  const PAGE_SIZE = 15
  const [sort, setSort] = useState<NonNullable<BeachSearchParams['sort']>>('recomendados')
  const sortedItems = useMemo(
    () =>
      sortBeaches(
        items.map((i) => i.beach),
        sort,
      ).map((beach) => items.find((i) => i.beach.code === beach.code)!),
    [items, sort],
  )
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE)
  const visibleItems = sortedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function handlePageChange(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="bg-sand-50 min-h-screen">
      <PageHero>
        <p className="text-ocean-300 mb-3 text-sm font-medium tracking-widest uppercase">
          Colecciones de playas
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {collection.title}
        </h1>
        <p className="text-ocean-200 text-lg">{collection.description}</p>
        <p className="mt-4">
          <span className="bg-ocean-800/60 text-ocean-100 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
            {items.length} {items.length === 1 ? 'playa' : 'playas'}
          </span>
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Colecciones', href: '/colecciones' },
            { label: collection.title },
          ]}
        />

        {items.length > 0 && (
          <div className="mb-6 flex justify-end">
            <SortSelect value={sort} onChange={setSort} />
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-16 text-center">
            <svg
              aria-hidden="true"
              className="mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Sin resultados
            </h3>
            <p className="text-sm text-gray-500">
              No se encontraron playas en esta coleccion.
            </p>
          </div>
        ) : (
          <>
            {totalPages > 1 && (
              <p className="mb-4 text-sm text-gray-500">
                Pagina{' '}
                <strong className="font-semibold text-gray-900">
                  {currentPage}
                </strong>{' '}
                de{' '}
                <strong className="font-semibold text-gray-900">
                  {totalPages}
                </strong>{' '}
                ({sortedItems.length} playas)
              </p>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map(({ beach, municipality, slug }) => (
                <BeachCard
                  key={beach.code}
                  beach={beach}
                  municipality={municipality}
                  slug={slug}
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
        )}

        <div className="mt-12 text-center">
          <a
            className="text-ocean-600 hover:text-ocean-700 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:underline"
            href="/colecciones"
          >
            ← Volver a colecciones
          </a>
        </div>
      </div>
    </main>
  )
}

export function getStaticPaths() {
  return allCollections.map((c) => ({
    params: { slug: c.slug },
  }))
}
