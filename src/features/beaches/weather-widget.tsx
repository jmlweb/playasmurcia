import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { WeatherIconType } from '@/components/ui/icons'
import type { WaveExposure } from '@/lib/wave-exposure'

import { WeatherIcon } from '@/components/ui/icons'
import { formatCompassDirection } from '@/lib/beach-facts'
import { appendLaterDays } from '@/lib/forecast-days'
import { getWaveExposure } from '@/lib/wave-exposure'
import { formatWaveHeight, getWaveLevel } from '@/lib/wave-level'

import { parseBeachCodeInput } from './beach-code-input'
import { fetchMarineWeatherFn } from './use-beach-waves'

// ---------------------------------------------------------------------------
// Unified forecast types
// ---------------------------------------------------------------------------

type UnifiedDay = {
  fecha: number
  skyDescription: string
  skyIcon: string
  tMaxima: number
  tMinima: number
  windSpeed: number
  windDirection: string
  uvIndex: number
  precipitationProbability?: number
  // AEMET only: "Débil", "Moderado", "Fuerte"
  wavesDescription?: string
  // AEMET only
  waterTemp?: number
}

type CurrentWeather = {
  temp: number
  apparentTemp: number
  skyDescription: string
  skyIcon: string
  windSpeed: number
  windDirection: string
  uvIndex: number
}

type Waves = {
  height?: number
  direction?: string
  directionDegrees?: number
}

const ForecastSourceLabel = {
  aemet: 'AEMET',
  'open-meteo': 'Open-Meteo',
  'aemet+open-meteo': 'AEMET y Open-Meteo',
} as const

type UnifiedForecast = {
  source: keyof typeof ForecastSourceLabel
  days: UnifiedDay[]
  current?: CurrentWeather
  waterTemp?: number
  waves?: Waves
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

const fetchAemetWeather = createServerFn({ method: 'GET' })
  .validator(parseBeachCodeInput)
  .handler(async ({ data }) => {
    const [
      { getBeachWeatherTargets },
      { dropPastDays, fetchAemetForecast, getDayDescription },
    ] = await Promise.all([
      import('@/lib/db-data/beach-queries'),
      import('@/lib/aemet'),
    ])
    const apiKey = process.env.AEMET_API_KEY ?? ''
    if (!apiKey) return null
    const target = (await getBeachWeatherTargets([data.code])).at(0)
    if (!target?.aemetId) return null
    const forecast = await fetchAemetForecast(target.aemetId, apiKey)
    if (!forecast) return null

    const days: UnifiedDay[] = dropPastDays(forecast.dias, new Date()).map(
      (d) => ({
        fecha: d.fecha,
        skyDescription: getDayDescription(d.estadoCielo),
        skyIcon: '', // resolved client-side via getSkyIconType
        tMaxima: d.tMaxima,
        tMinima: -999, // AEMET beach forecasts have no minimum
        windSpeed: 0, // AEMET only gives qualitative wind ("flojo")
        windDirection: '',
        uvIndex: d.uvMax,
        wavesDescription: getDayDescription(d.oleaje) || undefined,
        waterTemp: d.tAgua,
      }),
    )
    if (days.length === 0) return null

    return { source: 'aemet' as const, days }
  })

const fetchOpenMeteoWeather = createServerFn({ method: 'GET' })
  .validator(parseBeachCodeInput)
  .handler(async ({ data }) => {
    const [{ getBeachWeatherTargets }, { fetchOpenMeteoForecast }] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/open-meteo'),
      ])
    const target = (await getBeachWeatherTargets([data.code])).at(0)
    if (!target) return null
    const forecast = await fetchOpenMeteoForecast(...target.coordinates)
    if (!forecast) return null

    return {
      source: 'open-meteo' as const,
      days: forecast.days.map((d) => ({
        fecha: d.fecha,
        skyDescription: d.skyDescription,
        skyIcon: d.skyIcon,
        tMaxima: d.tMaxima,
        tMinima: d.tMinima,
        windSpeed: d.windSpeed,
        windDirection: d.windDirection,
        uvIndex: d.uvIndex,
        precipitationProbability: d.precipitationProbability,
      })),
      current: forecast.current,
    }
  })

