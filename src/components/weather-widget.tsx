import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import { WeatherIcon } from '@/components/icons'
import type { WeatherIconType } from '@/components/icons'

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
}

type UnifiedForecast = {
  source: 'aemet' | 'open-meteo'
  days: UnifiedDay[]
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

const fetchAemetWeather = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { aemetId: string } }) => {
    const {
      fetchAemetForecast,
      getDaySkyDescription: getSky,
      getDayWind: getWind,
    } = await import('@/lib/aemet')
    const apiKey = process.env.AEMET_API_KEY ?? ''
    if (!apiKey) return null
    const forecast = await fetchAemetForecast(ctx.data.aemetId, apiKey)
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
  },
)

const fetchOpenMeteoWeather = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { latitude: number; longitude: number } }) => {
    const { fetchOpenMeteoForecast } = await import('@/lib/open-meteo')
    const forecast = await fetchOpenMeteoForecast(
      ctx.data.latitude,
      ctx.data.longitude,
    )
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
      })),
    }
  },
)

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
}

function TodayCard({ day }: TodayCardProps) {
  const iconType = day.skyIcon
    ? (day.skyIcon as WeatherIconType)
    : getSkyIconType(day.skyDescription)
  const hasTemp = day.tMaxima !== -999
  const hasUV = day.uvIndex > 0

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <WeatherIcon className="h-12 w-12" type={iconType} />
      </div>
      <div className="min-w-0 flex-1">
        {day.skyDescription && (
          <p className="truncate text-sm font-medium text-gray-800 capitalize">
            {day.skyDescription}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {hasTemp && (
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {day.tMaxima}°
              </span>
              {day.tMinima !== -999 && (
                <span className="text-gray-400"> / {day.tMinima}°</span>
              )}
            </span>
          )}
          {day.windSpeed > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg
                aria-hidden="true"
                className="h-3 w-3 flex-shrink-0"
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
              {day.windSpeed} km/h {formatWindDirection(day.windDirection)}
            </span>
          )}
          {hasUV && (
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${uvBadgeClass(day.uvIndex)}`}
            >
              UV {day.uvIndex}
            </span>
          )}
        </div>
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

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center">
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {formatDayLabel(day.fecha)}
      </span>
      <WeatherIcon className="h-7 w-7" type={iconType} />
      {hasTemp && (
        <div className="text-xs">
          <span className="font-semibold text-gray-900">{day.tMaxima}°</span>
          {day.tMinima !== -999 && (
            <span className="text-gray-400"> / {day.tMinima}°</span>
          )}
        </div>
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
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 h-5 w-36 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
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

    const promise = aemetId
      ? fetchAemetWeather({ data: { aemetId } })
      : fetchOpenMeteoWeather({
          data: { latitude: coordinates[0], longitude: coordinates[1] },
        })

    promise
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
        className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Tiempo</h2>
        <p className="text-sm text-gray-400">
          Previsión no disponible en este momento.
        </p>
      </section>
    )
  }

  const { forecast } = state
  const [today, ...rest] = forecast.days
  const nextDays = rest.slice(0, 2)

  if (!today) return null

  const sourceLabel = forecast.source === 'aemet' ? 'AEMET' : 'Open-Meteo'

  return (
    <section
      aria-label="Previsión meteorológica"
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Tiempo</h2>

      <TodayCard day={today} />

      {nextDays.length > 0 && (
        <div
          className={`mt-4 grid gap-2 ${nextDays.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
        >
          {nextDays.map((day) => (
            <ForecastDayCard key={day.fecha} day={day} />
          ))}
        </div>
      )}

      <p className="mt-3 text-right text-xs text-gray-400">
        Fuente: {sourceLabel}
      </p>
    </section>
  )
}
