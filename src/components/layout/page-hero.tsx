import type { ReactNode } from 'react'

import type { BreadcrumbItem } from '@/components/layout/breadcrumb'

import { Breadcrumb } from '@/components/layout/breadcrumb'
import { pictureUrl } from '@/lib/images'

type HeroTone = 'default' | 'soft' | 'lifted'

const imageToneClass = {
  default: 'contrast-125',
  soft: 'brightness-125 contrast-115',
  lifted: 'brightness-150 contrast-110',
} as const

const tintToneClass = {
  default: 'bg-ocean-400',
  soft: 'bg-ocean-400',
  lifted: 'bg-ocean-300',
} as const

const scrimToneClass = {
  default: 'from-ocean-950/85 via-ocean-950/45 via-55%',
  soft: 'from-ocean-950/82 via-ocean-950/38 via-52%',
  lifted: 'from-ocean-950/80 via-ocean-950/30 via-50%',
} as const

type PageHeroProps = {
  children: ReactNode
  /** Rendered inside the hero, above the title block */
  breadcrumb?: BreadcrumbItem[]
  /** Duotone strength: `soft` and `lifted` brighten photos that are too dark under `default` */
  tone?: HeroTone
  /** `home` is taller than the listing/detail heroes */
  size?: 'home' | 'listing'
  /** Original raster URL, e.g. `pictureUrl('hero.png')` */
  backgroundImage?: string
  backgroundAlt?: string
  /** Base name inside optimized/, e.g. "hero-municipios" */
  optimizedName?: string
  /** Width descriptor (w) for the full optimized asset in srcset; default 2752 */
  optimizedMaxWidth?: number
  /** Intrinsic size hints for the fallback img (CLS) */
  imageWidth?: number
  imageHeight?: number
}

const useOptimized = import.meta.env.PLAYASMURCIA_OPTIMIZED_IMAGES

const photoHeroImgClass =
  'motion-safe:animate-ken-burns absolute inset-0 h-full w-full object-cover grayscale'

function HeroImage({
  tone,
  src,
  alt,
  optimizedName,
  optimizedMaxWidth = 2752,
  imageWidth,
  imageHeight,
}: {
  tone: HeroTone
  src: string
  alt: string
  optimizedName?: string
  optimizedMaxWidth?: number
  imageWidth?: number
  imageHeight?: number
}) {
  const opt = optimizedName
    ? pictureUrl(`optimized/${optimizedName}`)
    : undefined
  const imgDims =
    imageWidth !== undefined && imageHeight !== undefined
      ? { height: imageHeight, width: imageWidth }
      : {}

  if (opt && useOptimized) {
    return (
      <picture style={{ display: 'contents' }}>
        <source
          srcSet={`${opt}-full.avif 1200w, ${opt}.avif ${optimizedMaxWidth}w`}
          type="image/avif"
        />
        <source
          srcSet={`${opt}-full.webp 1200w, ${opt}.webp ${optimizedMaxWidth}w`}
          type="image/webp"
        />
        <img
          alt={alt}
          className={`${photoHeroImgClass} ${imageToneClass[tone]}`}
          fetchPriority="high"
          src={src}
          {...imgDims}
        />
      </picture>
    )
  }

  return (
    <img
      alt={alt}
      className={`${photoHeroImgClass} ${imageToneClass[tone]}`}
      fetchPriority="high"
      src={src}
      {...imgDims}
    />
  )
}

export function PageHero({
  children,
  breadcrumb,
  tone = 'default',
  size = 'listing',
  backgroundImage,
  backgroundAlt,
  optimizedName,
  optimizedMaxWidth,
  imageWidth,
  imageHeight,
}: PageHeroProps) {
  const heightClass =
    size === 'home' ? 'min-h-[min(72vh,640px)]' : 'min-h-[420px]'

  return (
    <section
      className={`${heightClass} hero-noise relative flex items-end overflow-hidden bg-ocean-900`}
    >
      {backgroundImage ? (
        <>
          <HeroImage
            alt={backgroundAlt ?? ''}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            optimizedMaxWidth={optimizedMaxWidth}
            optimizedName={optimizedName}
            src={backgroundImage}
            tone={tone}
          />
          {/* Duotone: grayscale photo tinted ocean, so any photo reads as the same dark teal and white text always passes contrast. Detail is traded for legibility on purpose. */}
          <div
            className={`absolute inset-0 mix-blend-multiply ${tintToneClass[tone]}`}
          />
          <div
            className={`absolute inset-0 bg-linear-to-t ${scrimToneClass[tone]} to-transparent`}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
          </div>
        </>
      )}
      {/* Wide low-opacity halo plus a tight one: smooth legibility lift without a crisp outline. Form controls opt out because they sit on light backgrounds. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 [text-shadow:0_0_28px_rgb(8_41_53/0.6),0_0_8px_rgb(8_41_53/0.35)] sm:px-6 lg:px-8 lg:py-12 [&_button]:[text-shadow:none] [&_input]:[text-shadow:none]">
        {breadcrumb ? <Breadcrumb items={breadcrumb} tone="onPhoto" /> : null}
        {children}
      </div>
    </section>
  )
}
