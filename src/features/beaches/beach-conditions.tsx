import { useMemo } from 'react'

import type { WeatherIconType } from '@/components/ui/icons'
import type { BeachFlag } from '@/lib/beach-status-112'
import type { CardWeather } from '@/lib/open-meteo'

import { WeatherIcon } from '@/components/ui/icons'
import { formatWaveHeight } from '@/lib/wave-level'

import { FlagBadges, validWeatherIcons } from './beach-card'
import { useBeachWaveHeight } from './use-beach-waves'
import { useCardFlags } from './use-card-flags'
import { useCardWeather } from './use-card-weather'

type BeachConditionsProps = {
  beachCode: string
  /** False for the Mar Menor: the lagoon is not exposed to open-sea waves */
  hasOpenSeaWaves: boolean
}

export function BeachConditions({
  beachCode,
  hasOpenSeaWaves,
}: BeachConditionsProps) {
  const beaches = useMemo(() => [{ code: beachCode }], [beachCode])
  const weather: CardWeather | undefined = useCardWeather(beaches)[beachCode]
  const flag: BeachFlag | undefined = useCardFlags(beaches)[beachCode]
  const waveHeight = useBeachWaveHeight(beachCode, hasOpenSeaWaves)

  const flagBadge = flag ? FlagBadges[flag] : undefined
  const hasOpenMeteoData = weather !== undefined || waveHeight !== undefined
  const sources = [
    hasOpenMeteoData ? 'Open-Meteo' : undefined,
    flagBadge ? '112 Región de Murcia' : undefined,
  ].filter(Boolean)

  return (
    // Height reserved so the hero does not jump when data arrives after mount
    <div className="mt-3 min-h-17 sm:min-h-11">
      {sources.length > 0 && (
        <>
          <ul
            aria-label="Condiciones recientes"
            className="flex min-h-6 flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-white tabular-nums"
          >
            {weather && (
              <li className="flex items-center gap-1.5">
                <WeatherIcon
                  className="h-5 w-5 shrink-0"
                  type={
                    validWeatherIcons.has(weather.icon)
                      ? (weather.icon as WeatherIconType)
                      : 'unknown'
                  }
                />
                <span className="text-base font-semibold">{weather.temp}°</span>
              </li>
            )}
            {weather?.windSpeed !== undefined && weather.windDirection && (
              <li>
                Viento {weather.windSpeed} km/h {weather.windDirection}
              </li>
            )}
            {waveHeight !== undefined && (
              <li>Oleaje {formatWaveHeight(waveHeight)} m</li>
            )}
            {flagBadge && (
              <li className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/60 ${flagBadge.dot}`}
                />
                {flagBadge.label}
              </li>
            )}
          </ul>
          {/* Card weather is cached for up to 2 hours, so "ahora" would overclaim */}
          <p className="mt-1 text-xs text-white/85">
            Datos recientes: {sources.join(' y ')}
          </p>
        </>
      )}
    </div>
  )
}
