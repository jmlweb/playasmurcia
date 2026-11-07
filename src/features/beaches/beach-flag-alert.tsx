import type { BeachFlag } from '@/lib/beach-status-112'

import { SeaStateLabels } from '@/lib/beach-status-labels'

import type { BeachStatusState } from './use-beach-status'

const AlertTitles: Partial<Record<BeachFlag, string>> = {
  ROJA: 'Bandera roja: baño prohibido',
  'PLAYA CERRADA': 'Playa cerrada',
}

type BeachFlagAlertProps = {
  state: BeachStatusState
  hasNearbyBeaches: boolean
}

// The one fact that can reverse the decision, so it goes above the directions
export function BeachFlagAlert({
  state,
  hasNearbyBeaches,
}: BeachFlagAlertProps) {
  if (state.status !== 'success' || state.data.isOffSeason) return null

  const { flag, seaState, date, time } = state.data
  const title = AlertTitles[flag]
  if (!title) return null

  return (
    <div
      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
      role="alert"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-0.5">
        {SeaStateLabels[seaState]}. Actualizado: {date} a las {time}. Fuente:
        112 Región de Murcia.
      </p>
      {hasNearbyBeaches && (
        <a
          className="mt-1 inline-flex min-h-11 items-center rounded font-semibold underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:outline-none"
          href="#playas-cercanas"
        >
          Ver playas cercanas
        </a>
      )}
    </div>
  )
}
