import { useMemo } from 'react'

import type { Beach, Municipality } from '@/types/beach'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import { parseImageFilename } from '@/lib/images'

import { FlagPill, WeatherPill } from './card-pills'
import { useCardFlags } from './use-card-flags'
import { useCardWeather } from './use-card-weather'

type NearbyBeachItem = {
  beach: Beach
  municipality: Municipality
  slug: string
}

type NearbyCarouselProps = {
  items: NearbyBeachItem[]
}

// Class names stay literal so Tailwind can detect them. The fade hints that
// the row scrolls, so on desktop it is only applied when more than 4 cards overflow.
const FADE_ALWAYS =
  'pr-12 [mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)]'
const FADE_MOBILE_ONLY =
  'pr-12 max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] lg:pr-0'

export function NearbyCarousel({ items }: NearbyCarouselProps) {
  const beaches = useMemo(() => items.map(({ beach }) => beach), [items])
  const weather = useCardWeather(beaches)
  const flags = useCardFlags(beaches)

  if (items.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Playas cercanas"
      className="scroll-mt-20"
      id="playas-cercanas"
    >
      <h2 className="mb-4 text-3xl font-normal tracking-tight text-gray-900">
        Playas cercanas
      </h2>
      <div
        className={`scrollbar-hide flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto pb-3 ${items.length > 4 ? FADE_ALWAYS : FADE_MOBILE_ONLY}`}
      >
        {items.map(({ beach, municipality, slug }) => {
          const firstPicture = beach.pictures?.[0]
          const hasPicture = Boolean(firstPicture)
          const { baseName, ext } = parseImageFilename(
            firstPicture ?? 'default-beach.png',
          )

          return (
            <a
              key={beach.code}
              aria-label={`Ver playa ${beach.name}`}
              className="group flex w-48 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-md hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 sm:w-56 lg:w-[calc((100%-3rem)/4)]"
              href={`/playas/${slug}`}
            >
              <div className="relative h-32 overflow-hidden bg-gray-100">
                {hasPicture ? (
                  <ResponsiveImage
                    alt={beach.name}
                    baseName={baseName}
                    className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                    ext={ext}
                    variant="thumb"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-ocean-700 to-ocean-900">
                    <svg
                      aria-hidden="true"
                      className="h-8 w-8 text-ocean-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 15c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                      />
                      <path
                        d="M3 19c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                      />
                    </svg>
                  </div>
                )}
                {weather[beach.code] && (
                  <WeatherPill
                    className="absolute top-2 left-2"
                    showWindGlyph={false}
                    weather={weather[beach.code]}
                  />
                )}
                {flags[beach.code] && (
                  <FlagPill
                    className="absolute bottom-2 left-2"
                    flag={flags[beach.code]}
                  />
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-ocean-600">
                  {beach.name}
                </p>
                <p className="text-xs text-gray-500">{municipality.name}</p>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
