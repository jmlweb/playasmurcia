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

const OccupancyConfig = {
  low: {
    label: 'Baja',
    colorClass: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
  },
  medium: {
    label: 'Media',
    colorClass: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  high: {
    label: 'Alta',
    colorClass: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
} as const

const AccessDifficultyConfig = {
  easy: {
    label: 'Fácil',
    colorClass: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
  },
  moderate: {
    label: 'Moderado',
    colorClass: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  hard: {
    label: 'Difícil',
    colorClass: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
} as const

const WaterQualityConfig = {
  excellent: {
    label: 'Excelente',
    colorClass: 'text-blue-700 bg-blue-50 ring-1 ring-blue-200',
  },
  good: {
    label: 'Buena',
    colorClass: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
  },
  sufficient: {
    label: 'Suficiente',
    colorClass: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  poor: {
    label: 'Insuficiente',
    colorClass: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
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

  const details: { label: string; value: string }[] = []
  if (length !== undefined)
    details.push({ label: 'Longitud', value: `${length} m` })
  if (soilType) details.push({ label: 'Tipo de suelo', value: soilType })
  if (waves) details.push({ label: 'Oleaje', value: waves })
  if (orientation)
    details.push({
      label: 'Orientación',
      value: OrientationLabels[orientation] ?? orientation,
    })
  if (naturalShade !== undefined)
    details.push({ label: 'Sombra natural', value: naturalShade ? 'Sí' : 'No' })
  if (bestSeason && bestSeason.length > 0)
    details.push({
      label: 'Mejor temporada',
      value: bestSeason.map((s) => SeasonConfig[s]).join(', '),
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
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="mb-1.5 text-xs text-gray-500">Calidad del agua</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${WaterQualityConfig[waterQuality].colorClass}`}
              >
                {WaterQualityConfig[waterQuality].label}
              </span>
            </div>
          )}
          {occupancyLevel && (
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="mb-1.5 text-xs text-gray-500">Ocupación habitual</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${OccupancyConfig[occupancyLevel].colorClass}`}
              >
                {OccupancyConfig[occupancyLevel].label}
              </span>
            </div>
          )}
          {accessDifficulty && (
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="mb-1.5 text-xs text-gray-500">Acceso</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${AccessDifficultyConfig[accessDifficulty].colorClass}`}
              >
                {AccessDifficultyConfig[accessDifficulty].label}
              </span>
            </div>
          )}
          {childSafe !== undefined && (
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="mb-1.5 text-xs text-gray-500">Apta para niños</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${childSafe ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'}`}
              >
                {childSafe ? 'Sí' : 'No'}
              </span>
            </div>
          )}
        </div>
      )}

      {details.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          {details.map((d) => (
            <div key={d.label}>
              <dt className="text-xs text-gray-500">{d.label}</dt>
              <dd className="text-sm font-medium text-gray-900">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
