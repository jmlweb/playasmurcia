import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useCallback, useMemo, useState } from 'react'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { BeachCard } from '@/features/beaches/beach-card'
import {
  FilterPanel,
  FilterToggleButton,
} from '@/features/listing/filter-panel'
import { PageInfo } from '@/features/listing/page-info'
import { Pagination } from '@/features/listing/pagination'
import { SearchBar } from '@/features/listing/search-bar'
import { SortSelect } from '@/features/listing/sort-select'
import type { BeachSearchParams } from '@/lib/beach-filters'
import { applyFiltersAndSort, countActiveFilters } from '@/lib/beach-filters'
import { beachToSlug } from '@/lib/slugs'

type ExplorerSearchParams = BeachSearchParams & { page?: number }

function parseNumberArray(value: unknown): number[] | undefined {
  if (Array.isArray(value)) {
    const nums = value.map(Number).filter((n) => !isNaN(n))
    return nums.length > 0 ? nums : undefined
  }
  if (typeof value === 'string') {
    const n = Number(value)
    return isNaN(n) ? undefined : [n]
  }
  return undefined
}

function validateSearch(search: Record<string, unknown>): ExplorerSearchParams {
  return {
    q: typeof search.q === 'string' ? search.q : undefined,
    municipality: parseNumberArray(search.municipality),
    sea: parseNumberArray(search.sea),
    services: parseNumberArray(search.services),
    activities: parseNumberArray(search.activities),
    tags: parseNumberArray(search.tags),
    sort:
      search.sort === 'recomendados' ||
      search.sort === 'name' ||
      search.sort === 'municipality' ||
      search.sort === 'length' ||
      search.sort === 'occupancy'
        ? search.sort
        : undefined,
    page:
      typeof search.page === 'number' && search.page > 0
        ? Math.floor(search.page)
        : undefined,
  }
}

const fetchExplorerData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const {
      getAllBeaches,
      getAllMunicipalities,
      getAllServices,
      getAllActivities,
      getAllTags,
      getAllSeas,
    } = await import('@/lib/db-data')
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
  const navigate = useNavigate({ from: '/explorar' })

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

  function handleSearchChange(q: string) {
    updateFilters({ ...filters, q: q || undefined })
  }

  function handleSortChange(nextSort: BeachSearchParams['sort']) {
    updateFilters({ ...filters, sort: nextSort })
  }

  function handleFiltersChange(next: BeachSearchParams) {
    updateFilters({ ...next, sort })
  }

  function clearAllFilters() {
    updateFilters({ sort })
  }

  const hasActiveFilters =
    filters.q?.trim() ||
    (filters.municipality?.length ?? 0) > 0 ||
    (filters.sea?.length ?? 0) > 0 ||
    (filters.services?.length ?? 0) > 0 ||
    (filters.activities?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    if (filters.municipality) {
      for (const i of filters.municipality) {
        const m = municipalities[i]
        if (m)
          chips.push({
            key: `m-${i}`,
            label: m.name,
            onRemove: () => {
              updateFilters({
                ...filters,
                municipality: filters.municipality?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.sea) {
      for (const i of filters.sea) {
        const s = seas[i]
        if (s)
          chips.push({
            key: `s-${i}`,
            label: s.name,
            onRemove: () => {
              updateFilters({
                ...filters,
                sea: filters.sea?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.services) {
      for (const i of filters.services) {
        const s = services[i]
        if (s)
          chips.push({
            key: `sv-${i}`,
            label: s.name,
            onRemove: () => {
              updateFilters({
                ...filters,
                services: filters.services?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.activities) {
      for (const i of filters.activities) {
        const a = activities[i]
        if (a)
          chips.push({
            key: `a-${i}`,
            label: a.name,
            onRemove: () => {
              updateFilters({
                ...filters,
                activities: filters.activities?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.tags) {
      for (const i of filters.tags) {
        const t = tags[i]
        if (t)
          chips.push({
            key: `t-${i}`,
            label: t.name,
            onRemove: () => {
              updateFilters({
                ...filters,
                tags: filters.tags?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    return chips
  }, [filters, municipalities, seas, services, activities, tags, updateFilters])

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Header */}
      <PageHero
        backgroundAlt="Costa de Murcia"
        backgroundImage="/pictures/hero-explorar.png"
        optimizedName="hero-explorar"
      >
        <h1 className="mb-4 text-3xl font-normal tracking-tight text-white sm:text-4xl">
          Explorar playas
        </h1>
        <p className="text-ocean-200 mx-auto mb-8 max-w-xl text-lg">
          {hasActiveFilters
            ? `Mostrando ${allFiltered.length} de ${beaches.length} playas`
            : `Filtra entre ${beaches.length} playas y calas del litoral murciano`}
        </p>
        <div className="mx-auto max-w-2xl">
          <SearchBar value={filters.q ?? ''} onChange={handleSearchChange} />
        </div>
      </PageHero>

      {/* Explorer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Explorar playas' }]}
        />
        <div className="flex gap-10">
          {/* Sidebar filters (single instance handles both mobile + desktop) */}
          <FilterPanel
            activities={activities}
            filters={filters}
            mobileOpen={mobileFilterOpen}
            municipalities={municipalities}
            seas={seas}
            services={services}
            tags={tags}
            onChange={handleFiltersChange}
            onMobileClose={() => {
              setMobileFilterOpen(false)
            }}
          />

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
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
              <SortSelect value={sort} onChange={handleSortChange} />
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    className="bg-ocean-50 text-ocean-700 hover:bg-ocean-100 focus-visible:ring-ocean-500 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                    type="button"
                    onClick={chip.onRemove}
                  >
                    {chip.label}
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                ))}
                <button
                  className="focus-visible:ring-ocean-500 rounded-full text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  type="button"
                  onClick={clearAllFilters}
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Results */}
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
                      className="bg-ocean-600 hover:bg-ocean-700 focus-visible:ring-ocean-500 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      type="button"
                      onClick={clearAllFilters}
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
