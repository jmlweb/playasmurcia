import type { RefObject } from 'react'

import { Link } from '@tanstack/react-router'

import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'
import type { Beach, Municipality, Tag } from '@/types/beach'

import { BeachCard } from '@/features/beaches/beach-card'
import { latestWeatherTime } from '@/lib/coast-today'

import { FeaturedBeachCard } from './featured-beach-card'

type FeaturedSectionProps = {
  ref: RefObject<HTMLElement | null>
  featured: Beach[]
  municipalities: Municipality[]
  tags: Tag[]
  slugMap: Map<string, string>
  weatherData: Record<string, CardWeather>
  flagData: Record<string, BeachFlag>
  isFlagPending: boolean
}

export function FeaturedSection({
  ref,
  featured,
  municipalities,
  tags,
  slugMap,
  weatherData,
  flagData,
  isFlagPending,
}: FeaturedSectionProps) {
  const lead = featured.at(0)
  const rest = featured.slice(1)
  const weatherPoints = Object.values(weatherData)
  const weatherTime = latestWeatherTime(weatherPoints)

  return (
    <section
      ref={ref}
      className="reveal mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pb-20"
    >
      <div className="mb-8">
        <div>
          <p className="overline-accent mb-2 text-sm font-semibold tracking-wider text-ocean-600 uppercase">
            Selección destacada
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Por dónde empezar
          </h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Seis playas elegidas a mano como primera muestra de la costa, no un
            ranking.
          </p>
          <p className="mt-1 min-h-5 text-[13px] text-gray-600 tabular-nums">
            {weatherPoints.length > 0 &&
              `Tiempo: Open-Meteo${weatherTime ? ` · ${weatherTime}` : ''}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {lead && (
          <FeaturedBeachCard
            beach={lead}
            flag={flagData[lead.code]}
            isFlagPending={isFlagPending}
            municipality={municipalities[lead.municipality]}
            slug={slugMap.get(lead.code) ?? lead.code}
            weather={weatherData[lead.code]}
          />
        )}
        {rest.map((beach, i) => (
          <BeachCard
            key={beach.code}
            beach={beach}
            eager={i < 2}
            flag={flagData[beach.code]}
            municipality={municipalities[beach.municipality]}
            slug={slugMap.get(beach.code) ?? beach.code}
            tags={tags}
            weather={weatherData[beach.code]}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-ocean-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-ocean-600 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
      </div>
    </section>
  )
}
