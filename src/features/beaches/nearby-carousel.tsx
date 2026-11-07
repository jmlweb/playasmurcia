import { useEffect, useMemo, useRef, useState } from 'react'

import type { Beach, Municipality } from '@/types/beach'

import { lightFocusRing } from '@/components/layout/focus-ring'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { formatDistance, haversineKm } from '@/lib/geo'
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
  currentBeach: Beach
  items: NearbyBeachItem[]
}

type ScrollState = {
  canScrollPrev: boolean
  canScrollNext: boolean
}

// On lg exactly four cards fit the track, so a fifth card is the first to overflow.
const CARDS_PER_DESKTOP_VIEW = 4

// Class names stay literal so Tailwind can detect them. The fade hints that
// the row scrolls, so on desktop it is only applied when more than 4 cards overflow.
const FADE_ALWAYS =
  'pr-12 [mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)]'
const FADE_MOBILE_ONLY =
  'pr-12 max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-3rem),transparent)] lg:pr-0'

function describeDistance(
  currentBeach: Beach,
  beach: Beach,
  municipality: Municipality,
): string {
  const distance = formatDistance(
    haversineKm(currentBeach.coordinates, beach.coordinates),
  )
  if (beach.municipality === currentBeach.municipality || !municipality.name) {
    return `A ${distance}`
  }
  return `${municipality.name} · a ${distance}`
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const NAV_BUTTON_CLASS = `inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-ocean-300 hover:text-ocean-700 aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:border-gray-200 aria-disabled:hover:text-gray-700 ${lightFocusRing}`

export function NearbyCarousel({ currentBeach, items }: NearbyCarouselProps) {
  const beaches = useMemo(() => items.map(({ beach }) => beach), [items])
  const weather = useCardWeather(beaches)
  const flags = useCardFlags(beaches)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState<ScrollState>({
    canScrollPrev: false,
    canScrollNext: true,
  })
  const hasDesktopOverflow = items.length > CARDS_PER_DESKTOP_VIEW

  useEffect(() => {
    const track = trackRef.current
    if (!track || !hasDesktopOverflow) return

    const updateScrollState = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth
      setScrollState({
        canScrollPrev: track.scrollLeft > 1,
        canScrollNext: track.scrollLeft < maxScrollLeft - 1,
      })
    }

    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [hasDesktopOverflow, items.length])

  if (items.length === 0) {
    return null
  }

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      aria-label="Playas cercanas"
      className="scroll-mt-20"
      id="playas-cercanas"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-normal tracking-tight text-gray-900">
          Playas cercanas
        </h2>
        {hasDesktopOverflow && (
          <div className="flex gap-2 max-lg:hidden">
            <button
              aria-disabled={!scrollState.canScrollPrev}
              aria-label="Anterior"
              className={NAV_BUTTON_CLASS}
              type="button"
              onClick={() => {
                if (scrollState.canScrollPrev) scrollByPage(-1)
              }}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              aria-disabled={!scrollState.canScrollNext}
              aria-label="Siguiente"
              className={NAV_BUTTON_CLASS}
              type="button"
              onClick={() => {
                if (scrollState.canScrollNext) scrollByPage(1)
              }}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        className={`scrollbar-hide flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto pb-3 ${hasDesktopOverflow ? FADE_ALWAYS : FADE_MOBILE_ONLY}`}
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
                <p className="text-[13px] text-gray-600">
                  {describeDistance(currentBeach, beach, municipality)}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
