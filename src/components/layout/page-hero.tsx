import type { ReactNode } from 'react'

type PageHeroProps = {
  children: ReactNode
  /** Original raster path, e.g. "/pictures/hero.png" */
  backgroundImage?: string
  backgroundAlt?: string
  /** Base name inside optimized/, e.g. "hero-municipios" */
  optimizedName?: string
}

const useOptimized = import.meta.env.PLAYASMURCIA_OPTIMIZED_IMAGES === 'true'

function HeroImage({
  src,
  alt,
  optimizedName,
}: {
  src: string
  alt: string
  optimizedName?: string
}) {
  const imgClass = 'absolute inset-0 h-full w-full object-cover'
  const opt = optimizedName ? `/pictures/optimized/${optimizedName}` : undefined

  if (opt && useOptimized) {
    return (
      <picture style={{ display: 'contents' }}>
        <source
          srcSet={`${opt}-full.avif 1200w, ${opt}.avif 2752w`}
          type="image/avif"
        />
        <source
          srcSet={`${opt}-full.webp 1200w, ${opt}.webp 2752w`}
          type="image/webp"
        />
        <img alt={alt} className={imgClass} src={src} />
      </picture>
    )
  }

  return <img alt={alt} className={imgClass} src={src} />
}

export function PageHero({
  children,
  backgroundImage,
  backgroundAlt,
  optimizedName,
}: PageHeroProps) {
  return (
    <section className="bg-ocean-800 relative overflow-hidden px-4 py-20 sm:py-24 lg:py-28">
      {backgroundImage ? (
        <>
          <HeroImage
            alt={backgroundAlt ?? ''}
            optimizedName={optimizedName}
            src={backgroundImage}
          />
          <div className="from-ocean-900/60 via-ocean-900/50 to-ocean-900/80 absolute inset-0 bg-gradient-to-b" />
        </>
      ) : (
        <>
          <div className="from-ocean-900 via-ocean-800 to-ocean-700 absolute inset-0 bg-linear-to-br" />
          <div className="absolute inset-0 opacity-20">
            <div className="bg-ocean-400 absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl" />
          </div>
        </>
      )}
      <div
        className={
          backgroundImage
            ? 'hero-text-scrim relative z-10 mx-auto max-w-3xl px-6 py-10 text-center sm:px-8 sm:py-12'
            : 'relative mx-auto max-w-3xl text-center'
        }
      >
        {children}
      </div>
    </section>
  )
}
