'use client'

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback, useMemo } from "react"
import type { BeachSearchParams } from "@/lib/beach-filters"
import { applyFiltersAndSort } from "@/lib/beach-filters"
import {
  beachToSlug,
  getAllActivities,
  getAllBeaches,
  getAllMunicipalities,
  getAllSeas,
  getAllServices,
  getAllTags,
} from "@/lib/db-data"
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

export const Route = createFileRoute("/")({
  validateSearch,
  loader: async () => {
    const [beaches, municipalities, services, activities, tags, seas] = await Promise.all([
      getAllBeaches(),
      getAllMunicipalities(),
      getAllServices(),
      getAllActivities(),
      getAllTags(),
      getAllSeas(),
    ])
    return { beaches, municipalities, services, activities, tags, seas }
  },
  head: () => ({
    meta: [
      { title: "Playas de Murcia - Explora 194 playas de la Región de Murcia" },
      {
        name: "description",
        content:
          "Descubre y filtra las 194 playas de la Región de Murcia. Busca por municipio, mar, servicios, actividades y más.",
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { beaches, municipalities, services, activities, tags, seas } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: "/" })

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
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-b from-blue-800 to-blue-600 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-2 text-5xl font-bold">Playas de Murcia</h1>
          <p className="mb-6 text-xl text-blue-100">
            Descubre las {beaches.length} playas de la Región de Murcia
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar value={filters.q ?? ""} onChange={handleSearchChange} />
          </div>
        </div>
      </section>

      {/* Explorer */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-4 rounded-lg bg-white p-5 shadow-sm">
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">{filteredBeaches.length}</strong> playas
                  encontradas
                </span>
              </div>
              <SortSelect value={sort} onChange={handleSortChange} />
            </div>

            {/* Results */}
            {filteredBeaches.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  className="mb-4 h-16 w-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mb-1 text-xl font-semibold text-gray-900">
                  No se encontraron playas
                </p>
                <p className="mb-4 text-gray-500">
                  Prueba a modificar los filtros o el texto de búsqueda
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
