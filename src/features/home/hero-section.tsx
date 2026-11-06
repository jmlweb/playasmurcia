import { Link } from '@tanstack/react-router'

import { PageHero } from '@/components/layout/page-hero'
import { pictureUrl } from '@/lib/images'

export function HeroSection({ totalBeaches }: { totalBeaches: number }) {
  return (
    <PageHero
      backgroundAlt="Vista aérea de la costa de Murcia"
      backgroundImage={pictureUrl('hero.png')}
      imageHeight={768}
      imageWidth={1408}
      optimizedMaxWidth={2816}
      optimizedName="hero"
      size="home"
    >
      <p className="animate-fade-up mb-4 text-xs font-semibold tracking-[0.2em] text-white uppercase sm:text-sm">
        Costa Cálida &middot; Región de Murcia
      </p>
      <h1 className="animate-fade-up mb-4 text-4xl font-normal tracking-tight text-balance text-white [animation-delay:75ms] sm:text-5xl lg:text-6xl">
        Playas de la Región de Murcia
      </h1>
      <p className="animate-fade-up mb-6 max-w-2xl text-lg leading-relaxed text-ocean-100 [animation-delay:150ms] sm:mb-8 sm:text-xl">
        <b>252</b> km de litoral y <b>{totalBeaches}</b> playas entre el
        Mediterráneo y el Mar Menor.
      </p>
      <div className="animate-fade-up flex flex-wrap items-center gap-x-5 gap-y-2 [animation-delay:225ms] sm:gap-4">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-ocean-500 px-5 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-ocean-400 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-900 focus-visible:outline-none sm:px-8 sm:py-3.5"
          to="/explorar"
        >
          Todas las playas
          <svg
            aria-hidden="true"
            className="arrow-nudge h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </Link>
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full text-base font-semibold text-white underline underline-offset-4 transition-all hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none sm:border sm:border-white/30 sm:px-8 sm:py-3.5 sm:no-underline sm:backdrop-blur-sm"
          to="/colecciones"
        >
          Ver colecciones
        </Link>
      </div>
    </PageHero>
  )
}
