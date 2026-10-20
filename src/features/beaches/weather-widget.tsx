import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { WeatherIconType } from '@/components/ui/icons'

import { WeatherIcon } from '@/components/ui/icons'
import { getWaveExposure } from '@/lib/wave-exposure'
import { formatWaveHeight, getWaveLevel } from '@/lib/wave-level'

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

type UnifiedForecast = {
  source: 'aemet' | 'open-meteo'
  days: UnifiedDay[]
  current?: CurrentWeather
  waterTemp?: number
  waves?: Waves
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

const fetchAemetWeather = createServerFn({ method: 'GET' })
  .validator((data: { aemetId: string }) => {
    if (typeof data.aemetId !== 'string' || !data.aemetId.trim()) {
      throw new Error('Invalid AEMET id')
    }
    return { aemetId: data.aemetId.trim() }
  })
  .handler(async ({ data }) => {
    const {
      fetchAemetForecast,
      getDaySkyDescription: getSky,
      getDayWaves: getWaves,
      getDayWind: getWind,
    } = await import('@/lib/aemet')
    const apiKey = process.env.AEMET_API_KEY ?? ''
    if (!apiKey) return null
    const forecast = await fetchAemetForecast(data.aemetId, apiKey)
    if (!forecast) return null

    const days: UnifiedDay[] = forecast.dias.map((d) => {
      const sky = getSky(d.estadoCielo)
      const wind = getWind(d.viento)
      const waves = getWaves(d.oleaje)
      return {
        fecha: d.fecha,
        skyDescription: sky?.descripcion ?? '',
        skyIcon: '', // resolved client-side via getSkyIconType
        tMaxima: d.tMaxima,
        tMinima: d.tMinima,
        windSpeed: wind?.velocidad ?? 0,
        windDirection: wind?.direccion ?? '',
        uvIndex: d.indiceUV,
        wavesDescription: waves?.descripcion ? waves.descripcion : undefined,
      }
    })

    return { source: 'aemet' as const, days }
  })

const fetchOpenMeteoWeather = createServerFn({ method: 'GET' })
  .validator((data: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = data
    if (typeof latitude !== 'number' || !Number.isFinite(latitude)) {
      throw new Error('Invalid latitude')
    }
    if (typeof longitude !== 'number' || !Number.isFinite(longitude)) {
      throw new Error('Invalid longitude')
    }
    return { latitude, longitude }
  })
  .handler(async ({ data }) => {
    const { fetchOpenMeteoForecast } = await import('@/lib/open-meteo')
    const forecast = await fetchOpenMeteoForecast(data.latitude, data.longitude)
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

const fetchMarineWeatherFn = createServerFn({ method: 'GET' })
  .validator((data: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = data
    if (typeof latitude !== 'number' || !Number.isFinite(latitude)) {
      throw new Error('Invalid latitude')
    }
    if (typeof longitude !== 'number' || !Number.isFinite(longitude)) {
      throw new Error('Invalid longitude')
    }
    return { latitude, longitude }
  })
  .handler(async ({ data }) => {
    const { fetchMarineWeather } = await import('@/lib/open-meteo')
    return fetchMarineWeather(data.latitude, data.longitude)
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
  despejado: 'sunny',
  'poco nuboso': 'partly-cloudy',
  'intervalos nubosos': 'partly-cloudy',
  nuboso: 'cloudy',
  'muy nuboso': 'cloudy',
  cubierto: 'cloudy',
  'lluvia débil': 'rain',
  lluvia: 'rain',
  'lluvia fuerte': 'rain',
  'chubascos débiles': 'rain',
  chubascos: 'rain',
  tormenta: 'storm',
  niebla: 'fog',
  calima: 'haze',
}

function getSkyIconType(descripcion: string): WeatherIconType {
  const normalized = descripcion.toLowerCase().trim()
  for (const [key, value] of Object.entries(SkyIconMap)) {
    if (normalized.includes(key)) return value as WeatherIconType
  }
  return 'unknown'
}

// ---------------------------------------------------------------------------
// Wind direction label
// ---------------------------------------------------------------------------

const WindDirectionLabel: Record<string, string> = {
  N: 'Norte',
  NE: 'NE',
  E: 'Este',
  SE: 'SE',
  S: 'Sur',
  SO: 'SO',
  O: 'Oeste',
  NO: 'NO',
  C: 'Calma',
}

function formatWindDirection(dir: string): string {
  return WindDirectionLabel[dir.toUpperCase()] ?? dir
}

// ---------------------------------------------------------------------------
// UV Index badge
// ---------------------------------------------------------------------------

function uvBadgeClass(uv: number): string {
  if (uv <= 2) return 'bg-emerald-100 text-emerald-700'
  if (uv <= 5) return 'bg-yellow-100 text-yellow-700'
  if (uv <= 7) return 'bg-orange-100 text-orange-700'
  if (uv <= 10) return 'bg-red-100 text-red-700'
  return 'bg-purple-100 text-purple-700'
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

type TodayCardProps = {
  day: UnifiedDay
  current?: CurrentWeather
  waterTemp?: number
  waves?: Waves
  shoreBearing?: number
}

function TodayCard({
  day,
  current,
  waterTemp,
  waves,
  shoreBearing,
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
  const hasWaves = waveLabel != null
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
                <p className="text-sm text-gray-400">
                  Sensación {current.apparentTemp}°
                </p>
              )}
            </>
          ) : (
            hasTemp && (
              <p className="text-4xl font-light tracking-tight text-gray-900">
                {day.tMaxima}°
                {day.tMinima !== -999 && (
                  <span className="text-lg text-gray-400">
                    {' '}
                    / {day.tMinima}°
                  </span>
                )}
              </p>
            )
          )}
          {skyDesc && (
            <p className="text-sm text-gray-500 first-letter:uppercase">
              {skyDesc}
            </p>
          )}
        </div>
      </div>

      {/* Detail row: min/max (when current shown), wind, water temp, waves, UV */}
      <div className="mt-3 grid grid-cols-2 items-center gap-x-4 gap-y-1.5 border-t border-gray-100 pt-3">
        {current && hasTemp && (
          <span className="text-sm text-gray-500">
            Máx {day.tMaxima}° / Mín {day.tMinima}°
          </span>
        )}
        {windSpeed > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
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
            {windSpeed} km/h {formatWindDirection(windDir)}
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
          <span className="col-span-2 flex items-center gap-1.5 text-sm text-gray-500">
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
              Oleaje
              {waveHeight != null && ` ${formatWaveHeight(waveHeight)} m`}
              {waves?.direction && ` ${formatWindDirection(waves.direction)}`}
              {' · '}
              <span className="inline-block first-letter:uppercase">
                {waveLabel}
              </span>
              {waveExposure && (
                <>
                  {' · '}
                  <span className="inline-block first-letter:uppercase">
                    {waveExposure}
                  </span>
                </>
              )}
            </span>
          </span>
        )}
        {hasUV && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${uvBadgeClass(uvIndex)}`}
          >
            UV {uvIndex}
          </span>
        )}
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

  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-ocean-200/60 bg-ocean-50/70 px-1.5 py-3 text-center">
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {formatDayLabel(day.fecha)}
      </span>
      <WeatherIcon className="h-8 w-8" type={iconType} />
      {hasTemp && (
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{day.tMaxima}°</span>
          {day.tMinima !== -999 && (
            <span className="text-gray-400"> / {day.tMinima}°</span>
          )}
        </div>
      )}
      {showRain && (
        <span className="text-[0.65rem] leading-tight text-blue-500">
          {day.precipitationProbability}%💧
        </span>
      )}
    </div>
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
      className="rounded-2xl border border-ocean-100 bg-gradient-to-br from-sky-50/80 to-ocean-50/40 p-6 shadow-sm"
    >
      <div className="mb-4 h-5 w-36 animate-pulse rounded bg-ocean-100/60" />
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-ocean-100/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-ocean-100/60" />
          <div className="h-3 w-40 animate-pulse rounded bg-ocean-100/60" />
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-hidden">
        <div className="h-20 w-24 flex-shrink-0 animate-pulse rounded-xl bg-ocean-100/40" />
        <div className="h-20 w-24 flex-shrink-0 animate-pulse rounded-xl bg-ocean-100/40" />
        <div className="h-20 w-24 flex-shrink-0 animate-pulse rounded-xl bg-ocean-100/40" />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

type WeatherWidgetProps = {
  aemetId?: string
  coordinates: [number, number]
  /** Degrees the beach faces seaward; omit where open-sea waves do not apply. */
  shoreBearing?: number
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; forecast: UnifiedForecast }

export function WeatherWidget({
  aemetId,
  coordinates,
  shoreBearing,
}: WeatherWidgetProps) {
  const [state, setState] = useState<FetchState>({ status: 'idle' })

  // Reset to loading during render (not in an effect) when the location changes
  const requestKey = `${aemetId ?? ''}|${coordinates[0]}|${coordinates[1]}`
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey)
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    let cancelled = false

    const coordData = { latitude: coordinates[0], longitude: coordinates[1] }
    const marinePromise = fetchMarineWeatherFn({ data: coordData }).catch(
      () => null,
    )

    const buildForecast = aemetId
      ? Promise.all([
          fetchAemetWeather({ data: { aemetId } }).catch(() => null),
          fetchOpenMeteoWeather({ data: coordData }).catch(() => null),
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
          return {
            ...aemet,
            current: om?.current,
            waterTemp: marine?.currentTemp,
            waves: toWaves(marine),
          }
        })
      : Promise.all([
          fetchOpenMeteoWeather({ data: coordData }),
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
  }, [aemetId, coordinates[0], coordinates[1]])

  if (state.status === 'idle' || state.status === 'loading') {
    return <WeatherSkeleton />
  }

  if (state.status === 'error') {
    return (
      <section
        aria-label="Previsión meteorológica"
        className="rounded-2xl border border-dashed border-ocean-200 bg-ocean-50/30 p-6"
      >
        <h2 className="mb-3 text-xl font-semibold text-ocean-600">
          Previsión meteorológica
        </h2>
        <p className="text-sm text-gray-400">
          Previsión no disponible en este momento.
        </p>
      </section>
    )
  }

  const { forecast } = state
  const [today, ...rest] = forecast.days
  const nextDays = rest.slice(0, 6)

  if (!today) return null

  const sourceLabel = forecast.source === 'aemet' ? 'AEMET' : 'Open-Meteo'

  return (
    <section
      aria-label="Previsión meteorológica"
      className="rounded-2xl border border-ocean-100 bg-gradient-to-br from-sky-50/80 to-ocean-50/40 p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Previsión meteorológica
      </h2>

      <TodayCard
        current={forecast.current}
        day={today}
        shoreBearing={shoreBearing}
        waterTemp={forecast.waterTemp}
        waves={forecast.waves}
      />

      {nextDays.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {nextDays.map((day) => (
            <ForecastDayCard key={day.fecha} day={day} />
          ))}
        </div>
      )}

      <footer className="mt-4 border-t border-ocean-100 pt-3">
        <p className="text-xs text-gray-400">Fuente: {sourceLabel}</p>
      </footer>
    </section>
  )
}
