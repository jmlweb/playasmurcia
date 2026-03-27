import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { beachToSlug } from "@/lib/slugs"
import { generateMunicipalitySchema } from "@/lib/schema"
import { BeachCard } from "@/components/beach-card"

const fetchMunicipalityData = createServerFn({ method: 'GET' }).handler(async (ctx: { data: { slug: string } }) => {
  const { getAllTags, getBeachesByMunicipality, getMunicipalityBySlug } = await import("@/lib/db-data")
  const result = await getMunicipalityBySlug(ctx.data.slug)
  if (!result) return null

  const { municipality, index } = result
  const [beaches, tags] = await Promise.all([
    getBeachesByMunicipality(index),
    getAllTags(),
  ])

  const blueFlagCount = beaches.filter((b) => b.certifications?.includes("blue-flag")).length
  return { municipality, beaches, tags, blueFlagCount, slug: ctx.data.slug }
})

export const Route = createFileRoute("/municipios/$slug")({
  loader: async ({ params }) => {
    const data = await fetchMunicipalityData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-800 px-4 py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
        <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="mb-5 text-sm text-ocean-300" aria-label="Ruta de navegacion">
            <a href="/" className="transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus:outline-none">
              Inicio
            </a>
            <span className="mx-2 text-ocean-500" aria-hidden="true">/</span>
            <a href="/municipios" className="transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus:outline-none">
              Municipios
            </a>
            <span className="mx-2 text-ocean-500" aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{municipality.name}</span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Playas de {municipality.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-ocean-200">
            <span>
              <strong className="font-semibold text-white">{beaches.length}</strong>{" "}
              {beaches.length === 1 ? "playa" : "playas"}
            </span>
            {blueFlagCount > 0 && (
              <span>
                <strong className="font-semibold text-ocean-300">{blueFlagCount}</strong>{" "}
                {blueFlagCount === 1 ? "bandera azul" : "banderas azules"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Beach grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {beaches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
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
            <svg className="mb-5 h-14 w-14 text-ocean-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mb-1 text-lg font-semibold text-gray-900">
              No hay playas registradas
            </p>
            <p className="text-sm text-gray-500">
              Este municipio no tiene playas catalogadas en nuestra base de datos.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/municipios"
            className="text-sm font-medium text-ocean-600 transition-colors hover:text-ocean-700 focus-visible:underline focus:outline-none"
          >
            ← Ver todos los municipios
          </a>
        </div>
      </div>
    </main>
  )
}

