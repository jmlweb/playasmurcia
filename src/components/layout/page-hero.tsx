import type { ReactNode } from 'react'

import { pictureUrl } from '@/lib/images'

type PageHeroProps = {
  children: ReactNode
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
  'motion-safe:animate-ken-burns absolute inset-0 h-full w-full object-cover'

function HeroImage({
  src,
  alt,
  optimizedName,
  optimizedMaxWidth = 2752,
  imageWidth,
  imageHeight,
}: {
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
          className={photoHeroImgClass}
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
      className={photoHeroImgClass}
      fetchPriority="high"
      src={src}
      {...imgDims}
    />
  )
}

export function PageHero({
  children,
  backgroundImage,
  backgroundAlt,
  optimizedName,
  optimizedMaxWidth,
  imageWidth,
  imageHeight,
}: PageHeroProps) {
  const sectionClass = backgroundImage
    ? 'hero-noise bg-ocean-900 relative overflow-hidden px-4 py-10 sm:py-14 lg:py-20'
    : 'bg-ocean-800 relative overflow-hidden px-4 py-12 sm:py-14 lg:py-16'

  return (
    <section className={sectionClass}>
      {backgroundImage ? (
        <>
          <HeroImage
            alt={backgroundAlt ?? ''}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            optimizedMaxWidth={optimizedMaxWidth}
            optimizedName={optimizedName}
            src={backgroundImage}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-ocean-900/30 to-ocean-900/80" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full bg-ocean-400 blur-3xl" />
          </div>
        </>
      )}
      <div
        className={
          backgroundImage
            ? 'hero-text-scrim relative z-10 mx-auto max-w-4xl px-6 py-10 text-center sm:px-8 sm:py-12'
            : 'relative mx-auto max-w-3xl text-center'
        }
      >
        {children}
      </div>
    </section>
  )
}
