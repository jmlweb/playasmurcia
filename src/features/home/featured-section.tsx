import type { RefObject } from 'react'

import { Link } from '@tanstack/react-router'

import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'
import type { Beach, Municipality, Tag } from '@/types/beach'

import { BeachCard } from '@/features/beaches/beach-card'

type FeaturedSectionProps = {
  ref: RefObject<HTMLElement | null>
  featured: Beach[]
  municipalities: Municipality[]
  tags: Tag[]
  slugMap: Map<string, string>
  weatherData: Record<string, CardWeather>
  flagData: Record<string, BeachFlag>
  totalBeaches: number
}

export function FeaturedSection({
  ref,
  featured,
  municipalities,
  tags,
  slugMap,
  weatherData,
  flagData,
  totalBeaches,
}: FeaturedSectionProps) {
  return (
    <section
      ref={ref}
      className="reveal mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
    >
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="overline-accent mb-2 text-sm font-semibold tracking-wider text-ocean-600 uppercase">
            Selección destacada
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Playas que no te puedes perder
          </h2>
        </div>
        <Link
          className="hidden text-sm font-medium text-ocean-600 hover:text-ocean-700 sm:block"
          to="/explorar"
        >
          Ver todas las playas →
        </Link>
      </div>

      <div className="grid gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {featured.map((beach, i) => {
          const slug = slugMap.get(beach.code) ?? beach.code
          return (
            <BeachCard
              key={beach.code}
              beach={beach}
              eager={i < 4}
              flag={flagData[beach.code]}
              municipality={municipalities[beach.municipality]}
              slug={slug}
              tags={tags}
              weather={weatherData[beach.code]}
            />
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-ocean-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-ocean-600 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/explorar"
        >
          Ver las {totalBeaches} playas
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
      </div>
    </section>
  )
}
