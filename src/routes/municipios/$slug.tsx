import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  beachToSlug,
  getAllTags,
  getBeachesByMunicipality,
  getMunicipalityBySlug,
} from "@/lib/db-data"
import { generateMunicipalitySchema } from "@/lib/schema"
import { BeachCard } from "@/components/beach-card"

export const Route = createFileRoute("/municipios/$slug")({
  loader: async ({ params }) => {
    const result = await getMunicipalityBySlug(params.slug)
    if (!result) {
      throw notFound()
    }

    const { municipality, index } = result
    const [beaches, tags] = await Promise.all([
      getBeachesByMunicipality(index),
      getAllTags(),
    ])

    const blueFlagCount = beaches.filter((b) => b.certifications?.includes("blue-flag")).length

    return { municipality, beaches, tags, blueFlagCount, slug: params.slug }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Municipio no encontrado" }] }
    }

    const { municipality, beaches, blueFlagCount, slug } = loaderData
    const schema = generateMunicipalitySchema(municipality, beaches.length, slug)

    return {
      meta: [
        { title: `Playas de ${municipality.name} - Playas de Murcia` },
        {
          name: "description",
          content: `Descubre ${beaches.length === 1 ? "la playa" : `las ${beaches.length} playas`} de ${municipality.name}${blueFlagCount > 0 ? `, con ${blueFlagCount} ${blueFlagCount === 1 ? "bandera azul" : "banderas azules"}` : ""}, en la Región de Murcia.`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        },
      ],
    }
  },
  component: MunicipalityPage,
})

function MunicipalityPage() {
  const { municipality, beaches, tags, blueFlagCount } = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-5 text-sm text-gray-500" aria-label="Ruta de navegacion">
            <a href="/" className="transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline focus:outline-none">
              Inicio
            </a>
            <span className="mx-2" aria-hidden="true">/</span>
            <a href="/municipios" className="transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline focus:outline-none">
              Municipios
            </a>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-gray-600" aria-current="page">{municipality.name}</span>
          </nav>

          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Playas de {municipality.name}
          </h1>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              <strong className="font-semibold text-gray-900">{beaches.length}</strong>{" "}
              {beaches.length === 1 ? "playa" : "playas"}
            </span>
            {blueFlagCount > 0 && (
              <span>
                <strong className="font-semibold text-ocean-700">{blueFlagCount}</strong>{" "}
                {blueFlagCount === 1 ? "bandera azul" : "banderas azules"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Beach grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {beaches.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {beaches.map((beach) => (
              <BeachCard
                key={beach.code}
                beach={beach}
                municipality={municipality}
                tags={tags}
                slug={beachToSlug(beach)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-24 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No hay playas registradas para este municipio
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