// ---------------------------------------------------------------------------
// Marine helpers
// ---------------------------------------------------------------------------

type MarineResult = Awaited<ReturnType<typeof fetchMarineWeatherFn>>

function toWaves(marine: MarineResult | null): Waves | undefined {
  if (marine?.waveHeight == null) return undefined
  return {
    height: marine.waveHeight,
    direction: marine.waveDirection,
    directionDegrees: marine.waveDirectionDegrees,
  }
}

// ---------------------------------------------------------------------------
// Sky condition helpers
// ---------------------------------------------------------------------------

const SkyIconMap: Record<string, string> = {
  // Precipitation first: AEMET sends "muy nuboso con lluvia", and the first
  // matching key wins.
  tormenta: 'storm',
  'lluvia débil': 'rain',
  lluvia: 'rain',
  'lluvia fuerte': 'rain',
  'chubascos débiles': 'rain',
  chubascos: 'rain',
  niebla: 'fog',
  calima: 'haze',
  despejado: 'sunny',
  'poco nuboso': 'partly-cloudy',
  'intervalos nubosos': 'partly-cloudy',
  nuboso: 'cloudy',
  'muy nuboso': 'cloudy',
  cubierto: 'cloudy',
}

function getSkyIconType(descripcion: string): WeatherIconType {
  const normalized = descripcion.toLowerCase().trim()
  for (const [key, value] of Object.entries(SkyIconMap)) {
    if (normalized.includes(key)) return value as WeatherIconType
  }
  return 'unknown'
}

// ---------------------------------------------------------------------------
// Day helpers
// ---------------------------------------------------------------------------

const DayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const

function formatDayLabel(timestamp: number): string {
  const date = new Date(timestamp)
  return DayNames[date.getDay()]
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const WaveExposureLabels: Record<WaveExposure, string> = {
  expuesta: 'entra de frente',
  resguardada: 'no entra de frente',
}

type TodayCardProps = {
  day: UnifiedDay
  current?: CurrentWeather
  waterTemp?: number
  waves?: Waves
  shoreBearing?: number
  hasOpenSeaWaves: boolean
}

function TodayCard({
  day,
  current,
  waterTemp,
  waves,
  shoreBearing,
  hasOpenSeaWaves,
}: TodayCardProps) {
  const iconType = current?.skyIcon
    ? (current.skyIcon as WeatherIconType)
    : day.skyIcon
      ? (day.skyIcon as WeatherIconType)
      : getSkyIconType(day.skyDescription)
  const skyDesc = current?.skyDescription ?? day.skyDescription
  const windSpeed = current?.windSpeed ?? day.windSpeed
  const windDir = current?.windDirection ?? day.windDirection
  const uvIndex = current?.uvIndex ?? day.uvIndex
  const hasTemp = day.tMaxima !== -999
  const hasUV = uvIndex > 0
  const waveHeight = waves?.height
  const waveLabel =
    day.wavesDescription ??
    (waveHeight != null ? getWaveLevel(waveHeight) : undefined)
  const hasWaves = hasOpenSeaWaves && waveLabel != null
  const waveExposure =
    shoreBearing != null && waves?.directionDegrees != null
      ? getWaveExposure(shoreBearing, waves.directionDegrees)
      : undefined

  return (
    <div>
      <div className="flex items-center gap-4">
        <WeatherIcon className="h-12 w-12 flex-shrink-0" type={iconType} />
        <div>
          {current ? (
            <>
              <p className="text-4xl font-light tracking-tight text-gray-900">
                {current.temp}°
              </p>
              {current.apparentTemp !== current.temp && (
                <p className="text-sm text-gray-600">
                  Sensación {current.apparentTemp}°
                </p>
              )}
            </>
          ) : (
            hasTemp && (
              <p className="text-4xl font-light tracking-tight text-gray-900">
                {day.tMaxima}°
                {day.tMinima !== -999 && (
                  <span className="text-lg text-gray-600">
                    {' '}
                    / {day.tMinima}°
                  </span>
                )}
              </p>
            )
          )}
          {skyDesc && (
            <p className="text-sm text-gray-600 first-letter:uppercase">
              {skyDesc}
            </p>
          )}
        </div>
      </div>

      {/* Detail row: min/max (when current shown), wind, water temp, waves, UV */}
      <div className="mt-3 grid grid-cols-2 items-center gap-x-4 gap-y-1.5 border-t border-ocean-200/60 pt-3 tabular-nums">
        {current && hasTemp && (
          <span className="text-sm text-gray-700">
            Máx {day.tMaxima}°{day.tMinima !== -999 && ` / Mín ${day.tMinima}°`}
          </span>
        )}
        {windSpeed > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-gray-700">
            <svg
              aria-hidden="true"
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            {windSpeed} km/h {formatCompassDirection(windDir)}
          </span>
        )}
        {waterTemp != null && (
          <span className="flex items-center gap-1.5 text-sm text-gray-700">
            <svg
              aria-hidden="true"
              className="h-4 w-4 flex-shrink-0 text-ocean-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 20c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0M3 15c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0M3 10c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            Agua {waterTemp}°
          </span>
        )}
        {hasWaves && (
          <span className="col-span-2 flex items-center gap-1.5 text-sm text-gray-700">
            <svg
              aria-hidden="true"
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M2 14c3-5 6-5 9 0s6 5 9 0M2 19c3-5 6-5 9 0s6 5 9 0"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <span>
              Oleaje hoy
              {waveHeight != null && ` ${formatWaveHeight(waveHeight)} m`}
              {waves?.direction &&
                ` ${formatCompassDirection(waves.direction)}`}
              {' · '}
              <span className="inline-block first-letter:uppercase">
                {waveLabel}
              </span>
              {waveExposure && (
                <>
                  {' · '}
                  {WaveExposureLabels[waveExposure]}
                </>
              )}
            </span>
          </span>
        )}
        {hasUV && <span className="text-sm text-gray-700">UV {uvIndex}</span>}
      </div>
    </div>
  )
}

