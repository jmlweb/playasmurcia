import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { beachToSlug } from '@/lib/slugs'
import {
  collections,
  filterBeachesByCollection,
  getCollectionBySlug,
} from '@/lib/collections'
import { BeachCard } from '@/components/beach-card'

const fetchCollectionData = createServerFn({ method: 'GET' }).handler(async (ctx: { data: { slug: string } }) => {
  const { beachToSlug: toSlug, getAllBeaches, getAllTags, getMunicipalityMap } = await import('@/lib/db-data')
  const collection = getCollectionBySlug(ctx.data.slug)
  if (!collection) return null

  const [beaches, tags, municipalityMap] = await Promise.all([
    getAllBeaches(),
    getAllTags(),
    getMunicipalityMap(),
  ])

  const filtered = filterBeachesByCollection(beaches, collection)
  const items = filtered.map((beach) => ({
    beach,
    municipality: municipalityMap.get(beach.municipality) ?? { name: '', id: '' },
    slug: toSlug(beach),
  }))

  return {
    collection: {
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      metaDescription: collection.metaDescription,
    },
    items,
    tags,
  }
})

export const Route = createFileRoute('/colecciones/$slug')({
  loader: async ({ params }) => {
    const data = await fetchCollectionData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Coleccion no encontrada' }] }
    }
    return {
      meta: [
        {
          title: `${loaderData.collection.title} - Playas de Murcia`,
        },
        {
          name: 'description',
          content: loaderData.collection.metaDescription,
        },
      ],
    }
  },
  component: CollectionPage,
})

function CollectionPage() {
  const { collection, items, tags } = Route.useLoaderData()

  return (
    <main className="bg-sand-50 min-h-screen">
      <section className="relative overflow-hidden bg-ocean-800 px-4 py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-ocean-300">
            Coleccion
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {collection.title}
          </h1>
          <p className="text-lg text-ocean-200">
            {collection.description}
          </p>
          <p className="mt-4 text-sm text-ocean-300">
            {items.length} {items.length === 1 ? 'playa' : 'playas'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="mb-8 text-sm text-gray-500"
          aria-label="Ruta de navegacion"
        >
          <a
            href="/"
            className="transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline focus:outline-none"
          >
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <a
            href="/colecciones"
            className="transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:underline focus:outline-none"
          >
            Colecciones
          </a>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-gray-600" aria-current="page">
            {collection.title}
          </span>
        </nav>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            No se encontraron playas en esta coleccion.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ beach, municipality, slug }) => (
              <BeachCard
                key={beach.code}
                beach={beach}
                municipality={municipality}
                tags={tags}
                slug={slug}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/colecciones"
            className="text-sm font-medium text-ocean-600 transition-colors hover:text-ocean-700 focus-visible:underline focus:outline-none"
          >
            ← Volver a colecciones
          </a>
        </div>
      </div>
    </main>
  )
}

export function getStaticPaths() {
  return collections.map((c) => ({
    params: { slug: c.slug },
  }))
}
