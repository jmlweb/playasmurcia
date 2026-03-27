import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  beachToSlug,
  getAllActivities,
  getAllBeaches,
  getAllServices,
  getAllTags,
  getBeachBySlug,
  getMunicipality,
  getMunicipalityMap,
  getNearbyBeaches,
} from '@/lib/db-data'
import { generateBeachSchema } from '@/lib/schema'
import { PhotoGallery } from '@/components/photo-gallery'
import { ServicesGrid } from '@/components/services-grid'
import { ActivitiesGrid } from '@/components/activities-grid'
import { CertificationsBadge } from '@/components/certifications-badge'
import { PracticalInfoCard } from '@/components/practical-info-card'
import { NearbyCarousel } from '@/components/nearby-carousel'
import { ContactInfo } from '@/components/contact-info'
import { LocationMap } from '@/components/location-map'
import { TagsSection } from '@/components/tags-section'

export const Route = createFileRoute('/playas/$slug')({
  loader: async ({ params }) => {
    const beach = await getBeachBySlug(params.slug)
    if (!beach) {
      throw notFound()
    }

    const [
      municipality,
      services,
      activities,
      tags,
      nearbyBeaches,
      municipalityMap,
    ] = await Promise.all([
      getMunicipality(beach.municipality),
      getAllServices(),
      getAllActivities(),
      getAllTags(),
      getNearbyBeaches(beach.nearby),
      getMunicipalityMap(),
    ])

    const nearbyItems = nearbyBeaches.map((nearbyBeach) => {
      const nearbyMunicipality = municipalityMap.get(
        nearbyBeach.municipality,
      ) ?? {
        name: '',
        id: '',
      }
      return {
        beach: nearbyBeach,
        municipality: nearbyMunicipality,
        slug: beachToSlug(nearbyBeach),
      }
    })

    return { beach, municipality, services, activities, tags, nearbyItems }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Playa no encontrada' }] }
    }
    const { beach, municipality, services } = loaderData
    const slug = beachToSlug(beach)

    const schema = generateBeachSchema(beach, municipality, services, slug)

    return {
      meta: [
        { title: `${beach.name} - Playas de Murcia` },
        {
          name: 'description',
          content: beach.metaDescription ?? beach.description,
        },
        ...(beach.seoKeywords
          ? [{ name: 'keywords', content: beach.seoKeywords.join(', ') }]
          : []),
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    }
  },
  component: BeachPage,
})

function BeachPage() {
  const { beach, municipality, services, activities, tags, nearbyItems } =
    Route.useLoaderData()

  const pictures = beach.pictures ?? []

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Hero / Gallery */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-4 sm:px-6 lg:px-8">
          <nav
            className="mb-5 text-sm text-gray-500"
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
            <span className="text-gray-600" aria-current="page">
              {beach.name}
            </span>
          </nav>

          <div className="mb-5 flex flex-wrap items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {beach.name}
              </h1>
              <p className="mt-1.5 text-lg text-gray-500">
                {municipality.name}
              </p>
            </div>
            {beach.tags && beach.tags.length > 0 && (
              <TagsSection tagIndices={beach.tags} allTags={tags} />
            )}
          </div>

          {beach.certifications && beach.certifications.length > 0 && (
            <div className="mb-5">
              <CertificationsBadge certifications={beach.certifications} />
            </div>
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <PhotoGallery pictures={pictures} beachName={beach.name} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content column */}
          <div className="space-y-10 lg:col-span-2">
            {/* Description */}
            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Sobre esta playa
              </h2>
              <p className="leading-relaxed text-gray-600">
                {beach.description}
              </p>
            </section>

            {/* Services */}
            {beach.services.length > 0 && (
              <ServicesGrid
                serviceIndices={beach.services}
                allServices={services}
              />
            )}

            {/* Activities */}
            {beach.activities.length > 0 && (
              <ActivitiesGrid
                activityIndices={beach.activities}
                allActivities={activities}
              />
            )}

            {/* How to get there */}
            {beach.access && (
              <section>
                <h2 className="mb-3 text-xl font-semibold text-gray-900">
                  Como llegar
                </h2>
                <p className="leading-relaxed text-gray-600">{beach.access}</p>
              </section>
            )}

            {/* Map */}
            <LocationMap
              coordinates={beach.coordinates}
              beachName={beach.name}
            />

            {/* Nearby beaches */}
            {nearbyItems.length > 0 && <NearbyCarousel items={nearbyItems} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PracticalInfoCard
              length={beach.length}
              soilType={beach.soilType}
              waves={beach.waves}
              occupancyLevel={beach.occupancyLevel}
              accessDifficulty={beach.accessDifficulty}
              childSafe={beach.childSafe}
              naturalShade={beach.naturalShade}
              waterQuality={beach.waterQuality}
              bestSeason={beach.bestSeason}
              orientation={beach.orientation}
            />

            <ContactInfo
              phone={beach.phone}
              email={beach.email}
              realUrl={beach.realUrl}
              instagramHashtag={beach.instagramHashtag}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getStaticPaths() {
  const beaches = await getAllBeaches()
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
