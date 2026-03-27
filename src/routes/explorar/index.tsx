'use client'

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useCallback, useMemo } from "react"
import type { BeachSearchParams } from "@/lib/beach-filters"
import { applyFiltersAndSort } from "@/lib/beach-filters"
import { beachToSlug } from "@/lib/slugs"
import { BeachCard } from "@/components/beach-card"
import { FilterPanel } from "@/components/filter-panel"
import { SearchBar } from "@/components/search-bar"
import { SortSelect } from "@/components/sort-select"

function validateSearch(search: Record<string, unknown>): BeachSearchParams {
  return {
    q: typeof search.q === "string" ? search.q : undefined,
    municipality: Array.isArray(search.municipality)
      ? search.municipality.map(Number).filter((n) => !isNaN(n))
      : typeof search.municipality === "string"
        ? [Number(search.municipality)].filter((n) => !isNaN(n))
        : undefined,
    sea: Array.isArray(search.sea)
      ? search.sea.map(Number).filter((n) => !isNaN(n))
      : typeof search.sea === "string"
        ? [Number(search.sea)].filter((n) => !isNaN(n))
        : undefined,
    services: Array.isArray(search.services)
      ? search.services.map(Number).filter((n) => !isNaN(n))
      : typeof search.services === "string"
        ? [Number(search.services)].filter((n) => !isNaN(n))
        : undefined,
    activities: Array.isArray(search.activities)
      ? search.activities.map(Number).filter((n) => !isNaN(n))
      : typeof search.activities === "string"
        ? [Number(search.activities)].filter((n) => !isNaN(n))
        : undefined,
    tags: Array.isArray(search.tags)
      ? search.tags.map(Number).filter((n) => !isNaN(n))
      : typeof search.tags === "string"
        ? [Number(search.tags)].filter((n) => !isNaN(n))
        : undefined,
    sort:
      search.sort === "name" ||
      search.sort === "municipality" ||
      search.sort === "length" ||
      search.sort === "occupancy"
        ? search.sort
        : undefined,
  }
}

const fetchExplorerData = createServerFn({ method: 'GET' }).handler(async () => {
  const { getAllBeaches, getAllMunicipalities, getAllServices, getAllActivities, getAllTags, getAllSeas } = await import("@/lib/db-data")
  const [beaches, municipalities, services, activities, tags, seas] = await Promise.all([
    getAllBeaches(),
    getAllMunicipalities(),
    getAllServices(),
    getAllActivities(),
    getAllTags(),
    getAllSeas(),
  ])
  return { beaches, municipalities, services, activities, tags, seas }
})

export const Route = createFileRoute("/explorar/")({
  validateSearch,
  loader: () => fetchExplorerData(),
  head: () => ({
    meta: [
      { title: "Explorar playas - Playas de Murcia" },
      {
        name: "description",
        content:
          "Explora y filtra las 194 playas de la Region de Murcia. Busca por municipio, mar, servicios, actividades y mas.",
      },
    ],
  }),
  component: ExplorerPage,
})

function ExplorerPage() {
  const { beaches, municipalities, services, activities, tags, seas } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: "/explorar" })

  const filters: BeachSearchParams = search
  const sort = filters.sort ?? "name"

  const updateFilters = useCallback(
    (next: BeachSearchParams) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          ...next,
          municipality: next.municipality?.length ? next.municipality : undefined,
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

  function handleSortChange(nextSort: BeachSearchParams["sort"]) {
    updateFilters({ ...filters, sort: nextSort })
  }

  function handleFiltersChange(next: BeachSearchParams) {
    updateFilters({ ...next, sort })
  }

  function clearAllFilters() {
    updateFilters({ sort })
  }

  const hasActiveFilters =
    (filters.q && filters.q.trim()) ||
    (filters.municipality?.length ?? 0) > 0 ||
    (filters.sea?.length ?? 0) > 0 ||
    (filters.services?.length ?? 0) > 0 ||
    (filters.activities?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0

  return (
    <main className="min-h-screen bg-sand-50">
      {/* Header */}
      <section className="bg-ocean-900 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Explorar playas
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-ocean-200">
            Filtra entre {beaches.length} playas y calas del litoral murciano
          </p>
          <div className="mx-auto max-w-lg">
            <SearchBar value={filters.q ?? ""} onChange={handleSearchChange} />
          </div>
        </div>
      </section>

      {/* Explorer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
              <FilterPanel
                municipalities={municipalities}
                seas={seas}
                services={services}
                activities={activities}
                tags={tags}
                filters={filters}
                onChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <div className="lg:hidden">
                  <FilterPanel
                    municipalities={municipalities}
                    seas={seas}
                    services={services}
                    activities={activities}
                    tags={tags}
                    filters={filters}
                    onChange={handleFiltersChange}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  <strong className="font-semibold text-gray-900">{filteredBeaches.length}</strong>{" "}
                  playas encontradas
                </span>
              </div>
              <SortSelect value={sort} onChange={handleSortChange} />
            </div>

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
                      tags={tags}
                      slug={slug}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-24 text-center">
                <svg
                  className="mb-5 h-14 w-14 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 focus:outline-none"
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
