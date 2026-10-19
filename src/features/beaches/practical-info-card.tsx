import type { ReactNode } from 'react'

import {
  AccessDifficultyStyles,
  OccupancyStyles,
  WaterQualityStyles,
} from '@/lib/status-styles'

const OrientationLabels: Record<string, string> = {
  north: 'Norte',
  south: 'Sur',
  east: 'Este',
  west: 'Oeste',
  northeast: 'Noreste',
  northwest: 'Noroeste',
  southeast: 'Sureste',
  southwest: 'Suroeste',
} as const

const SeasonConfig = {
  spring: 'Primavera',
  summer: 'Verano',
  autumn: 'Otoño',
  winter: 'Invierno',
} as const

const OccupancySteps = { low: 1, medium: 2, high: 3 } as const

function SummaryItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3.5">
      <dt className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
        {label}
      </dt>
      <dd className="text-[15px] font-semibold text-gray-900">{children}</dd>
    </div>
  )
}

// Ocean tones instead of red: high occupancy is a fact, not a warning.
function OccupancyMeter({ level }: { level: 'low' | 'medium' | 'high' }) {
  const filled = OccupancySteps[level]
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={`h-2.5 w-2.5 rounded-full ${step <= filled ? 'bg-ocean-500' : 'bg-ocean-100'}`}
          />
        ))}
      </span>
      {OccupancyStyles[level].shortLabel}
    </span>
  )
}

type PracticalInfoCardProps = {
  length?: number
  soilType?: string
  waves?: string
  occupancyLevel?: 'low' | 'medium' | 'high'
  accessDifficulty?: 'easy' | 'moderate' | 'hard'
  childSafe?: boolean
  naturalShade?: boolean
  waterQuality?: 'excellent' | 'good' | 'sufficient' | 'poor'
  bestSeason?: ('spring' | 'summer' | 'autumn' | 'winter')[]
  orientation?: string
}

export function PracticalInfoCard({
  length,
  soilType,
  waves,
  occupancyLevel,
  accessDifficulty,
  childSafe,
  naturalShade,
  waterQuality,
  bestSeason,
  orientation,
}: PracticalInfoCardProps) {
  const hasAnyInfo =
    length !== undefined ||
    soilType ||
    waves ||
    occupancyLevel ||
    accessDifficulty ||
    bestSeason?.length ||
    orientation

  if (!hasAnyInfo) {
    return null
  }

  const hasBadges =
    waterQuality != null ||
    occupancyLevel != null ||
    accessDifficulty != null ||
    childSafe !== undefined

  const details: { label: string; value: string; icon: string }[] = []
  if (length !== undefined)
    details.push({ label: 'Longitud', value: `${length} m`, icon: '📏' })
  if (soilType)
    details.push({ label: 'Tipo de suelo', value: soilType, icon: '🏖' })
  if (waves) details.push({ label: 'Oleaje', value: waves, icon: '🌊' })
  if (orientation)
    details.push({
      label: 'Orientación',
      value: OrientationLabels[orientation] ?? orientation,
      icon: '🧭',
    })
  if (naturalShade !== undefined)
    details.push({
      label: 'Sombra natural',
      value: naturalShade ? 'Sí' : 'No',
      icon: '🌳',
    })
  if (bestSeason && bestSeason.length > 0)
    details.push({
      label: 'Mejor temporada',
      value: bestSeason.map((s) => SeasonConfig[s]).join(', '),
      icon: '☀️',
    })

  return (
    <section
      aria-label="Información práctica"
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Información práctica
      </h2>

      {hasBadges && (
        <dl className="mb-5 grid grid-cols-2 gap-3">
          {waterQuality && (
            <SummaryItem label="Calidad del agua">
              {WaterQualityStyles[waterQuality].label}
            </SummaryItem>
          )}
          {occupancyLevel && (
            <SummaryItem label="Ocupación en verano">
              <OccupancyMeter level={occupancyLevel} />
            </SummaryItem>
          )}
          {accessDifficulty && (
            <SummaryItem label="Acceso">
              {AccessDifficultyStyles[accessDifficulty].label}
            </SummaryItem>
          )}
          {childSafe !== undefined && (
            <SummaryItem label="Apta para niños">
              {childSafe ? 'Sí' : 'No'}
            </SummaryItem>
          )}
        </dl>
      )}

      {details.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between rounded-lg py-2 text-sm font-medium text-gray-600 transition-colors select-none hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none">
            <span>Más detalles</span>
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </summary>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-xl bg-gray-50 px-3.5 py-3">
                <dt className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  {d.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </section>
  )
}
