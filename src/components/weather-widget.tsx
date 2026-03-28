import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Unified forecast types
// ---------------------------------------------------------------------------

interface UnifiedDay {
  fecha: number
  skyDescription: string
  skyIcon: string
  tMaxima: number
  tMinima: number
  windSpeed: number
  windDirection: string
  uvIndex: number
}

interface UnifiedForecast {
  source: 'aemet' | 'open-meteo'
  days: Array<UnifiedDay>
}

// ---------------------------------------------------------------------------
// Server functions
// ---------------------------------------------------------------------------

const fetchAemetWeather = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { aemetId: string } }) => {
    const { fetchAemetForecast, getDaySkyDescription: getSky, getDayWind: getWind } = await import('@/lib/aemet')
    const apiKey = process.env.AEMET_API_KEY ?? ''
    if (!apiKey) return null
    const forecast = await fetchAemetForecast(ctx.data.aemetId, apiKey)
    if (!forecast) return null

    const days: Array<UnifiedDay> = forecast.dias.map((d) => {
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
    const forecast = await fetchOpenMeteoForecast(ctx.data.latitude, ctx.data.longitude)
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

type SkyIconType = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'haze' | 'unknown'

function getSkyIconType(descripcion: string): SkyIconType {
  const normalized = descripcion.toLowerCase().trim()
  for (const [key, value] of Object.entries(SkyIconMap)) {
    if (normalized.includes(key)) return value as SkyIconType
  }
  return 'unknown'
}

interface SkyIconProps {
  type: SkyIconType
  className?: string
}

function SkyIcon({ type, className = 'h-8 w-8' }: SkyIconProps) {
  switch (type) {
    case 'sunny':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="#F59E0B" />
          <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
          </g>
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="3.5" fill="#F59E0B" />
          <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
            <line x1="10" y1="3" x2="10" y2="5" />
            <line x1="3" y1="10" x2="5" y2="10" />
            <line x1="5.22" y1="5.22" x2="6.64" y2="6.64" />
          </g>
          <path
            d="M9 18H17.5a3.5 3.5 0 000-7h-.3A4 4 0 009 14v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'cloudy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 19H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 14v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 19H13a3 3 0 000-6h-.5A3.5 3.5 0 004 16"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'rain':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 14H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 9v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <g stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round">
            <line x1="8" y1="17" x2="7" y2="20" />
            <line x1="12" y1="17" x2="11" y2="20" />
            <line x1="16" y1="17" x2="15" y2="20" />
          </g>
        </svg>
      )
    case 'storm':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 12H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 7v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polyline
            points="13,14 10,19 13,19 10,24"
            stroke="#FCD34D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )
    case 'fog':
    case 'haze':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <g stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="5" y1="14" x2="19" y2="14" />
            <line x1="7" y1="18" x2="17" y2="18" />
          </g>
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M9 9a3 3 0 115.12 2.12C13.4 11.84 12 12.75 12 14" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.75" fill="#94A3B8" />
        </svg>
      )
  }
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

interface TodayCardProps {
  day: UnifiedDay
}

function TodayCard({ day }: TodayCardProps) {
  const iconType = day.skyIcon ? (day.skyIcon as SkyIconType) : getSkyIconType(day.skyDescription)
  const hasTemp = day.tMaxima !== -999
  const hasUV = day.uvIndex > 0

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <SkyIcon type={iconType} className="h-12 w-12" />
      </div>
      <div className="min-w-0 flex-1">
        {day.skyDescription && (
          <p className="truncate text-sm font-medium capitalize text-gray-800">
            {day.skyDescription}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {hasTemp && (
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{day.tMaxima}°</span>
              {day.tMinima !== -999 && (
                <span className="text-gray-400"> / {day.tMinima}°</span>
              )}
            </span>
          )}
          {day.windSpeed > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {day.windSpeed} km/h {formatWindDirection(day.windDirection)}
            </span>
          )}
          {hasUV && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${uvBadgeClass(day.uvIndex)}`}>
              UV {day.uvIndex}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface ForecastDayCardProps {
  day: UnifiedDay
}

function ForecastDayCard({ day }: ForecastDayCardProps) {
  const iconType = day.skyIcon ? (day.skyIcon as SkyIconType) : getSkyIconType(day.skyDescription)
  const hasTemp = day.tMaxima !== -999

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {formatDayLabel(day.fecha)}
      </span>
      <SkyIcon type={iconType} className="h-7 w-7" />
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
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
      aria-label="Cargando previsión meteorológica"
      aria-busy="true"
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

interface WeatherWidgetProps {
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
      : fetchOpenMeteoWeather({ data: { latitude: coordinates[0], longitude: coordinates[1] } })

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
        className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
        aria-label="Previsión meteorológica"
      >
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          Tiempo
        </h2>
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
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
      aria-label="Previsión meteorológica"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Tiempo</h2>

      <TodayCard day={today} />

      {nextDays.length > 0 && (
        <div className={`mt-4 grid gap-2 ${nextDays.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
