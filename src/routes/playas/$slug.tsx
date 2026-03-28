import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { ActivitiesGrid } from '@/components/activities-grid'
import { BeachStatusWidget } from '@/components/beach-status-widget'
import { Breadcrumb } from '@/components/breadcrumb'
import { CertificationsBadge } from '@/components/certifications-badge'
import { ContactInfo } from '@/components/contact-info'
import { LocationMap } from '@/components/location-map'
import { NearbyCarousel } from '@/components/nearby-carousel'
import { PhotoGallery } from '@/components/photo-gallery'
import { PracticalInfoCard } from '@/components/practical-info-card'
import { ServicesGrid } from '@/components/services-grid'
import { TagsSection } from '@/components/tags-section'
import { WeatherWidget } from '@/components/weather-widget'
import { generateBeachSchema } from '@/lib/schema'
import { beachToSlug, municipalityToSlug } from '@/lib/slugs'

const fetchBeachData = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { slug: string } }) => {
    const {
      beachToSlug: toSlug,
      getBeachBySlug,
      getMunicipality,
      getAllServices,
      getAllActivities,
      getAllTags,
      getNearbyBeaches,
      getMunicipalityMap,
    } = await import('@/lib/db-data')
    const beach = await getBeachBySlug(ctx.data.slug)
    if (!beach) return null

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
      ) ?? { name: '', id: '' }
      return {
        beach: nearbyBeach,
        municipality: nearbyMunicipality,
        slug: toSlug(nearbyBeach),
      }
    })

    return { beach, municipality, services, activities, tags, nearbyItems }
  },
)

export const Route = createFileRoute('/playas/$slug')({
  loader: async ({ params }) => {
    const data = await fetchBeachData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
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
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              {
                label: municipality.name,
                href: `/municipios/${municipalityToSlug(municipality)}`,
              },
              { label: beach.name },
            ]}
          />

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
              <TagsSection allTags={tags} tagIndices={beach.tags} />
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <PhotoGallery beachName={beach.name} pictures={pictures} />

          {beach.certifications && beach.certifications.length > 0 && (
            <div className="mt-5">
              <CertificationsBadge certifications={beach.certifications} />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <section className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Sobre esta playa
              </h2>
              <p className="leading-relaxed text-gray-600">
                {beach.description}
              </p>
            </section>

            {/* Services */}
            {beach.services.length > 0 && (
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <ServicesGrid
                  allServices={services}
                  serviceIndices={beach.services}
                />
              </div>
            )}

            {/* Activities */}
            {beach.activities.length > 0 && (
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <ActivitiesGrid
                  activityIndices={beach.activities}
                  allActivities={activities}
                />
              </div>
            )}

            {/* How to get there */}
            {beach.access && (
              <section className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold text-gray-900">
                  Como llegar
                </h2>
                <p className="leading-relaxed text-gray-600">{beach.access}</p>
              </section>
            )}

            {/* Map */}
            <LocationMap
              beachName={beach.name}
              coordinates={beach.coordinates}
            />

            {/* Nearby beaches */}
            {nearbyItems.length > 0 && <NearbyCarousel items={nearbyItems} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20">
            <WeatherWidget
              aemetId={beach.aemetId}
              coordinates={beach.coordinates}
            />

            <BeachStatusWidget
              beachName={beach.name}
              municipalityName={municipality.name}
            />

            <PracticalInfoCard
              accessDifficulty={beach.accessDifficulty}
              bestSeason={beach.bestSeason}
              childSafe={beach.childSafe}
              length={beach.length}
              naturalShade={beach.naturalShade}
              occupancyLevel={beach.occupancyLevel}
              orientation={beach.orientation}
              soilType={beach.soilType}
              waterQuality={beach.waterQuality}
              waves={beach.waves}
            />

            <ContactInfo
              email={beach.email}
              instagramHashtag={beach.instagramHashtag}
              phone={beach.phone}
              realUrl={beach.realUrl}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getStaticPaths() {
  const { getAllBeaches } = await import('@/lib/db-data')
  const beaches = await getAllBeaches()
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
