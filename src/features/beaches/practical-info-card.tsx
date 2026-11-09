import type { ReactNode } from 'react'

import type { WaterQuality, WaterQualitySource } from '@/types/beach'

import { formatBeachLength, formatUsualWaves } from '@/lib/beach-facts'
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

const SOURCE_LABEL = 'EEA / NÁYADE (Ministerio de Sanidad)'

const yesNo = (value: boolean): string => (value ? 'Sí' : 'No')

function WaterQualityCitation({ source }: { source: WaterQualitySource }) {
  return (
    <p className="mt-1 text-sm font-normal text-gray-600">
      Clasificación oficial UE, temporada {source.season}. Fuente:{' '}
      {source.profileUrl ? (
        <a
          className="rounded text-ocean-600 hover:text-ocean-700 hover:underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          href={source.profileUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {SOURCE_LABEL}
        </a>
      ) : (
        SOURCE_LABEL
      )}
    </p>
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

type Fact = { label: string; value: ReactNode; isWide?: boolean }

function FactGroup({ title, facts }: { title: string; facts: Fact[] }) {
  if (facts.length === 0) return null

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={`border-t border-gray-200 pt-2 ${fact.isWide ? 'col-span-full' : ''}`}
          >
            <dt className="text-sm text-gray-600">{fact.label}</dt>
            <dd className="mt-0.5 font-medium text-gray-900 tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

type PracticalInfoCardProps = {
  /** Length shown: ITREM when published, OSM otherwise (see getDisplayLength) */
  length?: number
  /** True when `length` comes from the ITREM sheet */
  isOfficialLength?: boolean
  /** Average width published by ITREM, already formatted */
  width?: string
  soilType?: string
  waves?: string
  occupancyLevel?: 'low' | 'medium' | 'high'
  accessDifficulty?: 'easy' | 'moderate' | 'hard'
  childSafe?: boolean
  naturalShade?: boolean
  lifeguard?: boolean
  dogFriendly?: boolean
  waterQuality?: WaterQuality
  waterQualitySource?: WaterQualitySource
  bestSeason?: ('spring' | 'summer' | 'autumn' | 'winter')[]
  orientation?: string
}

export function PracticalInfoCard({
  length,
  isOfficialLength = false,
  width,
  soilType,
  waves,
  occupancyLevel,
  accessDifficulty,
  childSafe,
  naturalShade,
  lifeguard,
  dogFriendly,
  waterQuality,
  waterQualitySource,
  bestSeason,
  orientation,
}: PracticalInfoCardProps) {
  const usualWaves = formatUsualWaves(waves)

  const beforeGoing: Fact[] = [
    ...(lifeguard === undefined
      ? []
      : [{ label: 'Socorrista en temporada', value: yesNo(lifeguard) }]),
    ...(accessDifficulty
      ? [
          {
            label: 'Acceso',
            value: AccessDifficultyStyles[accessDifficulty].label,
          },
        ]
      : []),
    ...(childSafe === undefined
      ? []
      : [{ label: 'Apta para niños', value: yesNo(childSafe) }]),
    ...(dogFriendly === undefined
      ? []
      : [{ label: 'Se admiten perros', value: yesNo(dogFriendly) }]),
    ...(naturalShade === undefined
      ? []
      : [{ label: 'Sombra natural', value: yesNo(naturalShade) }]),
    ...(occupancyLevel
      ? [
          {
            label: 'Ocupación en verano',
            value: <OccupancyMeter level={occupancyLevel} />,
          },
        ]
      : []),
    ...(waterQuality
      ? [
          {
            label: 'Calidad del agua',
            isWide: true,
            value: (
              <>
                {WaterQualityStyles[waterQuality].label}
                {waterQualitySource && (
                  <WaterQualityCitation source={waterQualitySource} />
                )}
              </>
            ),
          },
        ]
      : []),
  ]

  const theBeach: Fact[] = [
    ...(length === undefined
      ? []
      : [
          {
            label: 'Longitud',
            value: isOfficialLength
              ? `${formatBeachLength(length)} (ITREM)`
              : formatBeachLength(length),
          },
        ]),
    ...(width ? [{ label: 'Anchura media', value: `${width} (ITREM)` }] : []),
    ...(soilType ? [{ label: 'Suelo', value: soilType }] : []),
    ...(usualWaves ? [{ label: 'Oleaje habitual', value: usualWaves }] : []),
    ...(orientation
      ? [
          {
            label: 'Orientación',
            value: OrientationLabels[orientation] ?? orientation,
          },
        ]
      : []),
    ...(bestSeason && bestSeason.length > 0
      ? [
          {
            label: 'Mejor temporada',
            value: bestSeason.map((s) => SeasonConfig[s]).join(', '),
          },
        ]
      : []),
  ]

  if (beforeGoing.length === 0 && theBeach.length === 0) {
    return null
  }

  return (
    <section aria-label="Información práctica">
      <h2 className="mb-6 text-3xl font-normal tracking-tight text-gray-900">
        Información práctica
      </h2>
      <div className="space-y-8">
        <FactGroup facts={beforeGoing} title="Antes de ir" />
        <FactGroup facts={theBeach} title="La playa" />
      </div>
    </section>
  )
}
