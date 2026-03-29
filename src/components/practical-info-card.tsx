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

type InfoRowProps = {
  label: string
  value: string
  valueClass?: string
}

function InfoRow({ label, value, valueClass }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd
        className={`text-right text-sm font-medium text-gray-900 ${valueClass ?? ''}`}
      >
        {value}
      </dd>
    </div>
  )
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

  return (
    <section
      aria-label="Información práctica"
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Información práctica
      </h2>
      <dl>
        {length !== undefined && (
          <InfoRow label="Longitud" value={`${length} m`} />
        )}
        {soilType && <InfoRow label="Tipo de suelo" value={soilType} />}
        {waves && <InfoRow label="Oleaje" value={waves} />}
        {orientation && <InfoRow label="Orientación" value={orientation} />}
        {accessDifficulty && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Dificultad de acceso</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AccessDifficultyConfig[accessDifficulty].colorClass}`}
              >
                {AccessDifficultyConfig[accessDifficulty].label}
              </span>
            </dd>
          </div>
        )}
        {occupancyLevel && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Ocupación habitual</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${OccupancyConfig[occupancyLevel].colorClass}`}
              >
                {OccupancyConfig[occupancyLevel].label}
              </span>
            </dd>
          </div>
        )}
        {childSafe !== undefined && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Apta para niños</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${childSafe ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}
              >
                {childSafe ? 'Sí' : 'No'}
              </span>
            </dd>
          </div>
        )}
        {naturalShade !== undefined && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Sombra natural</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${naturalShade ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}
              >
                {naturalShade ? 'Sí' : 'No'}
              </span>
            </dd>
          </div>
        )}
        {waterQuality && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Calidad del agua</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${WaterQualityConfig[waterQuality].colorClass}`}
              >
                {WaterQualityConfig[waterQuality].label}
              </span>
            </dd>
          </div>
        )}
        {bestSeason && bestSeason.length > 0 && (
          <InfoRow
            label="Mejor temporada"
            value={bestSeason.map((s) => SeasonConfig[s]).join(', ')}
          />
        )}
      </dl>
    </section>
  )
}
