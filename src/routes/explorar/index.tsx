import {
  ClientOnly,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { BeachSearchParams, FilterContext } from '@/lib/beach-filters'

import { PageHero } from '@/components/layout/page-hero'
import { BeachCard } from '@/features/beaches/beach-card'
import { useCardFlagsState } from '@/features/beaches/use-card-flags'
import { useCardWeather } from '@/features/beaches/use-card-weather'
import { ActiveFilterChips } from '@/features/explorer/active-filter-chips'
import { EmptyResults } from '@/features/explorer/empty-results'
import {
  hasGeolocationGrant,
  useUserLocation,
} from '@/features/explorer/use-user-location'
import {
  FilterPanel,
  FilterToggleButton,
} from '@/features/listing/filter-panel'
import { Pagination } from '@/features/listing/pagination'
import { ResultsSummary } from '@/features/listing/results-summary'
import { SearchBar } from '@/features/listing/search-bar'
import { SortSelect } from '@/features/listing/sort-select'
import {
  applyFiltersAndSort,
  beachCountLabel,
  countActiveFilters,
  dropUnknownFilterIds,
} from '@/lib/beach-filters'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { mergeExplorerSearch, validateSearch } from '@/lib/explorer-search'
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

const MapPlaceholder = () => (
  <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
)

export const Route = createFileRoute('/explorar/')({
  validateSearch,
  loader: () => fetchExplorerData(),
  head: ({ loaderData }) => ({
    meta: [
      { title: 'Todas las playas - Playas de Murcia' },
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

function ViewToggle({
  value,
  onChange,
  className = 'inline-flex',
}: {
  value: 'list' | 'map'
  onChange: (next: 'list' | 'map') => void
  className?: string
}) {
  return (
    <div
      aria-label="Vista"
      className={`${className} overflow-hidden rounded-full border border-gray-200 bg-white text-sm font-medium`}
      role="group"
    >
      {(['list', 'map'] as const).map((option) => (
        <button
          key={option}
          aria-pressed={value === option}
          className={`px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none focus-visible:ring-inset sm:px-4 pointer-coarse:min-h-11 ${value === option ? 'bg-ocean-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          type="button"
          onClick={() => {
            onChange(option)
          }}
        >
          {option === 'list' ? 'Lista' : 'Mapa'}
        </button>
      ))}
    </div>
  )
}

function ExplorerPage() {
  const { beaches, municipalities, services, activities, tags, seas } =
    Route.useLoaderData()
  const weatherData = useCardWeather(beaches)
  const { flags: flagData, isSettled: flagsSettled } =
    useCardFlagsState(beaches)
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()

  const PAGE_SIZE = 15
  // "Bandera verde hoy" needs the live 112 feed, which is silent off season:
  // without green flags to filter by, the filter neither shows nor applies
  const greenFlagCodes = useMemo(
    () =>
      new Set(
        Object.entries(flagData)
          .filter(([, flag]) => flag === 'VERDE')
          .map(([code]) => code),
      ),
    [flagData],
  )
  const flagGreenAvailable = flagsSettled && greenFlagCodes.size > 0
  const filters: BeachSearchParams = useMemo(() => {
    const known = dropUnknownFilterIds(search, {
      municipalities,
      seas,
      services,
      activities,
      tags,
    })
    return flagGreenAvailable ? known : { ...known, flagGreen: undefined }
  }, [
    search,
    flagGreenAvailable,
    municipalities,
    seas,
    services,
    activities,
    tags,
  ])
  const filterContext: FilterContext = useMemo(
    () => ({ greenFlagCodes: flagGreenAvailable ? greenFlagCodes : undefined }),
    [flagGreenAvailable, greenFlagCodes],
  )
  const { state: locationState, request: requestLocation } = useUserLocation()
  const position =
    locationState.status === 'granted' ? locationState.position : undefined
  const view = search.view ?? 'list'
  // "Cerca de mí" in a shared URL has no position to rank by on this device
  const requestedSort = filters.sort ?? 'recomendados'
  const sort =
    requestedSort === 'cercania' && !position ? 'recomendados' : requestedSort
  const currentPage = search.page ?? 1

  // Only restores silently: a page load must never raise a permission prompt
  useEffect(() => {
    if (requestedSort !== 'cercania' || position) return
    if (locationState.status === 'loading') return
    const dropNearbySort = () => {
      void navigate({
        search: (prev) => ({ ...prev, sort: undefined }),
        replace: true,
        resetScroll: false,
      })
    }
    if (locationState.status === 'error') {
      dropNearbySort()
      return
    }
    let isStale = false
    void hasGeolocationGrant().then((isGranted) => {
      if (isStale) return
      if (isGranted) requestLocation()
      else dropNearbySort()
    })
    return () => {
      isStale = true
    }
  }, [requestedSort, position, locationState.status, navigate, requestLocation])

  const updateFilters = useCallback(
    (
      next: BeachSearchParams,
      page?: number,
      history: 'push' | 'replace' = 'push',
    ) => {
      void navigate({
        search: (prev) => mergeExplorerSearch(prev, next, page),
        replace: history === 'replace',
        // Scrolling stays here: a filter keeps its place, a page goes to results
        resetScroll: false,
      })
    },
    [navigate],
  )

  function handleViewChange(nextView: 'list' | 'map') {
    void navigate({
      search: (prev) => ({
        ...prev,
        view: nextView === 'map' ? 'map' : undefined,
      }),
      replace: true,
      resetScroll: false,
    })
  }

  function handlePageChange(page: number) {
    updateFilters({ ...filters, sort }, page)
    const results = document.getElementById('resultados')
    results?.focus({ preventScroll: true })
    // No explicit behavior: html's scroll-behavior honours reduced motion
    results?.scrollIntoView({ block: 'start' })
  }

  const getPageHref = (page: number) =>
    router.buildLocation({
      to: '/explorar',
      search: { ...search, page: page > 1 ? page : undefined },
    }).href

  const allFiltered = useMemo(
    () =>
      applyFiltersAndSort(
        beaches,
        { ...filters, sort },
        position,
        (id) => municipalities[id]?.name ?? '',
        filterContext,
      ),
    [beaches, filters, sort, position, municipalities, filterContext],
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

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Costa de Murcia"
        backgroundImage={pictureUrl('hero-explorar.png')}
        breadcrumb={[
          { label: 'Inicio', href: '/' },
          { label: 'Todas las playas' },
        ]}
        optimizedName="hero-explorar"
        size="compact"
        tone="soft"
      >
        <p className="mb-3 hidden text-sm font-semibold tracking-widest text-white uppercase sm:block">
          Costa Cálida
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white max-sm:mb-5 sm:text-5xl">
          Todas las playas
        </h1>
        <p className="mb-8 hidden max-w-xl text-lg text-ocean-100 sm:block">
          Filtra entre {beaches.length} playas y calas del litoral murciano
        </p>
        <div className="max-w-2xl">
          <SearchBar
            inputId="buscar"
            value={filters.q ?? ''}
            onChange={(q: string) => {
              // Each debounced keystroke would otherwise be its own Back step
              updateFilters(
                { ...filters, q: q || undefined },
                undefined,
                'replace',
              )
            }}
          />
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Flex only on desktop: on mobile FilterPanel leaves an empty wrapper that the gap would indent the results by */}
        <div className="lg:flex lg:gap-10">
          <FilterPanel
            activities={activities}
            beaches={beaches}
            context={filterContext}
            filters={filters}
            flagGreenAvailable={flagGreenAvailable}
            mobileOpen={mobileFilterOpen}
            municipalities={municipalities}
            resultCount={allFiltered.length}
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
            {/* Phones: the filter button stays in reach while the list scrolls */}
            <div className="sticky top-[4.5625rem] z-30 -mx-4 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/60 bg-sand-50 px-4 py-2 sm:top-[3.8125rem] sm:-mx-6 sm:px-6 lg:hidden">
              <FilterToggleButton
                activeCount={countActiveFilters(filters)}
                expanded={mobileFilterOpen}
                onClick={() => {
                  setMobileFilterOpen(true)
                }}
              />
              <p
                aria-hidden="true"
                className="min-w-0 flex-1 basis-0 truncate text-center text-sm text-gray-600 tabular-nums"
              >
                {beachCountLabel(allFiltered.length)}
              </p>
              <ViewToggle value={view} onChange={handleViewChange} />
            </div>

            <h2 className="sr-only">Resultados</h2>
            {/* scroll-mt clears the phone filter bar, which html's scroll-padding does not count */}
            <div
              className="mb-6 flex scroll-mt-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 outline-none lg:scroll-mt-0"
              id="resultados"
              tabIndex={-1}
            >
              {/* Phones read the count in the sticky bar; the live region stays for screen readers */}
              <div className="max-lg:sr-only">
                <ResultsSummary
                  live
                  currentPage={safePage}
                  itemLabel={{
                    singular: 'playa encontrada',
                    plural: 'playas encontradas',
                  }}
                  totalItems={allFiltered.length}
                  totalPages={view === 'map' ? 1 : totalPages}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SortSelect
                  includeNearby
                  value={sort}
                  onChange={handleSortChange}
                />
                <span
                  aria-hidden="true"
                  className="hidden h-6 w-px bg-gray-200 lg:block"
                />
                <ViewToggle
                  className="hidden lg:inline-flex"
                  value={view}
                  onChange={handleViewChange}
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
              showClearAll={allFiltered.length > 0}
              tags={tags}
              onClearAll={() => {
                updateFilters({ sort })
              }}
              onUpdateFilters={updateFilters}
            />

            {allFiltered.length > 0 && view === 'map' ? (
              // Leaflet reads `window` on import, so it cannot run during SSR
              <ClientOnly fallback={<MapPlaceholder />}>
                <Suspense fallback={<MapPlaceholder />}>
                  <ExplorerMap markers={mapMarkers} />
                </Suspense>
              </ClientOnly>
            ) : allFiltered.length > 0 ? (
              <>
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
                  getPageHref={getPageHref}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyResults
                activities={activities}
                beaches={beaches}
                context={filterContext}
                filters={filters}
                municipalities={municipalities}
                seas={seas}
                services={services}
                tags={tags}
                onChange={(next: BeachSearchParams) => {
                  updateFilters({ ...next, sort })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
