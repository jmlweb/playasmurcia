import type { ReactNode } from 'react'

type PageHeroProps = {
  children: ReactNode
  backgroundImage?: string
  backgroundAlt?: string
}

export function PageHero({
  children,
  backgroundImage,
  backgroundAlt,
}: PageHeroProps) {
  return (
    <section className="bg-ocean-800 relative overflow-hidden px-4 py-20 sm:py-24 lg:py-28">
      {backgroundImage ? (
        <>
          <img
            alt={backgroundAlt ?? ''}
            className="absolute inset-0 h-full w-full object-cover"
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
      <div className="relative mx-auto max-w-3xl text-center">{children}</div>
    </section>
  )
}
