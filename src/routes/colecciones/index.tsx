import { createFileRoute } from '@tanstack/react-router'
import { getAllBeaches } from '@/lib/db-data'
import {
  collections,
  filterBeachesByCollection,
} from '@/lib/collections'

export const Route = createFileRoute('/colecciones/')({
  loader: async () => {
    const beaches = await getAllBeaches()
    const items = collections.map((collection) => ({
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      beachCount: filterBeachesByCollection(beaches, collection).length,
    }))
    return { items }
  },
  head: () => ({
    meta: [
      {
        title: 'Colecciones de Playas - Playas de Murcia',
      },
      {
        name: 'description',
        content:
          'Explora nuestras colecciones tematicas de playas: familiares, nudistas, con chiringuito, bandera azul y mas.',
      },
    ],
  }),
  component: ColeccionesPage,
})

function CollectionCard({
  slug,
  title,
  description,
  beachCount,
}: {
  slug: string
  title: string
  description: string
  beachCount: number
}) {
  return (
    <a
      href={`/colecciones/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ocean-200 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
    >
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-gray-500">
            <strong className="font-semibold text-gray-900">
              {beachCount}
            </strong>{' '}
            {beachCount === 1 ? 'playa' : 'playas'}
          </span>
          <span className="text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
            Ver coleccion →
          </span>
        </div>
      </div>
    </a>
  )
}

function ColeccionesPage() {
  const { items } = Route.useLoaderData()

  return (
    <main className="bg-sand-50 min-h-screen">
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
            Colecciones de playas
          </h1>
          <p className="text-lg text-ocean-200">
            Encuentra la playa perfecta segun tus preferencias
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          className="mb-8 text-sm text-gray-500"
          aria-label="Ruta de navegacion"
        >
          <a
            href="/"
            className="hover:text-ocean-600 transition-colors focus:outline-none"
          >
            Inicio
          </a>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-gray-600" aria-current="page">
            Colecciones
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: { slug: string; title: string; description: string; beachCount: number }) => (
            <CollectionCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              description={item.description}
              beachCount={item.beachCount}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
