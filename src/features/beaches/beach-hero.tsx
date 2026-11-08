import type { ReactNode } from 'react'

import type { BreadcrumbItem } from '@/components/layout/breadcrumb'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'
import { formatBeachLocation } from '@/lib/zones'

type BeachHeroProps = {
  name: string
  municipalityName: string
  /** Zone id from data/zones.json, shown before the municipality */
  zone?: string
  breadcrumb: BreadcrumbItem[]
  /** Cover picture; without it the hero falls back to the ocean gradient */
  picture?: string
  /** Total pictures of the beach, so the alt numbers the cover as 1 of N like the gallery */
  pictureCount?: number
  /** Live conditions rendered under the location line */
  conditions?: ReactNode
  /** Tags row rendered under the conditions */
  tags?: ReactNode
}

export function BeachHero({
  name,
  municipalityName,
  zone,
  breadcrumb,
  picture,
  pictureCount,
  conditions,
  tags,
}: BeachHeroProps) {
  const image = picture ? parseImageFilename(picture) : null
  // Without a photo a tall hero is empty space, so it collapses to its content
  const heightClass = image
    ? 'min-h-[min(38svh,300px)] sm:min-h-[min(60svh,560px)]'
    : ''

  return (
    <section
      className={`${heightClass} hero-noise relative flex items-end overflow-hidden bg-ocean-900`}
    >
      {image ? (
        <>
          <ResponsiveImage
            alt={`${name}, ${municipalityName}: fotografía 1 de ${String(pictureCount ?? 1)}`}
            baseName={image.baseName}
            className="absolute inset-0 h-full w-full object-cover"
            ext={image.ext}
            // A short phone hero crops wide photos to their height, so width alone undersells them
            fullSizes="(max-width: 640px) 150vw, (max-width: 1024px) 100vw, 1200px"
            priority="high"
            variant="full"
          />
          {/* Scrim keeps white text legible over any photo, bright sand included.
              Measured over production heroes: the breadcrumb needs at least /55 at
              the midpoint on desktop to clear 4.5:1 over bright sand (Bolnuevo). */}
          <div className="absolute inset-0 bg-linear-to-t from-ocean-950/85 via-ocean-950/65 via-65% to-ocean-950/55 sm:via-ocean-950/55 sm:via-55% sm:to-ocean-950/20" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
          </div>
        </>
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 [text-shadow:0_0_32px_rgb(8_41_53/0.8),0_0_10px_rgb(8_41_53/0.5)] sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumb items={breadcrumb} tone="onPhoto" />
        <h1 className="max-w-3xl text-3xl font-normal tracking-tight text-white sm:text-5xl">
          {name}
        </h1>
        <p className="mt-1 text-lg text-white/90">
          {formatBeachLocation(zone, municipalityName)}
        </p>
        {conditions}
        {tags ? <div className="mt-3">{tags}</div> : null}
      </div>
    </section>
  )
}
