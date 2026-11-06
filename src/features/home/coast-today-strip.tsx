import { Link } from '@tanstack/react-router'

import type { WeatherIconType } from '@/components/ui/icons'
import type {
  CoastSeaSlug,
  CoastToday,
  CountedFlag,
  FlagCounts,
  SeaWeather,
} from '@/lib/coast-today'

import { WeatherGlyph } from '@/components/ui/icons'
import { FlagBadges, validWeatherIcons } from '@/features/beaches/card-pills'
import { CoastSeas, formatRange } from '@/lib/coast-today'

const FlagLabels: Record<CountedFlag, [string, string]> = {
  VERDE: ['verde', 'verdes'],
  AMARILLA: ['amarilla', 'amarillas'],
  ROJA: ['roja', 'rojas'],
  'PLAYA CERRADA': ['cerrada', 'cerradas'],
}

const flagOrder = Object.keys(FlagLabels) as CountedFlag[]

const rangeInWords = (min: number, max: number): string =>
  min === max ? String(min) : `entre ${String(min)} y ${String(max)}`

function WeatherLine({ weather }: { weather: SeaWeather }) {
  const { temp, wind, icon } = weather
  const windWords = wind
    ? `, viento ${rangeInWords(wind.min, wind.max)} kilómetros por hora`
    : ''

  return (
    <span className="flex min-h-6 items-center gap-3 text-sm font-semibold text-gray-900 tabular-nums">
      <span className="sr-only">
        {`Temperatura ${rangeInWords(temp.min, temp.max)} grados${windWords}`}
      </span>
      <span aria-hidden="true" className="flex items-center gap-1">
        {icon && validWeatherIcons.has(icon) && (
          <WeatherGlyph
            className="h-4 w-4 shrink-0 text-ocean-600"
            type={icon as WeatherIconType}
          />
        )}
        {formatRange(temp)}°
      </span>
      {wind && (
        <span
          aria-hidden="true"
          className="flex items-center gap-1 font-medium text-gray-700"
        >
          <WeatherGlyph
            className="h-4 w-4 shrink-0 text-ocean-600"
            type="wind"
          />
          {formatRange(wind)} km/h
        </span>
      )}
    </span>
  )
}

function FlagLine({ flags }: { flags: FlagCounts }) {
  const shown = flagOrder.flatMap((flag) => {
    const count = flags[flag]
    return count ? [{ flag, count }] : []
  })

  return (
    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-gray-700 tabular-nums sm:gap-x-3 sm:text-sm">
      {shown.map(({ flag, count }) => (
        <span key={flag} className="flex items-center gap-1 sm:gap-1.5">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 rounded-full ${FlagBadges[flag]?.dot ?? ''}`}
          />
          {count} {FlagLabels[flag][count === 1 ? 0 : 1]}
        </span>
      ))}
    </span>
  )
}

const sourceLine = (today: CoastToday | undefined): string | undefined => {
  const seas = Object.values(today?.seas ?? {})
  const flagged = seas
    .flatMap(({ flags }) => Object.values(flags ?? {}))
    .reduce((sum, count) => sum + count, 0)
  const parts = [
    ...(seas.some(({ weather }) => weather)
      ? ['Open-Meteo', ...(today?.weatherTime ? [today.weatherTime] : [])]
      : []),
    ...(seas.some(({ flags }) => flags)
      ? [
          '112',
          ...(today?.flagsTime ? [today.flagsTime] : []),
          `${String(flagged)} playas con dato hoy`,
        ]
      : []),
  ]
  return parts.length > 0 ? parts.join(' · ') : undefined
}

type CoastTodayStripProps = {
  today: CoastToday | undefined
  isLoading: boolean
  expectsFlags: boolean
  beachCounts: Record<CoastSeaSlug, number>
}

export function CoastTodayStrip({
  today,
  isLoading,
  expectsFlags,
  beachCounts,
}: CoastTodayStripProps) {
  const sources = sourceLine(today)
  const isLive = isLoading || sources !== undefined

  return (
    <section
      aria-labelledby="coast-today-heading"
      className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8"
    >
      <h2
        className="overline-accent font-sans text-sm font-semibold tracking-wider text-ocean-600 uppercase"
        id="coast-today-heading"
      >
        {isLive ? 'Hoy en la costa' : 'La costa por mares'}
      </h2>
      <ul className="mt-2 grid border-b border-gray-200 sm:mt-3 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12">
        {CoastSeas.map(({ slug, name }) => {
          const sea = today?.seas[slug]
          return (
            <li key={slug} className="border-t border-gray-200">
              <Link
                className="group flex items-start justify-between gap-3 rounded-sm py-2.5 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 focus-visible:outline-none sm:py-3"
                params={{ slug }}
                to="/colecciones/$slug"
              >
                <span className="block min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-gray-900 transition-colors duration-150 group-hover:text-ocean-600">
                      {name}
                    </span>
                    <span className="text-[13px] text-gray-600 tabular-nums">
                      {beachCounts[slug]} playas
                    </span>
                  </span>
                  {sea?.weather && <WeatherLine weather={sea.weather} />}
                  {isLoading && (
                    <span
                      className={`block ${expectsFlags ? 'h-12' : 'h-6'}`}
                    />
                  )}
                  {sea?.flags && <FlagLine flags={sea.flags} />}
                </span>
                <svg
                  aria-hidden="true"
                  className="arrow-nudge mt-1 h-5 w-5 shrink-0 text-ocean-600"
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
            </li>
          )
        })}
      </ul>
      {(sources ?? isLoading) && (
        <p className="mt-2 min-h-5 text-[13px] text-gray-600 tabular-nums">
          {sources}
        </p>
      )}
    </section>
  )
}
