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

const SeasonConfig = {
  spring: 'Primavera',
  summer: 'Verano',
  autumn: 'Otoño',
  winter: 'Invierno',
} as const

interface PracticalInfoCardProps {
  length?: number
  soilType?: string
  waves?: string
  occupancyLevel?: 'low' | 'medium' | 'high'
  accessDifficulty?: 'easy' | 'moderate' | 'hard'
  childSafe?: boolean
  naturalShade?: boolean
  bestSeason?: Array<'spring' | 'summer' | 'autumn' | 'winter'>
  orientation?: string
}

interface InfoRowProps {
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
      className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
      aria-label="Informacion practica"
    >
      <h2 className="mb-1 text-lg font-semibold text-gray-900">
        Informacion practica
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
            <dt className="text-sm text-gray-500">Apta para ninos</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${childSafe ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200' : 'text-gray-600 bg-gray-50 ring-1 ring-gray-200'}`}
              >
                {childSafe ? 'Si' : 'No'}
              </span>
            </dd>
          </div>
        )}
        {naturalShade !== undefined && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <dt className="text-sm text-gray-500">Sombra natural</dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${naturalShade ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200' : 'text-gray-600 bg-gray-50 ring-1 ring-gray-200'}`}
              >
                {naturalShade ? 'Si' : 'No'}
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