type ForecastDayCardProps = {
  day: UnifiedDay
}

function ForecastDayCard({ day }: ForecastDayCardProps) {
  const iconType = day.skyIcon
    ? (day.skyIcon as WeatherIconType)
    : getSkyIconType(day.skyDescription)
  const hasTemp = day.tMaxima !== -999
  const showRain =
    day.precipitationProbability != null && day.precipitationProbability > 0
  const isWeekend = [0, 6].includes(new Date(day.fecha).getDay())

  return (
    <li className="flex min-w-0 flex-col items-center gap-1 text-center tabular-nums">
      <span
        className={`text-xs ${isWeekend ? 'font-semibold text-ocean-700' : 'font-medium text-gray-600'}`}
      >
        {formatDayLabel(day.fecha)}
      </span>
      <WeatherIcon className="h-6 w-6" type={iconType} />
      {hasTemp && (
        <span className="text-sm font-semibold text-gray-900">
          {day.tMaxima}°
        </span>
      )}
      {hasTemp && day.tMinima !== -999 && (
        <span className="text-xs text-gray-600">{day.tMinima}°</span>
      )}
      {showRain && (
        <span className="flex items-center text-xs text-ocean-700">
          <span className="sr-only">Lluvia </span>
          {day.precipitationProbability}%
        </span>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function WeatherSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Cargando previsión meteorológica"
      className="rounded-2xl bg-ocean-50 p-5"
    >
      <div className="mb-4 h-5 w-36 animate-pulse rounded bg-ocean-100/60" />
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-ocean-100/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-ocean-100/60" />
          <div className="h-3 w-40 animate-pulse rounded bg-ocean-100/60" />
        </div>
      </div>
      <div className="mt-4 h-24 animate-pulse rounded-xl bg-ocean-100/40" />
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

type WeatherWidgetProps = {
  beachCode: string
  hasAemetForecast: boolean
  /** Degrees the beach faces seaward; omit where open-sea waves do not apply. */
  shoreBearing?: number
  /** False for the Mar Menor: open-sea wave data does not describe the lagoon */
  hasOpenSeaWaves: boolean
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; forecast: UnifiedForecast }

export function WeatherWidget({
  beachCode,
  hasAemetForecast,
  shoreBearing,
  hasOpenSeaWaves,
}: WeatherWidgetProps) {
  const [state, setState] = useState<FetchState>({ status: 'idle' })
  const [attempt, setAttempt] = useState(0)

  // Reset to loading during render (not in an effect) when the location changes
  const [prevBeachCode, setPrevBeachCode] = useState(beachCode)
  if (beachCode !== prevBeachCode) {
    setPrevBeachCode(beachCode)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    let cancelled = false

    const requestData = { code: beachCode }
    const marinePromise = fetchMarineWeatherFn({ data: requestData }).catch(
      () => null,
    )

    const buildForecast = hasAemetForecast
      ? Promise.all([
          fetchAemetWeather({ data: requestData }).catch(() => null),
          fetchOpenMeteoWeather({ data: requestData }).catch(() => null),
          marinePromise,
        ]).then(([aemet, om, marine]) => {
          // AEMET beach forecasts are seasonal and the key may be missing; fall
          // back to Open-Meteo rather than showing an empty widget.
          if (!aemet)
            return om
              ? {
                  ...om,
                  waterTemp: marine?.currentTemp,
                  waves: toWaves(marine),
                }
              : null
          const days = appendLaterDays(aemet.days, om?.days ?? [])
          return {
            ...aemet,
            source:
              days.length > aemet.days.length
                ? ('aemet+open-meteo' as const)
                : aemet.source,
            days,
            current: om?.current,
            waterTemp: marine?.currentTemp ?? aemet.days[0]?.waterTemp,
            waves: toWaves(marine),
          }
        })
      : Promise.all([
          fetchOpenMeteoWeather({ data: requestData }),
          marinePromise,
        ]).then(([om, marine]) => {
          if (!om) return null
          return {
            ...om,
            waterTemp: marine?.currentTemp,
            waves: toWaves(marine),
          }
        })

    buildForecast
      .then((forecast) => {
        if (cancelled) return
        if (!forecast) {
          setState({ status: 'error' })
        } else {
          setState({ status: 'success', forecast })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [beachCode, hasAemetForecast, attempt])

  if (state.status === 'idle' || state.status === 'loading') {
    return <WeatherSkeleton />
  }

  if (state.status === 'error') {
    return (
      <section
        aria-label="Previsión meteorológica"
        className="rounded-2xl border border-dashed border-ocean-200 p-5"
      >
        <h2 className="mb-3 text-2xl font-normal tracking-tight text-gray-900">
          Previsión
        </h2>
        <p className="text-sm text-gray-600">
          No hemos podido cargar la previsión.
        </p>
        <button
          className="mt-3 inline-flex min-h-11 items-center rounded-full border border-ocean-200 px-5 text-sm font-semibold text-ocean-600 transition-colors hover:bg-ocean-50 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          onClick={() => {
            setState({ status: 'loading' })
            setAttempt((current) => current + 1)
          }}
        >
          Reintentar
        </button>
      </section>
    )
  }

  const { forecast } = state
  const [today, ...rest] = forecast.days
  const nextDays = rest.slice(0, 6)

  if (!today) return null

  return (
    <section
      aria-label="Previsión meteorológica"
      className="rounded-2xl bg-ocean-50 p-5"
    >
      <h2 className="mb-4 text-2xl font-normal tracking-tight text-gray-900">
        Previsión
      </h2>

      <TodayCard
        current={forecast.current}
        day={today}
        hasOpenSeaWaves={hasOpenSeaWaves}
        shoreBearing={shoreBearing}
        waterTemp={forecast.waterTemp}
        waves={forecast.waves}
      />

      {nextDays.length > 0 && (
        <ul className="mt-4 grid auto-cols-fr grid-flow-col gap-1 border-t border-ocean-200/60 pt-3">
          {nextDays.map((day) => (
            <ForecastDayCard key={day.fecha} day={day} />
          ))}
        </ul>
      )}

      <footer className="mt-3">
        <p className="text-xs text-gray-600">
          Fuente: {ForecastSourceLabel[forecast.source]}
        </p>
      </footer>
    </section>
  )
}
