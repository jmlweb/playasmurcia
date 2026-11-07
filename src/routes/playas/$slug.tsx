import {
  createFileRoute,
  type ErrorComponentProps,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState } from 'react'

import { NotFound } from '@/components/layout/not-found'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { ActivitiesGrid } from '@/features/beaches/activities-grid'
import { BeachConditions } from '@/features/beaches/beach-conditions'
import { BeachDecisionRail } from '@/features/beaches/beach-decision-rail'
import { BeachHero } from '@/features/beaches/beach-hero'
import { BeachRichText } from '@/features/beaches/beach-rich-text'
import { CertificationsBadge } from '@/features/beaches/certifications-badge'
import { ContactInfo } from '@/features/beaches/contact-info'
import { LocationMap } from '@/features/beaches/location-map'
import { NearbyCarousel } from '@/features/beaches/nearby-carousel'
import { PracticalInfoCard } from '@/features/beaches/practical-info-card'
import { ServicesGrid } from '@/features/beaches/services-grid'
import { TagsSection } from '@/features/beaches/tags-section'
import { MAR_MENOR_SEA } from '@/lib/beach-facts'
import { getBeachSummary } from '@/lib/beach-summary'
import { canonicalLink, ogUrlMeta } from '@/lib/canonical'
import { parseImageFilename, pictureUrl } from '@/lib/images'
import { generateBeachSchema } from '@/lib/schema'
import { beachToSlug, municipalityToSlug } from '@/lib/slugs'

const SWIPE_THRESHOLD_PX = 48

const fetchRenamedBeachSlug = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => ({ slug: data.slug.trim() }))
  .handler(async ({ data }) => {
    const { getRenamedBeachSlug } = await import('@/lib/db-data/beach-queries')
    return (await getRenamedBeachSlug(data.slug)) ?? null
  })

