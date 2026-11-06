import { Link } from '@tanstack/react-router'

import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'
import type { Beach, Municipality } from '@/types/beach'

import { ResponsiveImage } from '@/components/ui/responsive-image'
import {
  beachFactLine,
  FlagPill,
  WeatherPill,
} from '@/features/beaches/card-pills'
import { parseImageFilename } from '@/lib/images'

type FeaturedBeachCardProps = {
  beach: Beach
  municipality: Municipality
  slug: string
  weather?: CardWeather
  flag?: BeachFlag
}

// An editorial "must see" must never sit on a beach that is unsafe today
const isUnsafeToday = (flag: BeachFlag | undefined): boolean =>
  flag === 'ROJA' || flag === 'PLAYA CERRADA'

export function FeaturedBeachCard({
  beach,
  municipality,
  slug,
  weather,
  flag,
}: FeaturedBeachCardProps) {
  const { baseName, ext } = parseImageFilename(
    beach.pictures?.[0] ?? 'default-beach.png',
  )
  const facts = beachFactLine(beach)

  return (
    <Link
      className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-ocean-900 shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1 sm:col-span-2 lg:row-span-2 lg:min-h-0"
      params={{ slug }}
      to="/playas/$slug"
    >
      <ResponsiveImage
        alt={beach.name}
        baseName={baseName}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        ext={ext}
        priority="high"
      />
      {(weather ?? flag) && (
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          {weather && <WeatherPill weather={weather} />}
          {flag && <FlagPill flag={flag} />}
        </div>
      )}
      {/* The scrim follows the text, not the card, so pale sand behind the label stays dark while the tall desktop card keeps its photo */}
      <div className="relative bg-linear-to-t from-black/75 via-black/60 via-70% to-transparent p-6 pt-16 sm:p-8 sm:pt-20">
        {!isUnsafeToday(flag) && (
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-white uppercase">
            Imprescindible
          </p>
        )}
        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px] sm:leading-9">
          {beach.name}
        </h3>
        <p className="mt-1 text-sm text-white/90">{municipality.name}</p>
        {facts && (
          <p className="mt-1 truncate text-[13px] text-white/90">{facts}</p>
        )}
      </div>
    </Link>
  )
}
