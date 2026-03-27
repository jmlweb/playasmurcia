import { createFileRoute } from "@tanstack/react-router"
import type { Beach, Municipality, Service } from "@/types/beach"
import {
  getAllBeaches,
  getAllMunicipalities,
  getAllServices,
  municipalityToSlug,
} from "@/lib/db-data"

interface MunicipalityStats {
  municipality: Municipality
  index: number
  slug: string
  beachCount: number
  blueFlagCount: number
  topServiceIndices: Array<number>
}

function computeMunicipalityStats(
  municipalities: Array<Municipality>,
  beaches: Array<Beach>,
): Array<MunicipalityStats> {
  return municipalities.map((municipality, index) => {
    const municipalityBeaches = beaches.filter((b) => b.municipality === index)
    const blueFlagCount = municipalityBeaches.filter((b) =>
      b.certifications?.includes("blue-flag"),
    ).length

    const serviceCounts = new Map<number, number>()
    for (const beach of municipalityBeaches) {
      for (const serviceIndex of beach.services) {
        serviceCounts.set(serviceIndex, (serviceCounts.get(serviceIndex) ?? 0) + 1)
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

export const Route = createFileRoute("/municipios/")({
  loader: async () => {
    const [municipalities, beaches, services] = await Promise.all([
      getAllMunicipalities(),
      getAllBeaches(),
      getAllServices(),
    ])
    const stats = computeMunicipalityStats(municipalities, beaches)
    return { stats, services }
  },
  head: () => ({
    meta: [
      { title: "Municipios de la Costa de Murcia - Playas de Murcia" },
      {
        name: "description",
        content:
          "Explora las playas de los 9 municipios costeros de la Región de Murcia. Cartagena, Águilas, Mazarrón y más.",
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
  services: Array<Service>
}) {
  const topServices = stats.topServiceIndices.map((i) => services[i]).filter(Boolean)

  return (
    <a
      href={`/municipios/${stats.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ocean-200 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
    >
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-1 text-xl font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {stats.municipality.name}
        </h2>
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
          <span>
            <strong className="font-semibold text-gray-900">{stats.beachCount}</strong>{" "}
            {stats.beachCount === 1 ? "playa" : "playas"}
          </span>
          {stats.blueFlagCount > 0 && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">🏖️</span>
              <strong className="font-semibold text-ocean-700">{stats.blueFlagCount}</strong>{" "}
              bandera{stats.blueFlagCount === 1 ? "" : "s"} azul
            </span>
          )}
        </div>
        {topServices.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {topServices.map((service) => (
              <span
                key={service.id}
                className="flex items-center gap-1 rounded-full bg-ocean-50 px-2.5 py-0.5 text-xs font-medium text-ocean-700"
                title={service.name}
              >
                <span aria-hidden="true">{service.icon}</span>
                <span>{service.name}</span>
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
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
    <main className="min-h-screen bg-sand-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-800 px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-ocean-300">
            Costa de Murcia
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Municipios costeros
          </h1>
          <p className="text-lg text-ocean-200">
            {stats.length} municipios con {totalBeaches} playas en la Region de Murcia
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500" aria-label="Ruta de navegacion">
          <a href="/" className="transition-colors hover:text-ocean-600 focus:outline-none">
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-600" aria-current="page">Municipios</span>
        </nav>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <MunicipalityCard key={s.municipality.id} stats={s} services={services} />
          ))}
        </div>
      </div>
    </main>
  )
}