const fetchBeachData = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => {
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
    } = await import('@/lib/db-data/beach-queries')
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-4 text-center">
      <p className="mb-3 text-7xl font-extrabold text-ocean-200">!</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        No pudimos cargar esta playa
      </h1>
      <p className="mb-8 text-gray-500">
        Ha ocurrido un error al cargar la información. Puedes intentarlo de
        nuevo o explorar otras playas.
      </p>
      <div className="flex gap-3">
        <button
          className="rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={reset}
        >
          Reintentar
        </button>
        <Link
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Todas las playas
        </Link>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/playas/$slug')({
  notFoundComponent: NotFound,
  loader: async ({ params }) => {
    const data = await fetchBeachData({ data: { slug: params.slug } })
    if (!data) {
      const renamed = await fetchRenamedBeachSlug({
        data: { slug: params.slug },
      })
      if (renamed) {
        throw redirect({
          to: '/playas/$slug',
          params: { slug: renamed },
          statusCode: 301,
        })
      }
      throw notFound()
    }
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
    const description = getBeachSummary(beach.name, beach.description)
    const ogImage = beach.pictures?.[0]
      ? pictureUrl(
          `${parseImageFilename(beach.pictures[0]).baseName}.${parseImageFilename(beach.pictures[0]).ext}`,
        )
      : pictureUrl('hero.png')

    return {
      meta: [
        { title: `${beach.name} - Playas de Murcia` },
        { name: 'description', content: description },
        ...(beach.seoKeywords
          ? [{ name: 'keywords', content: beach.seoKeywords.join(', ') }]
          : []),
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${beach.name} - Playas de Murcia` },
        { property: 'og:description', content: description },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${beach.name} - Playas de Murcia` },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
        ogUrlMeta(`/playas/${slug}`),
      ],
      links: [canonicalLink(`/playas/${slug}`)],
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
    <main className="min-h-screen bg-sand-50">
      <BeachHero
        breadcrumb={[
          { label: 'Inicio', href: '/' },
          {
            label: municipality.name,
            href: `/municipios/${municipalityToSlug(municipality)}`,
          },
          { label: beach.name },
        ]}
        conditions={
          <BeachConditions
            key={beach.code}
            beachCode={beach.code}
            hasOpenSeaWaves={beach.sea !== MAR_MENOR_SEA}
          />
        }
        municipalityName={municipality.name}
        name={beach.name}
        picture={pictures[0]}
        tags={
          beach.tags && beach.tags.length > 0 ? (
            <TagsSection
              allTags={tags}
              tagIndices={beach.tags}
              variant="dark"
            />
          ) : undefined
        }
        zone={beach.zone}
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Today's decision first: above the description on phones, pinned beside it on desktop */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:col-start-3 lg:row-start-1 lg:self-start">
            <BeachDecisionRail
              beachCode={beach.code}
              beachName={beach.name}
              coordinates={beach.coordinates}
              hasNearbyBeaches={nearbyItems.length > 0}
              lifeguard={beach.lifeguard}
              municipalityName={municipality.name}
            />
          </div>

          <div className="min-w-0 divide-y divide-gray-200 lg:col-span-2 lg:row-start-1 [&>*]:py-12 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
            <section>
              <BeachRichText text={beach.description} />
              {beach.certifications && beach.certifications.length > 0 && (
                <div className="mt-8">
                  <CertificationsBadge certifications={beach.certifications} />
                </div>
              )}
            </section>

            <PracticalInfoCard
              accessDifficulty={beach.accessDifficulty}
              bestSeason={beach.bestSeason}
              childSafe={beach.childSafe}
              dogFriendly={beach.dogFriendly}
              length={beach.length}
              lifeguard={beach.lifeguard}
              naturalShade={beach.naturalShade}
              occupancyLevel={beach.occupancyLevel}
              orientation={beach.orientation}
              soilType={beach.soilType}
              waterQuality={beach.waterQuality}
              waterQualitySource={beach.waterQualitySource}
              waves={beach.waves}
            />

            {pictures.length > 1 && (
              <div>
                <BeachGallery beachName={beach.name} pictures={pictures} />
              </div>
            )}

            {beach.services.length > 0 && (
              <div>
                <ServicesGrid
                  allServices={services}
                  serviceIndices={beach.services}
                />
              </div>
            )}

            {beach.activities.length > 0 && (
              <div>
                <ActivitiesGrid
                  activityIndices={beach.activities}
                  allActivities={activities}
                />
              </div>
            )}

            {beach.access && (
              <section>
                <h2 className="mb-3 text-3xl font-normal tracking-tight text-gray-900">
                  Cómo llegar
                </h2>
                <BeachRichText text={beach.access} variant="body" />
              </section>
            )}

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
          </div>
        </div>

        {nearbyItems.length > 0 && (
          <div className="mt-12 border-t border-gray-200/60 pt-8">
            <NearbyCarousel currentBeach={beach} items={nearbyItems} />
          </div>
        )}
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
  const parsedPictures = pictures.map((p, i) => ({
    ...parseImageFilename(p),
    alt: `${beachName}, foto ${i + 1} de ${pictures.length}`,
  }))

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (lightboxIndex !== null) {
      el.showModal()
    } else {
      el.close()
    }
  }, [lightboxIndex])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handleClose = () => {
      setLightboxIndex(null)
    }
    el.addEventListener('close', handleClose)
    return () => {
      el.removeEventListener('close', handleClose)
    }
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) =>
          i !== null && i < parsedPictures.length - 1 ? i + 1 : i,
        )
      }
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [lightboxIndex, parsedPictures.length])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }
  const closeLightbox = () => {
    setLightboxIndex(null)
  }
  const handlePrev = () => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
  }
  const handleNext = () => {
    setLightboxIndex((i) =>
      i !== null && i < parsedPictures.length - 1 ? i + 1 : i,
    )
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) closeLightbox()
  }

  // Photo 1 is already the page hero, so the mosaic starts at photo 2.
  const stacked = parsedPictures.slice(2, 4)

  const mosaicButton = (index: number) => {
    const img = parsedPictures[index]
    return (
      <button
        key={img.baseName}
        aria-label={`Ver ${img.alt} en grande`}
        className="h-full w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        type="button"
        onClick={() => {
          openLightbox(index)
        }}
      >
        <ResponsiveImage
          alt={img.alt}
          baseName={img.baseName}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
          ext={img.ext}
          variant="full"
        />
      </button>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-normal tracking-tight text-gray-900">
          Fotos
        </h2>
        <button
          className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-ocean-200 px-4 text-sm font-semibold text-ocean-600 transition-colors hover:bg-ocean-50 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={() => {
            openLightbox(0)
          }}
        >
          Ver las {parsedPictures.length} fotos
        </button>
      </div>
      <div
        className={`grid aspect-[16/10] gap-2 sm:aspect-auto sm:h-80 sm:gap-3 ${stacked.length > 0 ? 'grid-cols-[2fr_1fr]' : ''}`}
      >
        {mosaicButton(1)}
        {stacked.length > 0 && (
          <div className="grid min-h-0 grid-rows-2 gap-2 sm:gap-3">
            {stacked.map((_, i) => mosaicButton(i + 2))}
          </div>
        )}
      </div>

      <Lightbox
        currentIndex={lightboxIndex}
        dialogRef={dialogRef}
        images={parsedPictures}
        onBackdropClick={handleBackdropClick}
        onClose={closeLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  )
}

function Lightbox({
  dialogRef,
  images,
  currentIndex,
  onClose,
  onBackdropClick,
  onPrev,
  onNext,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  images: { baseName: string; ext: string; alt: string }[]
  currentIndex: number | null
  onClose: () => void
  onBackdropClick: (e: React.MouseEvent<HTMLDialogElement>) => void
  onPrev: () => void
  onNext: () => void
}) {
  const image = currentIndex !== null ? images[currentIndex] : null
  const swipeStartX = useRef<number | null>(null)

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = swipeStartX.current
    swipeStartX.current = null
    if (startX === null) return
    const distance = e.changedTouches[0].clientX - startX
    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return
    if (distance > 0) onPrev()
    else onNext()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={
        currentIndex !== null
          ? `Imagen ${currentIndex + 1} de ${images.length}`
          : 'Visor de imagen'
      }
      className="m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-black/90 p-0 backdrop:bg-black/70 open:flex open:items-center open:justify-center"
      onClick={onBackdropClick}
    >
      {image && (
        <div
          className="relative flex h-full w-full items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          onTouchEnd={handleTouchEnd}
          onTouchStart={(e) => {
            swipeStartX.current = e.touches[0].clientX
          }}
        >
          {/* Close */}
          <button
            aria-label="Cerrar visor"
            className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
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

          {/* Previous */}
          {currentIndex !== null && currentIndex > 0 && (
            <button
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              type="button"
              onClick={onPrev}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          )}

          {/* Next */}
          {currentIndex !== null && currentIndex < images.length - 1 && (
            <button
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              type="button"
              onClick={onNext}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && currentIndex !== null && (
            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {currentIndex + 1} / {images.length}
            </div>
          )}

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
  const { getAllBeaches } = await import('@/lib/db-data/beach-queries')
  const beaches = await getAllBeaches()
  return beaches.map((beach) => ({
    params: { slug: beachToSlug(beach) },
  }))
}
