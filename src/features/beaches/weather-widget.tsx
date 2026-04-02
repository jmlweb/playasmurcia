import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { WeatherIconType } from '@/components/ui/icons'
import { WeatherIcon } from '@/components/ui/icons'

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

type UnifiedForecast = {
  source: 'aemet' | 'open-meteo'
  days: UnifiedDay[]
  current?: CurrentWeather
  waterTemp?: number
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

const fetchAemetWeather = createServerFn({ method: 'GET' })
  .inputValidator((data: { aemetId: string }) => {
    if (typeof data.aemetId !== 'string' || !data.aemetId.trim()) {
      throw new Error('Invalid AEMET id')
    }
    return { aemetId: data.aemetId.trim() }
  })
  .handler(async ({ data }) => {
    const {
      fetchAemetForecast,
      getDaySkyDescription: getSky,
      getDayWind: getWind,
    } = await import('@/lib/aemet')
    const apiKey = process.env.AEMET_API_KEY ?? ''
    if (!apiKey) return null
    const forecast = await fetchAemetForecast(data.aemetId, apiKey)
    if (!forecast) return null

    const days: UnifiedDay[] = forecast.dias.map((d) => {
      const sky = getSky(d.estadoCielo)
      const wind = getWind(d.viento)
      return {
        fecha: d.fecha,
        skyDescription: sky?.descripcion ?? '',
        skyIcon: '', // resolved client-side via getSkyIconType
        tMaxima: d.tMaxima,
        tMinima: d.tMinima,
        windSpeed: wind?.velocidad ?? 0,
        windDirection: wind?.direccion ?? '',
        uvIndex: d.indiceUV,
      }
    })

    return { source: 'aemet' as const, days }
  })

const fetchOpenMeteoWeather = createServerFn({ method: 'GET' })
  .inputValidator((data: { latitude: number; longitude: number }) => {
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
  .inputValidator((data: { latitude: number; longitude: number }) => {
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
}

function TodayCard({ day, current, waterTemp }: TodayCardProps) {
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
            <p className="text-sm text-gray-500 capitalize">{skyDesc}</p>
          )}
        </div>
      </div>

      {/* Detail row: min/max (when current shown), wind, water temp, UV */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-gray-100 pt-3">
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
          <span className="flex items-center gap-1.5 text-sm text-blue-600">
            <svg
              aria-hidden="true"
              className="h-4 w-4 flex-shrink-0"
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
    <div className="border-ocean-200/60 bg-ocean-50/70 flex min-w-[5.5rem] flex-col items-center gap-1.5 rounded-xl border p-3 text-center">
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
      className="border-ocean-100 to-ocean-50/40 rounded-2xl border bg-gradient-to-br from-sky-50/80 p-6 shadow-sm"
    >
      <div className="bg-ocean-100/60 mb-4 h-5 w-36 animate-pulse rounded" />
      <div className="flex items-center gap-4">
        <div className="bg-ocean-100/60 h-12 w-12 flex-shrink-0 animate-pulse rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-ocean-100/60 h-4 w-28 animate-pulse rounded" />
          <div className="bg-ocean-100/60 h-3 w-40 animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-hidden">
        <div className="bg-ocean-100/40 h-20 w-24 flex-shrink-0 animate-pulse rounded-xl" />
        <div className="bg-ocean-100/40 h-20 w-24 flex-shrink-0 animate-pulse rounded-xl" />
        <div className="bg-ocean-100/40 h-20 w-24 flex-shrink-0 animate-pulse rounded-xl" />
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
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; forecast: UnifiedForecast }

export function WeatherWidget({ aemetId, coordinates }: WeatherWidgetProps) {
  const [state, setState] = useState<FetchState>({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    const coordData = { latitude: coordinates[0], longitude: coordinates[1] }
    const marinePromise = fetchMarineWeatherFn({ data: coordData }).catch(
      () => null,
    )

    const buildForecast = aemetId
      ? Promise.all([
          fetchAemetWeather({ data: { aemetId } }),
          fetchOpenMeteoWeather({ data: coordData }).catch(() => null),
          marinePromise,
        ]).then(([aemet, om, marine]) => {
          if (!aemet) return null
          return {
            ...aemet,
            current: om?.current,
            waterTemp: marine?.currentTemp,
          } as UnifiedForecast
        })
      : Promise.all([
          fetchOpenMeteoWeather({ data: coordData }),
          marinePromise,
        ]).then(([om, marine]) => {
          if (!om) return null
          return {
            ...om,
            waterTemp: marine?.currentTemp,
          } as UnifiedForecast
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
        className="border-ocean-200 bg-ocean-50/30 rounded-2xl border border-dashed p-6"
      >
        <h2 className="text-ocean-600 mb-3 text-xl font-semibold">
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
      className="border-ocean-100 to-ocean-50/40 rounded-2xl border bg-gradient-to-br from-sky-50/80 p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Previsión meteorológica
      </h2>

      <TodayCard
        current={forecast.current}
        day={today}
        waterTemp={forecast.waterTemp}
      />

      {nextDays.length > 0 && (
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {nextDays.map((day) => (
            <ForecastDayCard key={day.fecha} day={day} />
          ))}
        </div>
      )}

      <footer className="border-ocean-100 mt-4 border-t pt-3">
        <p className="text-xs text-gray-400">Fuente: {sourceLabel}</p>
      </footer>
    </section>
  )
}
