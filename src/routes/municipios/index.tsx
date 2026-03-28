import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Breadcrumb } from '@/components/breadcrumb'
import { BlueFlagBadgeIcon, ServiceIcon } from '@/components/icons'
import { PageHero } from '@/components/page-hero'
import { municipalityToSlug } from '@/lib/slugs'
import type { Beach, Municipality, Service } from '@/types/beach'

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

function MunicipalityCard({
  stats,
  services,
}: {
  stats: MunicipalityStats
  services: Service[]
}) {
  const topServices = stats.topServiceIndices
    .map((i) => services[i])
    .filter(Boolean)

  return (
    <a
      className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      href={`/municipios/${stats.slug}`}
    >
      <div className="flex flex-1 flex-col p-6">
        <h2 className="group-hover:text-ocean-600 mb-1 text-xl font-semibold text-gray-900 transition-colors">
          {stats.municipality.name}
        </h2>
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
          <span>
            <strong className="font-semibold text-gray-900">
              {stats.beachCount}
            </strong>{' '}
            {stats.beachCount === 1 ? 'playa' : 'playas'}
          </span>
          {stats.blueFlagCount > 0 && (
            <span className="flex items-center gap-1">
              <BlueFlagBadgeIcon className="text-ocean-500 h-4 w-4" />
              <strong className="text-ocean-700 font-semibold">
                {stats.blueFlagCount}
              </strong>{' '}
              bandera{stats.blueFlagCount === 1 ? '' : 's'} azul
            </span>
          )}
        </div>
        {topServices.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {topServices.map((service) => (
              <span
                key={service.id}
                className="bg-ocean-50 text-ocean-700 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                <ServiceIcon className="h-3.5 w-3.5" emoji={service.icon} />
                <span>{service.name}</span>
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-ocean-600 group-hover:text-ocean-700 text-sm font-medium transition-colors">
            Ver playas →
          </span>
        </div>
      </div>
    </a>
  )
}

function MunicipiosPage() {
  const { stats, services } = Route.useLoaderData()

  const totalBeaches = stats.reduce((sum, s) => sum + s.beachCount, 0)

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <PageHero>
        <p className="text-ocean-300 mb-3 text-sm font-medium tracking-widest uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Municipios costeros
        </h1>
        <p className="text-ocean-200 mx-auto max-w-xl text-lg">
          {stats.length} municipios con {totalBeaches} playas en la Region de
          Murcia
        </p>
      </PageHero>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Municipios' }]}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {stats.map((s) => (
            <MunicipalityCard key={s.slug} services={services} stats={s} />
          ))}
        </div>
      </div>
    </main>
  )
}
