import type { ReactNode } from 'react'

import type { BreadcrumbItem } from '@/components/layout/breadcrumb'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

type BeachHeroProps = {
  name: string
  municipalityName: string
  breadcrumb: BreadcrumbItem[]
  /** First beach picture; without it the hero falls back to the ocean gradient */
  picture?: string
  /** Tags row rendered under the municipality */
  tags?: ReactNode
}

export function BeachHero({
  name,
  municipalityName,
  breadcrumb,
  picture,
  tags,
}: BeachHeroProps) {
  const image = picture ? parseImageFilename(picture) : null

  return (
    <section className="hero-noise relative flex min-h-[min(60vh,560px)] items-end overflow-hidden bg-ocean-900">
      {image ? (
        <>
          <ResponsiveImage
            alt={`${name} - foto 1`}
            baseName={image.baseName}
            className="absolute inset-0 h-full w-full object-cover"
            ext={image.ext}
            priority="high"
            variant="full"
          />
          {/* Scrim keeps white text legible over any photo, bright sand included */}
          <div className="absolute inset-0 bg-linear-to-t from-ocean-950/85 via-ocean-950/35 via-55% to-ocean-950/10" />
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
        <p className="mt-1 text-lg text-white/90">{municipalityName}</p>
        {tags ? <div className="mt-3">{tags}</div> : null}
      </div>
    </section>
  )
}
