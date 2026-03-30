import { cn } from '@/lib/cn'
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
        <div className="mb-5 grid grid-cols-2 gap-3">
          {waterQuality && (
            <div className="rounded-xl bg-gray-50 p-3.5">
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Calidad del agua
              </p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${WaterQualityStyles[waterQuality].subtle}`}
              >
                {WaterQualityStyles[waterQuality].label}
              </span>
            </div>
          )}
          {occupancyLevel && (
            <div className="rounded-xl bg-gray-50 p-3.5">
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Ocupación
              </p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${OccupancyStyles[occupancyLevel].subtle}`}
              >
                {OccupancyStyles[occupancyLevel].shortLabel}
              </span>
            </div>
          )}
          {accessDifficulty && (
            <div className="rounded-xl bg-gray-50 p-3.5">
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Acceso
              </p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${AccessDifficultyStyles[accessDifficulty].subtle}`}
              >
                {AccessDifficultyStyles[accessDifficulty].label}
              </span>
            </div>
          )}
          {childSafe !== undefined && (
            <div className="rounded-xl bg-gray-50 p-3.5">
              <p className="mb-1.5 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Apta para niños
              </p>
              <span
                className={cn(
                  'inline-block rounded-full px-3 py-1 text-sm font-semibold',
                  childSafe
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
                )}
              >
                {childSafe ? 'Sí' : 'No'}
              </span>
            </div>
          )}
        </div>
      )}

      {details.length > 0 && (
        <details className="group">
          <summary className="focus-visible:ring-ocean-500 flex cursor-pointer items-center justify-between rounded-lg py-2 text-sm font-medium text-gray-600 transition-colors select-none hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
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
