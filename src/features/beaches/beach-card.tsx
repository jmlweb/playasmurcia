import { Link } from '@tanstack/react-router'

import type { WeatherIconType } from '@/components/ui/icons'
import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'
import type { Beach, Municipality, Tag } from '@/types/beach'

import { WeatherIcon } from '@/components/ui/icons'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { formatDistance } from '@/lib/geo'
import { parseImageFilename } from '@/lib/images'
import { seasonalOccupancy } from '@/lib/occupancy'
import { OccupancyStyles } from '@/lib/status-styles'

const FlagBadges: Partial<Record<BeachFlag, { label: string; dot: string }>> = {
  VERDE: { label: 'Bandera verde', dot: 'bg-emerald-500' },
  AMARILLA: { label: 'Bandera amarilla', dot: 'bg-yellow-400' },
  ROJA: { label: 'Bandera roja', dot: 'bg-red-500' },
}

const validWeatherIcons = new Set([
  'sunny',
  'partly-cloudy',
  'cloudy',
  'rain',
  'storm',
  'fog',
  'haze',
])

type BeachCardProps = {
  beach: Beach
  municipality: Municipality
  tags: Tag[]
  slug: string
  eager?: boolean
  weather?: CardWeather
  distanceKm?: number
  flag?: BeachFlag
}

export function BeachCard({
  beach,
  municipality,
  tags,
  slug,
  eager,
  weather,
  distanceKm,
  flag,
}: BeachCardProps) {
  const firstPicture = beach.pictures?.[0]
  const hasPicture = Boolean(firstPicture)
  const { baseName, ext } = parseImageFilename(
    firstPicture ?? 'default-beach.png',
  )
  const allTags = (beach.tags ?? []).map((i) => tags[i]).filter(Boolean)
  const overlayTags = allTags.slice(0, 2)
  const bodyTags = allTags.slice(2, 4)
  const occupancy =
    beach.occupancyLevel && seasonalOccupancy(beach.occupancyLevel)

  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg hover:ring-ocean-200 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/playas/$slug"
    >
      <div className="relative aspect-3/2 overflow-hidden bg-ocean-900">
        {hasPicture ? (
          <ResponsiveImage
            alt={beach.name}
            baseName={baseName}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            ext={ext}
            priority={eager ? 'high' : 'low'}
            variant="thumb"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-ocean-700 to-ocean-900">
            <svg
              aria-hidden="true"
              className="h-12 w-12 text-ocean-200"
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
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        {weather && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm">
            <WeatherIcon
              className="h-4 w-4"
              type={
                validWeatherIcons.has(weather.icon)
                  ? (weather.icon as WeatherIconType)
                  : 'unknown'
              }
            />
            {weather.temp}°
            {weather.windSpeed !== undefined && weather.windDirection && (
              <span
                aria-label={`Viento ${String(weather.windSpeed)} kilómetros por hora, dirección ${weather.windDirection}`}
                className="border-l border-gray-300 pl-1.5 text-xs font-normal text-gray-600"
              >
                {weather.windSpeed} km/h {weather.windDirection}
              </span>
            )}
          </span>
        )}
        {occupancy && (
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${OccupancyStyles[occupancy].solid}`}
          >
            {OccupancyStyles[occupancy].label}
          </span>
        )}
        {flag && FlagBadges[flag] && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${FlagBadges[flag].dot}`}
            />
            {FlagBadges[flag].label}
          </span>
        )}
        {overlayTags.length > 0 && (
          <div className="absolute right-3 bottom-3 flex min-w-0 flex-nowrap justify-end gap-1.5">
            {overlayTags.map((tag) => (
              <span
                key={tag.id}
                className="truncate rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-gray-900 shadow-sm backdrop-blur-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-ocean-600">
          {beach.name}
        </h3>
        <p className="text-sm text-gray-600">
          {municipality.name}
          {distanceKm !== undefined && ` · a ${formatDistance(distanceKm)}`}
        </p>
        {(beach.length ?? beach.soilType) && (
          <p className="mt-1 truncate text-[13px] text-gray-600">
            {beach.length
              ? `${beach.length} m · ${beach.soilType}`
              : beach.soilType}
          </p>
        )}
        {bodyTags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {bodyTags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
