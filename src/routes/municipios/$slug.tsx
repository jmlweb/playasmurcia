import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'

import { BeachCard } from '@/components/beach-card'
import { Breadcrumb } from '@/components/breadcrumb'
import { PageHero } from '@/components/page-hero'
import { SortSelect } from '@/components/sort-select'
import type { BeachSearchParams } from '@/lib/beach-filters'
import { sortBeaches } from '@/lib/beach-filters'
import { generateMunicipalitySchema } from '@/lib/schema'
import { beachToSlug } from '@/lib/slugs'

const fetchMunicipalityData = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { slug: string } }) => {
    const { getAllTags, getBeachesByMunicipality, getMunicipalityBySlug } =
      await import('@/lib/db-data')
    const { fetchBatchCardWeather } = await import('@/lib/open-meteo')
    const result = await getMunicipalityBySlug(ctx.data.slug)
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
      slug: ctx.data.slug,
      weatherData,
    }
  },
)

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
  const [sort, setSort] = useState<NonNullable<BeachSearchParams['sort']>>('name')
  const sortedBeaches = useMemo(() => sortBeaches(beaches, sort), [beaches, sort])

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
            <div className="mb-6 flex justify-end">
              <SortSelect value={sort} onChange={setSort} />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {sortedBeaches.map((beach) => (
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-24 text-center">
            <svg
              aria-hidden="true"
              className="text-ocean-300 mb-5 h-14 w-14"
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
              No hay playas registradas
            </p>
            <p className="text-sm text-gray-500">
              Este municipio no tiene playas catalogadas en nuestra base de
              datos.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            className="text-ocean-600 hover:text-ocean-700 text-sm font-medium transition-colors focus:outline-none focus-visible:underline"
            href="/municipios"
          >
            ← Ver todos los municipios
          </a>
        </div>
      </div>
    </main>
  )
}
