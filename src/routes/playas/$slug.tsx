import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  beaches,
  beachToSlug,
  getBeachBySlug,
  getMunicipality,
  services,
} from "@/lib/data"
import { generateBeachSchema } from "@/lib/schema"

export const Route = createFileRoute("/playas/$slug")({
  loader: ({ params }) => {
    const beach = getBeachBySlug(params.slug)
    if (!beach) {
      throw notFound()
    }
    return { beach }
  },
  head: ({ loaderData }) => {
    const beach = loaderData?.beach
    if (!beach) {
      return { meta: [{ title: "Playa no encontrada" }] }
    }

    const municipality = getMunicipality(beach.municipality)
    const schema = generateBeachSchema(beach, municipality, services)

    return {
      meta: [
        { title: `${beach.name} - Playas de Murcia` },
        {
          name: "description",
          content: beach.metaDescription ?? beach.description,
        },
        ...(beach.seoKeywords
          ? [{ name: "keywords", content: beach.seoKeywords.join(", ") }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        },
      ],
    }
  },
  component: BeachPage,
})

function BeachPage() {
  const { beach } = Route.useLoaderData()
  const municipality = getMunicipality(beach.municipality)

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-blue-600">
            Inicio
          </a>
          <span className="mx-2">/</span>
          <span>{beach.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">{beach.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{municipality.name}</p>

        <p className="text-gray-700 leading-relaxed">{beach.description}</p>
      </div>
    </main>
  )
}

export function getStaticPaths() {
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
