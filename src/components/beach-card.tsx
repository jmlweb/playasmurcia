import { Link } from '@tanstack/react-router'

import type { WeatherIconType } from '@/components/icons'
import { WeatherIcon } from '@/components/icons'
import { ResponsiveImage } from '@/components/responsive-image'
import { parseImageFilename } from '@/lib/images'
import type { CardWeather } from '@/lib/open-meteo'
import { OccupancyStyles } from '@/lib/status-styles'
import type { Beach, Municipality, Tag } from '@/types/beach'

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
}

export function BeachCard({
  beach,
  municipality,
  tags,
  slug,
  eager,
  weather,
}: BeachCardProps) {
  const firstPicture = beach.pictures?.[0]
  const { baseName, ext } = parseImageFilename(
    firstPicture ?? 'default-beach.png',
  )
  const visibleTags = (beach.tags ?? [])
    .slice(0, 3)
    .map((i) => tags[i])
    .filter(Boolean)

  return (
    <Link
      className="group hover:ring-ocean-200 focus-visible:ring-ocean-500 flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-500 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-1"
      params={{ slug }}
      to="/playas/$slug"
    >
      <div className="relative aspect-3/2 overflow-hidden bg-gray-100">
        <ResponsiveImage
          alt={beach.name}
          baseName={baseName}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          ext={ext}
          priority={eager ? 'high' : 'low'}
          variant="thumb"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
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
          </span>
        )}
        {beach.occupancyLevel && (
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${OccupancyStyles[beach.occupancyLevel].solid}`}
          >
            {OccupancyStyles[beach.occupancyLevel].label}
          </span>
        )}
        {visibleTags.length > 0 && (
          <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="group-hover:text-ocean-600 mb-1 text-lg font-semibold text-gray-900 transition-colors">
          {beach.name}
        </h3>
        <p className="text-sm text-gray-500">{municipality.name}</p>
        {(beach.length ?? beach.soilType) && (
          <p className="mt-1 truncate text-xs text-gray-400">
            {beach.length
              ? `${beach.length} m · ${beach.soilType}`
              : beach.soilType}
          </p>
        )}
      </div>
    </Link>
  )
}
