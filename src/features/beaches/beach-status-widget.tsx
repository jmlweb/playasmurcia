import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type {
  BeachFlag,
  BeachStatus112,
  SeaState,
} from '@/lib/beach-status-112'

// ---------------------------------------------------------------------------
// Server function
// ---------------------------------------------------------------------------

const fetchBeachStatus = createServerFn({ method: 'GET' })
  .inputValidator((data: { beachName: string; municipalityName: string }) => {
    if (typeof data.beachName !== 'string' || !data.beachName.trim()) {
      throw new Error('Invalid beach name')
    }
    if (
      typeof data.municipalityName !== 'string' ||
      !data.municipalityName.trim()
    ) {
      throw new Error('Invalid municipality name')
    }
    return {
      beachName: data.beachName.trim(),
      municipalityName: data.municipalityName.trim(),
    }
  })
  .handler(async ({ data }) => {
    const { getBeachStatus } = await import('@/lib/beach-status-112')
    return getBeachStatus(data.beachName, data.municipalityName)
  })

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

type FlagCircleProps = {
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
      aria-label={FlagLabels[flag]}
      className={`inline-block h-5 w-5 flex-shrink-0 rounded-full ${colorMap[flag]}`}
      role="img"
    />
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function BeachStatusSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Cargando estado de la playa"
      className="border-ocean-100 bg-ocean-50/40 rounded-2xl border p-6 shadow-sm"
    >
      <div className="bg-ocean-200/60 mb-4 h-5 w-40 animate-pulse rounded" />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-ocean-200/60 h-4 w-4 animate-pulse rounded-full" />
          <div className="bg-ocean-200/60 h-4 w-28 animate-pulse rounded" />
        </div>
        <div className="bg-ocean-200/60 h-3 w-36 animate-pulse rounded" />
        <div className="bg-ocean-200/60 h-3 w-24 animate-pulse rounded" />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

type BeachStatusWidgetProps = {
  beachName: string
  municipalityName: string
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'notfound' }
  | { status: 'error' }
  | { status: 'success'; data: BeachStatus112 }

export function BeachStatusWidget({
  beachName,
  municipalityName,
}: BeachStatusWidgetProps) {
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

  // No match from 112 or fetch error — collapse smoothly to avoid layout shift
  if (state.status === 'notfound' || state.status === 'error') {
    return (
      <div
        aria-hidden="true"
        className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out"
      />
    )
  }

  const { data } = state

  if (data.isOffSeason) {
    return (
      <section
        aria-label="Estado de bandera de playa"
        className="border-ocean-200 bg-ocean-50/30 rounded-2xl border border-dashed p-5"
      >
        <h2 className="text-ocean-600 mb-2 text-base font-semibold">
          Estado de la playa
        </h2>
        <p className="text-ocean-400 text-sm">
          Datos no disponibles fuera de temporada
        </p>
        <p className="text-ocean-300 mt-3 text-right text-xs">
          Fuente: 112 Región de Murcia
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Estado de bandera de playa"
      className="border-ocean-100 bg-ocean-50/40 rounded-2xl border p-5 shadow-sm"
    >
      <h2 className="text-ocean-800 mb-4 text-base font-semibold">
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
            className="text-ocean-400 h-5 w-5 flex-shrink-0"
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
          <span className="text-sm text-gray-600">
            {SeaStateLabels[data.seaState]}
          </span>
        </div>

        {/* Last updated */}
        <p className="text-xs text-gray-400">
          Actualizado: {data.date} a las {data.time}
        </p>
      </div>

      <p className="text-ocean-400 mt-3 text-right text-xs">
        Fuente: 112 Región de Murcia
      </p>
    </section>
  )
}
