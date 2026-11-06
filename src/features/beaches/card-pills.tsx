import type { WeatherIconType } from '@/components/ui/icons'
import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'

import { WeatherGlyph } from '@/components/ui/icons'

export const FlagBadges: Partial<
  Record<BeachFlag, { label: string; dot: string }>
> = {
  VERDE: { label: 'Bandera verde', dot: 'bg-emerald-500' },
  AMARILLA: { label: 'Bandera amarilla', dot: 'bg-yellow-400' },
  ROJA: { label: 'Bandera roja', dot: 'bg-red-500' },
  'PLAYA CERRADA': { label: 'Playa cerrada', dot: 'bg-rose-900' },
}

export const validWeatherIcons = new Set([
  'sunny',
  'partly-cloudy',
  'cloudy',
  'rain',
  'storm',
  'fog',
  'haze',
])

export function WeatherPill({
  weather,
  showWindGlyph = true,
  className = '',
}: {
  weather: CardWeather
  showWindGlyph?: boolean
  className?: string
}) {
  return (
    <span
      className={`flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap text-gray-900 tabular-nums shadow-sm ${className}`}
    >
      <span className="flex items-center gap-1">
        <WeatherGlyph
          className="h-4 w-4 shrink-0 text-ocean-600"
          type={
            validWeatherIcons.has(weather.icon)
              ? (weather.icon as WeatherIconType)
              : 'unknown'
          }
        />
        {weather.temp}°
      </span>
      {weather.windSpeed !== undefined && weather.windDirection && (
        <span
          aria-label={`Viento ${String(weather.windSpeed)} kilómetros por hora, dirección ${weather.windDirection}`}
          className="flex items-center gap-1 text-xs font-medium text-gray-700"
        >
          {showWindGlyph && (
            <WeatherGlyph
              className="h-3.5 w-3.5 shrink-0 text-ocean-600"
              type="wind"
            />
          )}
          {weather.windSpeed} km/h {weather.windDirection}
        </span>
      )}
    </span>
  )
}

export function FlagPill({
  flag,
  className = '',
}: {
  flag: BeachFlag
  className?: string
}) {
  const badge = FlagBadges[flag]
  if (!badge) return null

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-sm font-medium whitespace-nowrap text-gray-900 shadow-sm backdrop-blur-sm ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${badge.dot}`}
      />
      {badge.label}
    </span>
  )
}

export const beachFactLine = ({
  length,
  soilType,
}: {
  length?: number
  soilType?: string
}): string =>
  [length ? `${String(length)} m` : '', soilType ?? '']
    .filter(Boolean)
    .join(' · ')
