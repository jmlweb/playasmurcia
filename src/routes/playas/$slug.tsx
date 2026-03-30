import {
  createFileRoute,
  type ErrorComponentProps,
  Link,
  notFound,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState } from 'react'

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

const fetchBeachData = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => {
    if (typeof data.slug !== 'string' || !data.slug.trim()) {
      throw new Error('Invalid slug')
    }
    return { slug: data.slug.trim() }
  })
  .handler(async ({ data }) => {
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
    const beach = await getBeachBySlug(data.slug)
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
  })

function BeachErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <main className="bg-sand-50 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-ocean-200 mb-3 text-7xl font-extrabold">!</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        No pudimos cargar esta playa
      </h1>
      <p className="mb-8 text-gray-500">
        Ha ocurrido un error al cargar la información. Puedes intentarlo de
        nuevo o explorar otras playas.
      </p>
      <div className="flex gap-3">
        <button
          className="bg-ocean-600 hover:bg-ocean-700 focus-visible:ring-ocean-500 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={reset}
        >
          Reintentar
        </button>
        <Link
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Ver todas las playas
        </Link>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/playas/$slug')({
  loader: async ({ params }) => {
    const data = await fetchBeachData({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  errorComponent: BeachErrorComponent,
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
        <section className="relative h-72 overflow-hidden sm:h-96 lg:h-[32rem]">
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
            <h1 className="max-w-3xl text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl">
              {beach.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">{municipality.name}</p>
            {beach.tags && beach.tags.length > 0 && (
              <div className="mt-3">
                <TagsSection
                  allTags={tags}
                  tagIndices={beach.tags}
                  variant="dark"
                />
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-ocean-700 relative py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="max-w-3xl text-3xl font-normal tracking-tight text-white sm:text-4xl">
              {beach.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">{municipality.name}</p>
            {beach.tags && beach.tags.length > 0 && (
              <div className="mt-3">
                <TagsSection
                  allTags={tags}
                  tagIndices={beach.tags}
                  variant="dark"
                />
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
            <BeachGallery
              beachName={beach.name}
              pictures={heroImage ? pictures.slice(1) : pictures}
            />
          </div>
        ) : pictures.length === 1 && !heroImage ? (
          <div className="mt-6 mb-8">
            <PhotoGallery beachName={beach.name} pictures={pictures} />
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Description — order 1 on mobile, col-span-2 row 1 on desktop */}
          <section className="order-1 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm lg:col-span-2 lg:row-start-1">
            <p className="leading-relaxed text-gray-700">{beach.description}</p>
            {beach.certifications && beach.certifications.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <CertificationsBadge certifications={beach.certifications} />
              </div>
            )}
          </section>

          {/* Sidebar — order 2 on mobile (after description, before services), spans both rows on desktop */}
          <div className="order-2 space-y-6 lg:sticky lg:top-20 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-start">
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
          </div>

          {/* Remaining main content — order 3 on mobile, col-span-2 row 2 on desktop */}
          <div className="order-3 space-y-8 lg:col-span-2 lg:row-start-2">
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
                  Cómo llegar
                </h2>
                <p className="leading-relaxed text-gray-600">{beach.access}</p>
              </section>
            )}

            {/* Map + Contact */}
            <LocationMap
              beachName={beach.name}
              coordinates={beach.coordinates}
            />

            <ContactInfo
              email={beach.email}
              instagramHashtag={beach.instagramHashtag}
              phone={beach.phone}
              realUrl={beach.realUrl}
            />

            {/* Nearby beaches */}
            {nearbyItems.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <NearbyCarousel items={nearbyItems} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

type LightboxImage = { baseName: string; ext: string; alt: string }

function BeachGallery({
  beachName,
  pictures,
}: {
  beachName: string
  pictures: string[]
}) {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (lightbox) {
      el.showModal()
    } else {
      el.close()
    }
  }, [lightbox])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handleClose = () => {
      setLightbox(null)
    }
    el.addEventListener('close', handleClose)
    return () => {
      el.removeEventListener('close', handleClose)
    }
  }, [])

  const openLightbox = (img: LightboxImage) => {
    setLightbox(img)
  }
  const closeLightbox = () => {
    setLightbox(null)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) closeLightbox()
  }

  if (pictures.length === 1) {
    const { baseName, ext } = parseImageFilename(pictures[0])
    return (
      <>
        <button
          aria-label={`Ver foto de ${beachName} en grande`}
          className="focus-visible:ring-ocean-500 aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={() => {
            openLightbox({ baseName, ext, alt: beachName })
          }}
        >
          <ResponsiveImage
            alt={beachName}
            baseName={baseName}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
            ext={ext}
            variant="full"
          />
        </button>
        <Lightbox
          dialogRef={dialogRef}
          image={lightbox}
          onBackdropClick={handleBackdropClick}
          onClose={closeLightbox}
        />
      </>
    )
  }

  const galleryPics = pictures.slice(0, 3)
  const [first, second, third] = galleryPics.map((p) => parseImageFilename(p))

  return (
    <>
      {/* Desktop: grid layout */}
      <div className="hidden gap-3 md:grid md:grid-cols-3">
        <button
          aria-label={`Ver foto principal de ${beachName} en grande`}
          className="focus-visible:ring-ocean-500 col-span-2 aspect-[16/9] cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={() => {
            openLightbox({
              alt: `${beachName} - foto principal`,
              baseName: first.baseName,
              ext: first.ext,
            })
          }}
        >
          <ResponsiveImage
            alt={`${beachName} - foto principal`}
            baseName={first.baseName}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
            ext={first.ext}
            variant="full"
          />
        </button>
        <div className="flex flex-col gap-3">
          {second && (
            <button
              aria-label={`Ver foto 2 de ${beachName} en grande`}
              className="focus-visible:ring-ocean-500 aspect-[4/3] flex-1 cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              type="button"
              onClick={() => {
                openLightbox({
                  alt: `${beachName} - foto 2`,
                  baseName: second.baseName,
                  ext: second.ext,
                })
              }}
            >
              <ResponsiveImage
                alt={`${beachName} - foto 2`}
                baseName={second.baseName}
                className="h-full w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
                ext={second.ext}
                variant="full"
              />
            </button>
          )}
          {third && (
            <button
              aria-label={`Ver foto 3 de ${beachName} en grande`}
              className="focus-visible:ring-ocean-500 aspect-[4/3] flex-1 cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              type="button"
              onClick={() => {
                openLightbox({
                  alt: `${beachName} - foto 3`,
                  baseName: third.baseName,
                  ext: third.ext,
                })
              }}
            >
              <ResponsiveImage
                alt={`${beachName} - foto 3`}
                baseName={third.baseName}
                className="h-full w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
                ext={third.ext}
                variant="full"
              />
            </button>
          )}
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:hidden">
        {pictures.map((pic, i) => {
          const { baseName, ext } = parseImageFilename(pic)
          return (
            <button
              key={pic}
              aria-label={`Ver foto ${i + 1} de ${beachName} en grande`}
              className="focus-visible:ring-ocean-500 aspect-[4/3] w-72 flex-shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              type="button"
              onClick={() => {
                openLightbox({
                  alt: `${beachName} - foto ${i + 1}`,
                  baseName,
                  ext,
                })
              }}
            >
              <ResponsiveImage
                alt={`${beachName} - foto ${i + 1}`}
                baseName={baseName}
                className="h-full w-full object-cover"
                ext={ext}
                variant="thumb"
              />
            </button>
          )
        })}
      </div>

      {/* If more than 3 photos, show remaining count */}
      {pictures.length > 3 && (
        <p className="mt-2 hidden text-sm text-gray-500 md:block">
          +{pictures.length - 3} fotos más en la galería
        </p>
      )}

      <Lightbox
        dialogRef={dialogRef}
        image={lightbox}
        onBackdropClick={handleBackdropClick}
        onClose={closeLightbox}
      />
    </>
  )
}

function Lightbox({
  dialogRef,
  image,
  onClose,
  onBackdropClick,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  image: LightboxImage | null
  onClose: () => void
  onBackdropClick: (e: React.MouseEvent<HTMLDialogElement>) => void
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-label="Visor de imagen"
      className="m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-black/90 p-0 backdrop:bg-black/70 open:flex open:items-center open:justify-center"
      onClick={onBackdropClick}
    >
      {image && (
        <div className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
          <button
            aria-label="Cerrar visor"
            className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            type="button"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
          <ResponsiveImage
            alt={image.alt}
            baseName={image.baseName}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            ext={image.ext}
            variant="full"
          />
        </div>
      )}
    </dialog>
  )
}

export async function getStaticPaths() {
  const { getAllBeaches } = await import('@/lib/db-data')
  const beaches = await getAllBeaches()
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
