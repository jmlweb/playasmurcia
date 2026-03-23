const OccupancyConfig = {
  low: { label: "Baja", colorClass: "text-green-700 bg-green-50" },
  medium: { label: "Media", colorClass: "text-yellow-700 bg-yellow-50" },
  high: { label: "Alta", colorClass: "text-red-700 bg-red-50" },
} as const

const SeasonConfig = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
} as const

interface PracticalInfoCardProps {
  length?: number
  soilType?: string
  waves?: string
  occupancyLevel?: "low" | "medium" | "high"
  bestSeason?: Array<"spring" | "summer" | "autumn" | "winter">
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
      <dd className={`text-right text-sm font-medium text-gray-900 ${valueClass ?? ""}`}>
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
  bestSeason,
  orientation,
}: PracticalInfoCardProps) {
  const hasAnyInfo = length !== undefined || soilType || waves || occupancyLevel || bestSeason?.length || orientation

  if (!hasAnyInfo) {
    return null
  }

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white p-5"
      aria-label="Información práctica"
    >
      <h2 className="mb-1 text-xl font-semibold text-gray-900">Información práctica</h2>
      <dl>
        {length !== undefined && (
          <InfoRow label="Longitud" value={`${length} m`} />
        )}
        {soilType && (
          <InfoRow label="Tipo de suelo" value={soilType} />
        )}
        {waves && (
          <InfoRow label="Oleaje" value={waves} />
        )}
        {orientation && (
          <InfoRow label="Orientación" value={orientation} />
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
        {bestSeason && bestSeason.length > 0 && (
          <InfoRow
            label="Mejor temporada"
            value={bestSeason.map((s) => SeasonConfig[s]).join(", ")}
          />
        )}
      </dl>
    </section>
  )
}
