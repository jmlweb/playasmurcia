import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { PageHero } from '@/components/layout/page-hero'
import { MunicipalityCard } from '@/features/municipalities/municipality-card'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { pictureUrl } from '@/lib/images'

const fetchMunicipalitiesData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllBeaches, getAllMunicipalities } =
      await import('@/lib/db-data/beach-queries')
    const { addMunicipalityCovers } = await import('@/lib/home-curation')
    const { buildMunicipalityNavWithBlueFlag, sortMunicipalitiesByCoast } =
      await import('@/lib/nav-builders')
    const [beaches, municipalities] = await Promise.all([
      getAllBeaches(),
      getAllMunicipalities(),
    ])
    // Covers rely on the nav being index-aligned with the municipality list,
    // so empty municipalities are dropped after they are attached.
    const withCovers = addMunicipalityCovers(
      buildMunicipalityNavWithBlueFlag(beaches, municipalities),
      beaches,
    )
    return sortMunicipalitiesByCoast(withCovers).filter(
      (municipality) => municipality.beachCount > 0,
    )
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
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Municipios' }]}
        optimizedName="hero-municipios"
      >
        <p className="mb-3 text-sm font-semibold tracking-widest text-coral-300 uppercase">
          Costa de Murcia
        </p>
        <h1 className="mb-4 text-4xl font-normal tracking-tight text-white sm:text-5xl">
          Municipios con playas
        </h1>
        <p className="max-w-xl text-lg text-ocean-100">
          Elige un municipio y descubre sus playas
        </p>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {municipalities.map((municipality) => (
            <li key={municipality.slug}>
              <MunicipalityCard {...municipality} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
