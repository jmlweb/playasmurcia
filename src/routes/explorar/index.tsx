import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useCallback, useMemo, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { BeachCard } from '@/features/beaches/beach-card'
import { ActiveFilterChips } from '@/features/explorer/active-filter-chips'
import {
  FilterPanel,
  FilterToggleButton,
} from '@/features/listing/filter-panel'
import { PageInfo } from '@/features/listing/page-info'
import { Pagination } from '@/features/listing/pagination'
import { SearchBar } from '@/features/listing/search-bar'
import { SortSelect } from '@/features/listing/sort-select'
import { applyFiltersAndSort, countActiveFilters } from '@/lib/beach-filters'
import { validateSearch } from '@/lib/explorer-search'
import { beachToSlug } from '@/lib/slugs'

const fetchExplorerData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const {
      getAllBeaches,
      getAllMunicipalities,
      getAllServices,
      getAllActivities,
      getAllTags,
      getAllSeas,
    } = await import('@/lib/db-data/beach-queries')
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const [beaches, municipalities, services, activities, tags, seas] =
      await Promise.all([
        getAllBeaches(),
        getAllMunicipalities(),
        getAllServices(),
        getAllActivities(),
        getAllTags(),
        getAllSeas(),
      ])
    const weatherMap = await fetchBatchCardWeather(beaches)
    const weatherData = Object.fromEntries(weatherMap)
    return {
      beaches,
      municipalities,
      services,
      activities,
      tags,
      seas,
      weatherData,
    }
  },
)

export const Route = createFileRoute('/explorar/')({
  validateSearch,
  loader: () => fetchExplorerData(),
  head: ({ loaderData }) => ({
    meta: [
      { title: 'Explorar playas - Playas de Murcia' },
      {
        name: 'description',
        content: `Explora y filtra las ${loaderData?.beaches.length ?? 194} playas de la Región de Murcia. Busca por municipio, mar, servicios, actividades y más.`,
      },
    ],
  }),
  component: ExplorerPage,
})

function ExplorerPage() {
  const {
    beaches,
    municipalities,
    services,
    activities,
    tags,
    seas,
    weatherData,
  } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const PAGE_SIZE = 15
  const filters: BeachSearchParams = search
  const sort = filters.sort ?? 'recomendados'
  const currentPage = search.page ?? 1

  const updateFilters = useCallback(
    (next: BeachSearchParams, page?: number) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          ...next,
          municipality: next.municipality?.length
            ? next.municipality
            : undefined,
          sea: next.sea?.length ? next.sea : undefined,
          services: next.services?.length ? next.services : undefined,
          activities: next.activities?.length ? next.activities : undefined,
          tags: next.tags?.length ? next.tags : undefined,
          q: next.q || undefined,
          page: page && page > 1 ? page : undefined,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  function handlePageChange(page: number) {
    updateFilters({ ...filters, sort }, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const allFiltered = useMemo(
    () => applyFiltersAndSort(beaches, { ...filters, sort }),
    [beaches, filters, sort],
  )
  const totalPages = Math.ceil(allFiltered.length / PAGE_SIZE)
  const safePage = Math.min(currentPage, totalPages || 1)
  const filteredBeaches = allFiltered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const slugMap = useMemo(
    () => new Map(beaches.map((b) => [b.code, beachToSlug(b)])),
    [beaches],
  )

  const hasActiveFilters =
    filters.q?.trim() ||
    (filters.municipality?.length ?? 0) > 0 ||
    (filters.sea?.length ?? 0) > 0 ||
    (filters.services?.length ?? 0) > 0 ||
    (filters.activities?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Costa de Murcia"
        backgroundImage="/pictures/hero-explorar.png"
        optimizedName="hero-explorar"
      >
        <p className="mb-3 text-sm font-medium tracking-widest text-ocean-300 uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Explorar playas
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-ocean-200">
          {hasActiveFilters
            ? `Mostrando ${allFiltered.length} de ${beaches.length} playas`
            : `Filtra entre ${beaches.length} playas y calas del litoral murciano`}
        </p>
        <div className="mx-auto max-w-2xl">
          <SearchBar
            value={filters.q ?? ''}
            onChange={(q: string) => {
              updateFilters({ ...filters, q: q || undefined })
            }}
          />
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Explorar playas' }]}
        />
        <div className="flex gap-10">
          <FilterPanel
            activities={activities}
            filters={filters}
            mobileOpen={mobileFilterOpen}
            municipalities={municipalities}
            seas={seas}
            services={services}
            tags={tags}
            onChange={(next: BeachSearchParams) => {
              updateFilters({ ...next, sort })
            }}
            onMobileClose={() => {
              setMobileFilterOpen(false)
            }}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FilterToggleButton
                  activeCount={countActiveFilters(filters)}
                  onClick={() => {
                    setMobileFilterOpen(true)
                  }}
                />
                <span className="text-sm text-gray-500">
                  <strong className="font-semibold text-gray-900">
                    {allFiltered.length}
                  </strong>{' '}
                  playas encontradas
                </span>
              </div>
              <SortSelect
                value={sort}
                onChange={(nextSort: BeachSearchParams['sort']) => {
                  updateFilters({ ...filters, sort: nextSort })
                }}
              />
            </div>

            <ActiveFilterChips
              activities={activities}
              filters={filters}
              municipalities={municipalities}
              seas={seas}
              services={services}
              tags={tags}
              onClearAll={() => {
                updateFilters({ sort })
              }}
              onUpdateFilters={updateFilters}
            />

            {allFiltered.length > 0 ? (
              <>
                <PageInfo
                  currentPage={safePage}
                  totalItems={allFiltered.length}
                  totalPages={totalPages}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                  {filteredBeaches.map((beach) => {
                    const slug = slugMap.get(beach.code) ?? beachToSlug(beach)
                    return (
                      <BeachCard
                        key={beach.code}
                        beach={beach}
                        municipality={municipalities[beach.municipality]}
                        slug={slug}
                        tags={tags}
                        weather={weatherData[beach.code]}
                      />
                    )
                  })}
                </div>
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                action={
                  hasActiveFilters ? (
                    <button
                      className="rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      type="button"
                      onClick={() => {
                        updateFilters({ sort })
                      }}
                    >
                      Limpiar filtros
                    </button>
                  ) : undefined
                }
                description="Prueba a modificar los filtros o el texto de búsqueda"
                icon={
                  <svg
                    aria-hidden="true"
                    className="h-14 w-14"
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
                }
                title="No se encontraron playas"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
