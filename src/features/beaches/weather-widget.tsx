import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { WeatherIconType } from '@/components/ui/icons'
import type {
  BeachForecast,
  ForecastDay,
  ForecastWaves,
} from '@/lib/forecast-days'
import type { WaveExposure } from '@/lib/wave-exposure'

import { WeatherIcon } from '@/components/ui/icons'
import { formatCompassDirection } from '@/lib/beach-facts'
import { ForecastSourceLabel } from '@/lib/forecast-days'
import { formatWaveHeight, getWaveLevel } from '@/lib/wave-level'

import { parseBeachCodeInput } from './beach-code-input'

const fetchBeachForecastFn = createServerFn({ method: 'GET' })
  .validator(parseBeachCodeInput)
  .handler(async ({ data }) => {
    const [{ getBeachWeatherTargets }, { fetchBeachForecast }] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/beach-forecast'),
      ])
    const target = (await getBeachWeatherTargets([data.code])).at(0)
    return target ? fetchBeachForecast(target) : null
  })

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
const FullDayNames = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
] as const

// `fecha` is UTC midnight of the Madrid calendar day (see open-meteo.ts and
// aemet.ts). The widget renders in the visitor's browser, so the local getters
// would shift the weekday back one day west of UTC.
export function getForecastWeekday(timestamp: number): number {
  return new Date(timestamp).getUTCDay()
}

export function formatDayLabel(timestamp: number): string {
  return DayNames[getForecastWeekday(timestamp)]
}

export function formatFullDayName(timestamp: number): string {
  return FullDayNames[getForecastWeekday(timestamp)]
}

export function isWeekend(timestamp: number): boolean {
  return [0, 6].includes(getForecastWeekday(timestamp))
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const WaveExposureLabels: Record<WaveExposure, string> = {
  expuesta: 'Llega de frente a la playa',
  resguardada: 'No llega de frente a la playa',
}

function WavesLine({
  day,
  waves,
}: {
  day: ForecastDay
  waves?: ForecastWaves
}) {
  const height = waves?.height
  const level =
    day.wavesDescription?.toLowerCase() ??
    (height != null ? getWaveLevel(height) : undefined)
  if (level == null) return null

  return (
    <p className="col-span-2 text-sm text-gray-700">
      Oleaje hoy: {level}
      {height != null && `, ${formatWaveHeight(height)} m`}
      {waves?.direction &&
        ` del ${formatCompassDirection(waves.direction).toLowerCase()}`}
      {waves?.exposure && (
        <span className="block text-gray-600">
          {WaveExposureLabels[waves.exposure]}
        </span>
      )}
    </p>
  )
}

type TodayCardProps = {
  day: ForecastDay
  forecast: BeachForecast
}

// The hero already says what it is like now, so this block adds the day ahead
function TodayCard({ day, forecast }: TodayCardProps) {
  const { current, waterTemp, waves } = forecast
  const iconType = day.skyIcon
    ? (day.skyIcon as WeatherIconType)
    : getSkyIconType(day.skyDescription)
  const uvIndex = day.uvIndex ?? 0
  const windSpeed = day.windSpeed ?? 0

  return (
    <div>
      <p className="text-sm font-semibold text-ocean-700">
        Hoy, {formatFullDayName(day.fecha)}
      </p>
      <div className="mt-1 flex items-center gap-4">
        <WeatherIcon className="h-12 w-12 flex-shrink-0" type={iconType} />
        <div className="tabular-nums">
          {day.tMaxima !== undefined && (
            <p className="text-3xl font-light tracking-tight text-gray-900">
              {day.tMaxima}°
              {day.tMinima !== undefined && (
                <span className="text-lg text-gray-600"> / {day.tMinima}°</span>
              )}
            </p>
          )}
          {day.skyDescription && (
            <p className="text-sm text-gray-600 first-letter:uppercase">
              {day.skyDescription}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 items-center gap-x-4 gap-y-1.5 border-t border-ocean-200/60 pt-3 text-sm text-gray-700 tabular-nums">
        {current && <span>Sensación {current.apparentTemp}°</span>}
        {windSpeed > 0 && (
          <span>
            Viento hasta {windSpeed} km/h
            {day.windDirection &&
              ` del ${formatCompassDirection(day.windDirection).toLowerCase()}`}
          </span>
        )}
        {waterTemp != null && <span>Agua {waterTemp}°</span>}
        {uvIndex > 0 && <span>UV {uvIndex}</span>}
        <WavesLine day={day} waves={waves} />
      </div>
    </div>
  )
}

type ForecastDayCardProps = {
  day: ForecastDay
}

function ForecastDayCard({ day }: ForecastDayCardProps) {
  const iconType = day.skyIcon
    ? (day.skyIcon as WeatherIconType)
    : getSkyIconType(day.skyDescription)
  const rain = day.precipitationProbability ?? 0
  const isWeekendDay = isWeekend(day.fecha)

  return (
    <li className="flex min-w-0 flex-col items-center gap-1 text-center tabular-nums">
      <span
        className={`text-xs ${isWeekendDay ? 'font-semibold text-ocean-700' : 'font-medium text-gray-600'}`}
      >
        {formatDayLabel(day.fecha)}
      </span>
      <WeatherIcon className="h-6 w-6" type={iconType} />
      {day.tMaxima !== undefined && (
        <span className="text-sm font-semibold text-gray-900">
          {day.tMaxima}°
        </span>
      )}
      {day.tMinima !== undefined && (
        <span className="text-[13px] text-gray-600">{day.tMinima}°</span>
      )}
      {rain > 0 && (
        <span className="flex items-center gap-0.5 text-[13px] text-ocean-700">
          <svg
            aria-hidden="true"
            className="h-3 w-3 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3s7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 7-12 7-12Z" />
          </svg>
          <span className="sr-only">Lluvia </span>
          {rain}%
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
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; forecast: BeachForecast }

export function WeatherWidget({ beachCode }: WeatherWidgetProps) {
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

    fetchBeachForecastFn({ data: { code: beachCode } })
      .then((forecast) => {
        if (cancelled) return
        setState(
          forecast ? { status: 'success', forecast } : { status: 'error' },
        )
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [beachCode, attempt])

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

      <TodayCard day={today} forecast={forecast} />

      {nextDays.length > 0 && (
        <ul className="mt-4 grid auto-cols-fr grid-flow-col gap-1 border-t border-ocean-200/60 pt-3">
          {nextDays.map((day) => (
            <ForecastDayCard key={day.fecha} day={day} />
          ))}
        </ul>
      )}

      <footer className="mt-3">
        <p className="text-[13px] text-gray-600">
          Fuente: {ForecastSourceLabel[forecast.source]}
          {forecast.observedAt &&
            ` · Datos de las ${forecast.observedAt.slice(11, 16)}`}
        </p>
      </footer>
    </section>
  )
}
