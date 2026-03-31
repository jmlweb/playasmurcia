import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { BlueFlagBadgeIcon } from '@/components/ui/icons'
import { municipalityToSlug } from '@/lib/slugs'
import type { Beach, Municipality } from '@/types/beach'

type MunicipalityStats = {
  municipality: Municipality
  index: number
  slug: string
  beachCount: number
  blueFlagCount: number
  topServiceIndices: number[]
}

function computeMunicipalityStats(
  municipalities: Municipality[],
  beaches: Beach[],
): MunicipalityStats[] {
  return municipalities.map((municipality, index) => {
    const municipalityBeaches = beaches.filter((b) => b.municipality === index)
    const blueFlagCount = municipalityBeaches.filter((b) =>
      b.certifications?.includes('blue-flag'),
    ).length

    const serviceCounts = new Map<number, number>()
    for (const beach of municipalityBeaches) {
      for (const serviceIndex of beach.services) {
        serviceCounts.set(
          serviceIndex,
          (serviceCounts.get(serviceIndex) ?? 0) + 1,
        )
      }
    }

    const topServiceIndices = [...serviceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([serviceIndex]) => serviceIndex)

    return {
      municipality,
      index,
      slug: municipalityToSlug(municipality),
      beachCount: municipalityBeaches.length,
      blueFlagCount,
      topServiceIndices,
    }
  })
}

const fetchMunicipiosData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches, getAllMunicipalities, getAllServices } =
      await import('@/lib/db-data')
    const [municipalities, beaches, services] = await Promise.all([
      getAllMunicipalities(),
      getAllBeaches(),
      getAllServices(),
    ])
    const stats = computeMunicipalityStats(municipalities, beaches)
    return { stats, services }
  },
)

export const Route = createFileRoute('/municipios/')({
  loader: () => fetchMunicipiosData(),
  head: () => ({
    meta: [
      { title: 'Municipios de la Costa de Murcia - Playas de Murcia' },
      {
        name: 'description',
        content:
          'Explora las playas de los 9 municipios costeros de la Región de Murcia. Cartagena, Águilas, Mazarrón y más.',
      },
    ],
  }),
  component: MunicipiosPage,
})

function MunicipalityCard({ stats }: { stats: MunicipalityStats }) {
  return (
    <Link
      className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug: stats.slug }}
      to="/municipios/$slug"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="group-hover:text-ocean-600 text-xl font-semibold text-gray-900 transition-colors">
            {stats.municipality.name}
          </h2>
          <div className="bg-ocean-50 text-ocean-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold">
            {stats.beachCount}
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {stats.beachCount} {stats.beachCount === 1 ? 'playa' : 'playas'}
          {stats.blueFlagCount > 0 && (
            <>
              {' · '}
              <span className="text-ocean-600 inline-flex items-center gap-1">
                <BlueFlagBadgeIcon className="inline h-3.5 w-3.5" />
                {stats.blueFlagCount} bandera
                {stats.blueFlagCount === 1 ? '' : 's'} azul
              </span>
            </>
          )}
        </p>
        <div className="mt-auto">
          <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
            Ver playas →
          </span>
        </div>
      </div>
    </Link>
  )
}

function MunicipiosPage() {
  const { stats } = Route.useLoaderData()

  const totalBeaches = stats.reduce((sum, s) => sum + s.beachCount, 0)

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <PageHero
        backgroundAlt="Costa de los municipios de Murcia"
        backgroundImage="/pictures/hero-municipios.png"
        optimizedName="hero-municipios"
      >
        <p className="text-ocean-300 mb-3 text-sm font-medium tracking-widest uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Municipios costeros
        </h1>
        <p className="text-ocean-200 mx-auto max-w-xl text-lg">
          {stats.length} municipios con {totalBeaches} playas en la Región de
          Murcia
        </p>
      </PageHero>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Municipios' }]}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {stats.map((s) => (
            <MunicipalityCard key={s.slug} stats={s} />
          ))}
        </div>
      </div>
    </main>
  )
}
