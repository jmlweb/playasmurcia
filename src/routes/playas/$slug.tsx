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
import { ResponsiveImage } from '@/components/responsive-image'
import { ServicesGrid } from '@/components/services-grid'
import { TagsSection } from '@/components/tags-section'
import { WeatherWidget } from '@/components/weather-widget'
import { parseImageFilename } from '@/lib/images'
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
  const heroImage = pictures[0] ? parseImageFilename(pictures[0]) : null

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Hero section */}
      {heroImage ? (
        <section className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
          <ResponsiveImage
            alt={beach.name}
            baseName={heroImage.baseName}
            className="absolute inset-0 h-full w-full object-cover"
            ext={heroImage.ext}
            priority="high"
            variant="full"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl">
              {beach.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">
              {municipality.name}
            </p>
            {beach.tags && beach.tags.length > 0 && (
              <div className="mt-3">
                <TagsSection allTags={tags} tagIndices={beach.tags} />
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-ocean-700 relative py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {beach.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">
              {municipality.name}
            </p>
            {beach.tags && beach.tags.length > 0 && (
              <div className="mt-3">
                <TagsSection allTags={tags} tagIndices={beach.tags} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Breadcrumb + Gallery */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
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

        {pictures.length > 1 ? (
          <div className="mt-6 mb-8">
            <BeachGallery beachName={beach.name} pictures={pictures} />
          </div>
        ) : pictures.length === 1 && !heroImage ? (
          <div className="mt-6 mb-8">
            <PhotoGallery beachName={beach.name} pictures={pictures} />
          </div>
        ) : null}

        {beach.certifications && beach.certifications.length > 0 && (
          <div className="mb-8">
            <CertificationsBadge certifications={beach.certifications} />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

function BeachGallery({
  beachName,
  pictures,
}: {
  beachName: string
  pictures: string[]
}) {
  if (pictures.length === 1) {
    const { baseName, ext } = parseImageFilename(pictures[0])
    return (
      <div className="aspect-[16/9] overflow-hidden rounded-2xl">
        <ResponsiveImage
          alt={beachName}
          baseName={baseName}
          className="h-full w-full object-cover"
          ext={ext}
          variant="full"
        />
      </div>
    )
  }

  const galleryPics = pictures.slice(0, 3)
  const [first, second, third] = galleryPics.map((p) => parseImageFilename(p))

  return (
    <>
      {/* Desktop: grid layout */}
      <div className="hidden gap-3 md:grid md:grid-cols-3">
        <div className="col-span-2 overflow-hidden rounded-2xl">
          <ResponsiveImage
            alt={`${beachName} - foto principal`}
            baseName={first.baseName}
            className="h-full w-full object-cover"
            ext={first.ext}
            variant="full"
          />
        </div>
        <div className="flex flex-col gap-3">
          {second && (
            <div className="flex-1 overflow-hidden rounded-2xl">
              <ResponsiveImage
                alt={`${beachName} - foto 2`}
                baseName={second.baseName}
                className="h-full w-full object-cover"
                ext={second.ext}
                variant="full"
              />
            </div>
          )}
          {third && (
            <div className="flex-1 overflow-hidden rounded-2xl">
              <ResponsiveImage
                alt={`${beachName} - foto 3`}
                baseName={third.baseName}
                className="h-full w-full object-cover"
                ext={third.ext}
                variant="full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden">
        {pictures.map((pic, i) => {
          const { baseName, ext } = parseImageFilename(pic)
          return (
            <div
              key={pic}
              className="aspect-[4/3] w-72 flex-shrink-0 snap-start overflow-hidden rounded-2xl"
            >
              <ResponsiveImage
                alt={`${beachName} - foto ${i + 1}`}
                baseName={baseName}
                className="h-full w-full object-cover"
                ext={ext}
                variant="thumb"
              />
            </div>
          )
        })}
      </div>

      {/* If more than 3 photos, show remaining count */}
      {pictures.length > 3 && (
        <p className="mt-2 hidden text-sm text-gray-500 md:block">
          +{pictures.length - 3} fotos mas en la galeria
        </p>
      )}
    </>
  )
}

export async function getStaticPaths() {
  const { getAllBeaches } = await import('@/lib/db-data')
  const beaches = await getAllBeaches()
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
