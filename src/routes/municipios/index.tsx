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
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
    >
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-1 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
          {stats.municipality.name}
        </h2>
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
          <span>
            <strong className="text-gray-900">{stats.beachCount}</strong>{" "}
            {stats.beachCount === 1 ? "playa" : "playas"}
          </span>
          {stats.blueFlagCount > 0 && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">🏖️</span>
              <strong className="text-blue-700">{stats.blueFlagCount}</strong>{" "}
              bandera{stats.blueFlagCount === 1 ? "" : "s"} azul
            </span>
          )}
        </div>
        {topServices.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {topServices.map((service) => (
              <span
                key={service.id}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                title={service.name}
              >
                <span aria-hidden="true">{service.icon}</span>
                <span>{service.name}</span>
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600 group-hover:underline">
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
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-b from-blue-800 to-blue-600 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-2 text-5xl font-bold">Municipios de la Costa</h1>
          <p className="text-xl text-blue-100">
            {stats.length} municipios costeros con {totalBeaches} playas en la Región de Murcia
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Ruta de navegación">
          <a href="/" className="hover:text-blue-600 focus:outline-none">
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page">Municipios</span>
        </nav>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <MunicipalityCard key={s.municipality.id} stats={s} services={services} />
          ))}
        </div>
      </div>
    </main>
  )
}
