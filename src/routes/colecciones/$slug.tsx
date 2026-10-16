import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { BeachCard } from '@/features/beaches/beach-card'
import { PageInfo } from '@/features/listing/page-info'
import { Pagination } from '@/features/listing/pagination'
import { SortSelect } from '@/features/listing/sort-select'
import { sortBeaches } from '@/lib/beach-filters'
import {
  allCollections,
  filterBeachesByCollection,
  getCollectionBySlug,
} from '@/lib/collections'

const fetchCollectionData = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => {
    if (typeof data.slug !== 'string' || !data.slug.trim()) {
      throw new Error('Invalid slug')
    }
    return { slug: data.slug.trim() }
  })
  .handler(async ({ data }) => {
    const {
      beachToSlug: toSlug,
      getAllBeaches,
      getAllTags,
      getMunicipalityMap,
    } = await import('@/lib/db-data/beach-queries')
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const collection = getCollectionBySlug(data.slug)
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
  })

export const Route = createFileRoute('/colecciones/$slug')({
  loader: async ({ params }) => {
    const data = await fetchCollectionData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Colección no encontrada' }] }
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

const badgeTheme: Record<string, { bg: string; text: string }> = {
  'calas-escondidas': { bg: 'bg-teal-500/30', text: 'text-teal-100' },
  'playas-familiares': { bg: 'bg-sand-500/30', text: 'text-sand-100' },
  'playas-para-perros': { bg: 'bg-amber-500/30', text: 'text-amber-100' },
  'playas-nudistas': { bg: 'bg-sand-500/30', text: 'text-sand-100' },
  'con-chiringuito': { bg: 'bg-amber-500/30', text: 'text-amber-100' },
  'bandera-azul': { bg: 'bg-sky-500/30', text: 'text-sky-100' },
  snorkel: { bg: 'bg-cyan-500/30', text: 'text-cyan-100' },
  'deportes-acuaticos': { bg: 'bg-ocean-500/30', text: 'text-ocean-100' },
  'mejores-atardeceres': { bg: 'bg-amber-500/30', text: 'text-amber-100' },
  'playas-tranquilas': { bg: 'bg-teal-500/30', text: 'text-teal-100' },
  accesibles: { bg: 'bg-sky-500/30', text: 'text-sky-100' },
  'playas-fotogenicas': { bg: 'bg-ocean-500/30', text: 'text-ocean-100' },
}

const defaultBadge = { bg: 'bg-ocean-500/30', text: 'text-ocean-100' }

function CollectionPage() {
  const { collection, items, tags, weatherData } = Route.useLoaderData()
  const badge = badgeTheme[collection.slug] ?? defaultBadge
  const PAGE_SIZE = 15
  const [sort, setSort] =
    useState<NonNullable<BeachSearchParams['sort']>>('recomendados')
  const sortedItems = useMemo(() => {
    const itemByCode = new Map(items.map((i) => [i.beach.code, i]))
    return sortBeaches(
      items.map((i) => i.beach),
      sort,
    )
      .map((beach) => itemByCode.get(beach.code))
      .filter((item): item is NonNullable<typeof item> => item != null)
  }, [items, sort])
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
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Playas de la Región de Murcia"
        backgroundImage="/pictures/hero-colecciones.png"
        optimizedName="hero-colecciones"
      >
        <h1 className="mb-4 text-3xl font-normal tracking-tight text-white sm:text-4xl">
          {collection.title}
        </h1>
        <p className="mx-auto mb-4 max-w-xl text-lg text-ocean-200">
          {collection.description}
        </p>
        <span
          className={`${badge.bg} ${badge.text} inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm`}
        >
          {items.length} {items.length === 1 ? 'playa' : 'playas'}
        </span>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Colecciones', href: '/colecciones' },
            { label: collection.title },
          ]}
        />

        {items.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {sortedItems.length}{' '}
              {sortedItems.length === 1 ? 'playa' : 'playas'}
            </span>
            <SortSelect value={sort} onChange={setSort} />
          </div>
        )}

        {items.length === 0 ? (
          <EmptyState
            description="No se encontraron playas en esta colección."
            title="Sin resultados"
          />
        ) : (
          <>
            <PageInfo
              currentPage={currentPage}
              totalItems={sortedItems.length}
              totalPages={totalPages}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
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
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-ocean-200 px-5 py-2.5 text-sm font-medium text-ocean-600 transition-colors hover:bg-ocean-50 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            to="/colecciones"
          >
            ← Volver a colecciones
          </Link>
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
