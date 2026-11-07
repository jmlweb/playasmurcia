import type { BeachFlag } from '@/lib/beach-status-112'

import {
  FlagLabels,
  OFF_SEASON_FLAG_NOTE,
  SeaStateLabels,
  STATUS_SOURCE_URL,
} from '@/lib/beach-status-labels'

import type { BeachStatusState } from './use-beach-status'

type FlagCircleProps = {
  flag: BeachFlag
}

function FlagCircle({ flag }: FlagCircleProps) {
  const colorMap: Record<BeachFlag, string> = {
    VERDE: 'bg-emerald-500',
    AMARILLA: 'bg-yellow-400',
    ROJA: 'bg-red-500',
    'PLAYA CERRADA': 'bg-rose-900',
    'SIN BANDERA': 'bg-gray-300',
  }
  return (
    <span
      aria-label={FlagLabels[flag]}
      className={`inline-block h-5 w-5 flex-shrink-0 rounded-full ${colorMap[flag]}`}
      role="img"
    />
  )
}

function BeachStatusSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Cargando estado de la playa"
      className="rounded-2xl bg-ocean-50 p-5"
    >
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-ocean-200/60" />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-pulse rounded-full bg-ocean-200/60" />
          <div className="h-4 w-28 animate-pulse rounded bg-ocean-200/60" />
        </div>
        <div className="h-3 w-36 animate-pulse rounded bg-ocean-200/60" />
        <div className="h-3 w-24 animate-pulse rounded bg-ocean-200/60" />
      </div>
    </section>
  )
}

type BeachStatusWidgetProps = {
  state: BeachStatusState
}

export function BeachStatusWidget({ state }: BeachStatusWidgetProps) {
  if (state.status === 'idle' || state.status === 'loading') {
    return <BeachStatusSkeleton />
  }

  const isOffSeason =
    state.status === 'success' ? state.data.isOffSeason : !state.isInSeason

  // A line, not a card: otherwise nobody learns flags are seasonal, and an empty
  // card would take room from the forecast for most of the year.
  if (isOffSeason) {
    return <p className="text-sm text-gray-600">{OFF_SEASON_FLAG_NOTE}</p>
  }

  if (state.status === 'notfound') {
    return (
      <p className="text-sm text-gray-600">
        El 112 no publica bandera para esta playa.
      </p>
    )
  }

  // In season silence would read as "no problem", so say the lookup failed
  if (state.status === 'error') {
    return (
      <p className="text-sm text-gray-700">
        No hemos podido consultar la bandera. Compruébala en{' '}
        <a
          className="rounded font-medium text-ocean-700 underline underline-offset-2 hover:text-ocean-800 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          href={STATUS_SOURCE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          112 Región de Murcia
        </a>
        .
      </p>
    )
  }

  const { data } = state

  return (
    <section
      aria-label="Estado de bandera de playa"
      className="rounded-2xl bg-ocean-50 p-5"
    >
      <h2 className="mb-4 text-2xl font-normal tracking-tight text-gray-900">
        Estado de la playa
      </h2>

      <div className="space-y-3">
        {/* Flag */}
        <div className="flex items-center gap-2.5">
          <FlagCircle flag={data.flag} />
          <span className="text-sm font-medium text-gray-800">
            {FlagLabels[data.flag]}
          </span>
        </div>

        {/* Sea state */}
        <div className="flex items-center gap-2.5">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-ocean-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M3 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span className="text-sm text-gray-700">
            {SeaStateLabels[data.seaState]}
          </span>
        </div>

        {/* Last updated */}
        <p className="text-xs text-gray-600">
          Actualizado: {data.date} a las {data.time}
        </p>
      </div>

      <p className="mt-3 text-xs text-gray-600">Fuente: 112 Región de Murcia</p>
    </section>
  )
}
