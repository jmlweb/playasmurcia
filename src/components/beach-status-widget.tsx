import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import type { BeachStatus112, BeachFlag, SeaState } from '@/lib/beach-status-112'

// ---------------------------------------------------------------------------
// Server function
// ---------------------------------------------------------------------------

const fetchBeachStatus = createServerFn({ method: 'GET' }).handler(
  async (ctx: { data: { beachName: string; municipalityName: string } }) => {
    const { getBeachStatus } = await import('@/lib/beach-status-112')
    return getBeachStatus(ctx.data.beachName, ctx.data.municipalityName)
  },
)

// ---------------------------------------------------------------------------
// Flag helpers
// ---------------------------------------------------------------------------

const FlagLabels: Record<BeachFlag, string> = {
  VERDE: 'Bandera verde',
  AMARILLA: 'Bandera amarilla',
  ROJA: 'Bandera roja',
  'SIN BANDERA': 'Sin bandera',
}

const SeaStateLabels: Record<SeaState, string> = {
  BUENO: 'Mar en calma',
  REGULAR: 'Mar moderado',
  MALO: 'Mar agitado',
  'SIN ESTADO': 'Estado desconocido',
}

interface FlagCircleProps {
  flag: BeachFlag
}

function FlagCircle({ flag }: FlagCircleProps) {
  const colorMap: Record<BeachFlag, string> = {
    VERDE: 'bg-emerald-500',
    AMARILLA: 'bg-yellow-400',
    ROJA: 'bg-red-500',
    'SIN BANDERA': 'bg-gray-300',
  }
  return (
    <span
      className={`inline-block h-4 w-4 flex-shrink-0 rounded-full ${colorMap[flag]}`}
      role="img"
      aria-label={FlagLabels[flag]}
    />
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function BeachStatusSkeleton() {
  return (
    <section
      className="rounded-2xl border border-ocean-100 bg-ocean-50/40 p-6 shadow-sm"
      aria-label="Cargando estado de la playa"
      aria-busy="true"
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

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

interface BeachStatusWidgetProps {
  beachName: string
  municipalityName: string
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'notfound' }
  | { status: 'error' }
  | { status: 'success'; data: BeachStatus112 }

export function BeachStatusWidget({ beachName, municipalityName }: BeachStatusWidgetProps) {
  const [state, setState] = useState<FetchState>({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetchBeachStatus({ data: { beachName, municipalityName } })
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setState({ status: 'notfound' })
        } else {
          setState({ status: 'success', data })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [beachName, municipalityName])

  if (state.status === 'idle' || state.status === 'loading') {
    return <BeachStatusSkeleton />
  }

  // No match from 112 or fetch error — render nothing rather than an error card
  if (state.status === 'notfound' || state.status === 'error') {
    return null
  }

  const { data } = state

  if (data.isOffSeason) {
    return (
      <section
        className="rounded-2xl border border-ocean-100 bg-ocean-50/40 p-5 shadow-sm"
        aria-label="Estado de bandera de playa"
      >
        <h2 className="mb-2 text-base font-semibold text-ocean-800">
          Estado de la playa
        </h2>
        <p className="text-sm text-ocean-500/80">
          Datos no disponibles fuera de temporada
        </p>
        <p className="mt-3 text-right text-xs text-ocean-400">
          Fuente: 112 Region de Murcia
        </p>
      </section>
    )
  }

  return (
    <section
      className="rounded-2xl border border-ocean-100 bg-ocean-50/40 p-5 shadow-sm"
      aria-label="Estado de bandera de playa"
    >
      <h2 className="mb-4 text-base font-semibold text-ocean-800">
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
            className="h-4 w-4 flex-shrink-0 text-ocean-400"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm text-gray-600">
            {SeaStateLabels[data.seaState]}
          </span>
        </div>

        {/* Last updated */}
        <p className="text-xs text-gray-400">
          Actualizado: {data.date} a las {data.time}
        </p>
      </div>

      <p className="mt-3 text-right text-xs text-ocean-400">
        Fuente: 112 Region de Murcia
      </p>
    </section>
  )
}
