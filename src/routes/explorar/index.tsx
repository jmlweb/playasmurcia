import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useCallback, useMemo } from 'react'

import { BeachCard } from '@/components/beach-card'
import { Breadcrumb } from '@/components/breadcrumb'
import { FilterPanel } from '@/components/filter-panel'
import { PageHero } from '@/components/page-hero'
import { SearchBar } from '@/components/search-bar'
import { SortSelect } from '@/components/sort-select'
import type { BeachSearchParams } from '@/lib/beach-filters'
import { applyFiltersAndSort } from '@/lib/beach-filters'
import { beachToSlug } from '@/lib/slugs'

function validateSearch(search: Record<string, unknown>): BeachSearchParams {
  return {
    q: typeof search.q === 'string' ? search.q : undefined,
    municipality: Array.isArray(search.municipality)
      ? search.municipality.map(Number).filter((n) => !isNaN(n))
      : typeof search.municipality === 'string'
        ? [Number(search.municipality)].filter((n) => !isNaN(n))
        : undefined,
    sea: Array.isArray(search.sea)
      ? search.sea.map(Number).filter((n) => !isNaN(n))
      : typeof search.sea === 'string'
        ? [Number(search.sea)].filter((n) => !isNaN(n))
        : undefined,
    services: Array.isArray(search.services)
      ? search.services.map(Number).filter((n) => !isNaN(n))
      : typeof search.services === 'string'
        ? [Number(search.services)].filter((n) => !isNaN(n))
        : undefined,
    activities: Array.isArray(search.activities)
      ? search.activities.map(Number).filter((n) => !isNaN(n))
      : typeof search.activities === 'string'
        ? [Number(search.activities)].filter((n) => !isNaN(n))
        : undefined,
    tags: Array.isArray(search.tags)
      ? search.tags.map(Number).filter((n) => !isNaN(n))
      : typeof search.tags === 'string'
        ? [Number(search.tags)].filter((n) => !isNaN(n))
        : undefined,
    sort:
      search.sort === 'name' ||
      search.sort === 'municipality' ||
      search.sort === 'length' ||
      search.sort === 'occupancy'
        ? search.sort
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
        content: `Explora y filtra las ${loaderData?.beaches.length ?? 194} playas de la Region de Murcia. Busca por municipio, mar, servicios, actividades y mas.`,
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

  const filters: BeachSearchParams = search
  const sort = filters.sort ?? 'name'

  const updateFilters = useCallback(
    (next: BeachSearchParams) => {
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
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const filteredBeaches = useMemo(
    () => applyFiltersAndSort(beaches, { ...filters, sort }),
    [beaches, filters, sort],
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

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    if (filters.municipality) {
      for (const i of filters.municipality) {
        const m = municipalities[i]
        if (m)
          chips.push({
            key: `m-${i}`,
            label: m.name,
            onRemove: () =>
              updateFilters({
                ...filters,
                municipality: filters.municipality?.filter((v) => v !== i),
              }),
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
            onRemove: () =>
              updateFilters({
                ...filters,
                sea: filters.sea?.filter((v) => v !== i),
              }),
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
            onRemove: () =>
              updateFilters({
                ...filters,
                services: filters.services?.filter((v) => v !== i),
              }),
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
            onRemove: () =>
              updateFilters({
                ...filters,
                activities: filters.activities?.filter((v) => v !== i),
              }),
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
            onRemove: () =>
              updateFilters({
                ...filters,
                tags: filters.tags?.filter((v) => v !== i),
              }),
          })
      }
    }
    return chips
  }, [filters, municipalities, seas, services, activities, tags, updateFilters])

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Header */}
      <PageHero>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Explorar playas
        </h1>
        <p className="text-ocean-200 mx-auto mb-8 max-w-xl text-lg">
          Filtra entre {beaches.length} playas y calas del litoral murciano
        </p>
        <div className="mx-auto max-w-lg">
          <SearchBar value={filters.q ?? ''} onChange={handleSearchChange} />
        </div>
      </PageHero>

      {/* Explorer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Explorar playas' }]}
        />
        <div className="flex gap-10">
          {/* Sidebar filters (single instance handles both mobile + desktop) */}
          <FilterPanel
            activities={activities}
            filters={filters}
            municipalities={municipalities}
            seas={seas}
            services={services}
            tags={tags}
            onChange={handleFiltersChange}
          />

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  <strong className="font-semibold text-gray-900">
                    {filteredBeaches.length}
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
                    className="bg-ocean-50 text-ocean-700 hover:bg-ocean-100 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors focus:outline-none"
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
                  className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  type="button"
                  onClick={clearAllFilters}
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Results */}
            {filteredBeaches.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
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
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-24 text-center">
                <svg
                  aria-hidden="true"
                  className="mb-5 h-14 w-14 text-gray-300"
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
                <p className="mb-1 text-lg font-semibold text-gray-900">
                  No se encontraron playas
                </p>
                <p className="mb-5 text-sm text-gray-500">
                  Prueba a modificar los filtros o el texto de busqueda
                </p>
                {hasActiveFilters && (
                  <button
                    className="bg-ocean-600 hover:bg-ocean-700 focus:ring-ocean-500 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    type="button"
                    onClick={clearAllFilters}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
