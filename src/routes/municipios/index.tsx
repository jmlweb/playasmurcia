import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { PageHero } from '@/components/layout/page-hero'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { pictureUrl } from '@/lib/images'

const fetchMunicipalitiesData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches, getAllMunicipalities } =
      await import('@/lib/db-data/beach-queries')
    const { buildMunicipalityNavWithBlueFlag } =
      await import('@/lib/nav-builders')
    const [beaches, municipalities] = await Promise.all([
      getAllBeaches(),
      getAllMunicipalities(),
    ])
    return buildMunicipalityNavWithBlueFlag(beaches, municipalities)
      .filter((municipality) => municipality.beachCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  },
)

export const Route = createFileRoute('/municipios/')({
  loader: () => fetchMunicipalitiesData(),
  head: () => ({
    meta: [
      { title: 'Municipios con Playas - Playas de Murcia' },
      {
        name: 'description',
        content:
          'Descubre las playas de cada municipio costero de la Región de Murcia: Cartagena, Mazarrón, San Javier, Águilas y más.',
      },
      ogUrlMeta('/municipios'),
    ],
    links: [canonicalLink('/municipios')],
  }),
  component: MunicipiosPage,
})

function MunicipiosPage() {
  const municipalities = Route.useLoaderData()

  return (
    <main className="min-h-screen bg-sand-50">
      <PageHero
        backgroundAlt="Costa de la Región de Murcia"
        backgroundImage={pictureUrl('hero-municipios.png')}
        optimizedName="hero-municipios"
      >
        <p className="mb-3 text-sm font-medium tracking-widest text-ocean-300 uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Municipios con playas
        </h1>
        <p className="mx-auto max-w-xl text-lg text-ocean-200">
          Elige un municipio y descubre sus playas
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Municipios' }]}
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {municipalities.map((municipality) => (
            <li key={municipality.slug}>
              <Link
                className="group flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
                params={{ slug: municipality.slug }}
                to="/municipios/$slug"
              >
                <h2 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-ocean-600">
                  {municipality.name}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  <strong className="font-semibold text-gray-900">
                    {municipality.beachCount}
                  </strong>{' '}
                  {municipality.beachCount === 1 ? 'playa' : 'playas'}
                  {municipality.blueFlagCount > 0 && (
                    <>
                      {' · '}
                      <strong className="font-semibold text-ocean-600">
                        {municipality.blueFlagCount}
                      </strong>{' '}
                      {municipality.blueFlagCount === 1
                        ? 'bandera azul'
                        : 'banderas azules'}
                    </>
                  )}
                </p>
                <span className="mt-auto text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
                  Ver playas →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
