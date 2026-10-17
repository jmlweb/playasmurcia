import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { lazy, Suspense, useCallback, useMemo, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { BeachCard } from '@/features/beaches/beach-card'
import { useCardFlags } from '@/features/beaches/use-card-flags'
import { useCardWeather } from '@/features/beaches/use-card-weather'
import { ActiveFilterChips } from '@/features/explorer/active-filter-chips'
import { useUserLocation } from '@/features/explorer/use-user-location'
import {
  FilterPanel,
  FilterToggleButton,
} from '@/features/listing/filter-panel'
import { PageInfo } from '@/features/listing/page-info'
import { Pagination } from '@/features/listing/pagination'
import { SearchBar } from '@/features/listing/search-bar'
import { SortSelect } from '@/features/listing/sort-select'
import { applyFiltersAndSort, countActiveFilters } from '@/lib/beach-filters'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { validateSearch } from '@/lib/explorer-search'
import { haversineKm } from '@/lib/geo'
import { pictureUrl } from '@/lib/images'
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
    const [beaches, municipalities, services, activities, tags, seas] =
      await Promise.all([
        getAllBeaches(),
        getAllMunicipalities(),
        getAllServices(),
        getAllActivities(),
        getAllTags(),
        getAllSeas(),
      ])
    return {
      beaches,
      municipalities,
      services,
      activities,
      tags,
      seas,
    }
  },
)

const ExplorerMap = lazy(() =>
  import('@/features/explorer/explorer-map').then((m) => ({
    default: m.ExplorerMap,
  })),
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
      ogUrlMeta('/explorar'),
    ],
    links: [canonicalLink('/explorar')],
  }),
  component: ExplorerPage,
})

function ExplorerPage() {
  const { beaches, municipalities, services, activities, tags, seas } =
    Route.useLoaderData()
  const weatherData = useCardWeather(beaches)
  const flagData = useCardFlags(beaches)
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const PAGE_SIZE = 15
  const filters: BeachSearchParams = search
  const { state: locationState, request: requestLocation } = useUserLocation()
  const position =
    locationState.status === 'granted' ? locationState.position : undefined
  const [view, setView] = useState<'list' | 'map'>('list')
  // "Cerca de mí" in a shared URL has no position to rank by on this device
  const requestedSort = filters.sort ?? 'recomendados'
  const sort =
    requestedSort === 'cercania' && !position ? 'recomendados' : requestedSort
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
          accessDifficulty: next.accessDifficulty?.length
            ? next.accessDifficulty
            : undefined,
          occupancy: next.occupancy?.length ? next.occupancy : undefined,
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
    () => applyFiltersAndSort(beaches, { ...filters, sort }, position),
    [beaches, filters, sort, position],
  )
  const mapMarkers = useMemo(
    () =>
      allFiltered.map((beach) => ({
        code: beach.code,
        name: beach.name,
        slug: beachToSlug(beach),
        coordinates: beach.coordinates,
      })),
    [allFiltered],
  )

  function handleSortChange(nextSort: BeachSearchParams['sort']) {
    if (nextSort === 'cercania' && !position) {
      requestLocation(() => {
        updateFilters({ ...filters, sort: 'cercania' })
      })
      return
    }
    updateFilters({ ...filters, sort: nextSort })
  }
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
    Boolean(filters.q?.trim()) || countActiveFilters(filters) > 0

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Costa de Murcia"
        backgroundImage={pictureUrl('hero-explorar.png')}
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-ocean-300 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none disabled:opacity-60"
                  disabled={locationState.status === 'loading'}
                  type="button"
                  onClick={() => {
                    handleSortChange('cercania')
                  }}
                >
                  {locationState.status === 'loading'
                    ? 'Buscando tu ubicación…'
                    : 'Cerca de mí'}
                </button>
                <div
                  aria-label="Vista"
                  className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-white text-sm font-medium"
                  role="group"
                >
                  {(['list', 'map'] as const).map((option) => (
                    <button
                      key={option}
                      aria-pressed={view === option}
                      className={`px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none focus-visible:ring-inset ${view === option ? 'bg-ocean-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                      type="button"
                      onClick={() => {
                        setView(option)
                      }}
                    >
                      {option === 'list' ? 'Lista' : 'Mapa'}
                    </button>
                  ))}
                </div>
                <SortSelect
                  includeNearby
                  value={sort}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            <p
              aria-live="polite"
              className="mb-4 text-sm text-amber-700 empty:hidden"
              role="status"
            >
              {locationState.status === 'error' ? locationState.message : ''}
            </p>

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

            {allFiltered.length > 0 && view === 'map' ? (
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
                }
              >
                <ExplorerMap markers={mapMarkers} />
              </Suspense>
            ) : allFiltered.length > 0 ? (
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
                        distanceKm={
                          position && sort === 'cercania'
                            ? haversineKm(position, beach.coordinates)
                            : undefined
                        }
                        flag={flagData[beach.code]}
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
