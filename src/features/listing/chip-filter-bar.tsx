import type { ReactNode } from 'react'

import {
  AccessDifficultyLabels,
  type BeachSearchParams,
  countActiveFilters,
  NeedFilterKeys,
  NeedFilterLabels,
  OccupancyLabels,
} from '@/lib/beach-filters'

import { FilterChip, toggleValue } from './filter-controls'

type ChipFilterBarProps = {
  filters: BeachSearchParams
  onChange: (filters: BeachSearchParams) => void
}

function ChipGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
      role="group"
    >
      <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

// Horizontal counterpart of the explorer sidebar for pages whose beaches are
// already scoped (e.g. one municipality), so it has no Municipio group.
export function ChipFilterBar({ filters, onChange }: ChipFilterBarProps) {
  const activeCount = countActiveFilters(filters)

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200/60">
      <ChipGroup label="Acceso">
        {(
          Object.keys(
            AccessDifficultyLabels,
          ) as (keyof typeof AccessDifficultyLabels)[]
        ).map((level) => (
          <FilterChip
            key={level}
            label={AccessDifficultyLabels[level]}
            pressed={(filters.accessDifficulty ?? []).includes(level)}
            onToggle={() => {
              onChange({
                ...filters,
                accessDifficulty: toggleValue(filters.accessDifficulty, level),
              })
            }}
          />
        ))}
      </ChipGroup>
      <ChipGroup label="Ocupación">
        {(Object.keys(OccupancyLabels) as (keyof typeof OccupancyLabels)[]).map(
          (level) => (
            <FilterChip
              key={level}
              label={OccupancyLabels[level]}
              pressed={(filters.occupancy ?? []).includes(level)}
              onToggle={() => {
                onChange({
                  ...filters,
                  occupancy: toggleValue(filters.occupancy, level),
                })
              }}
            />
          ),
        )}
      </ChipGroup>
      <ChipGroup label="Necesidades">
        {NeedFilterKeys.map((key) => (
          <FilterChip
            key={key}
            label={NeedFilterLabels[key]}
            pressed={Boolean(filters[key])}
            onToggle={() => {
              onChange({ ...filters, [key]: filters[key] ? undefined : true })
            }}
          />
        ))}
      </ChipGroup>
      {activeCount > 0 && (
        <button
          className="self-start rounded text-sm text-ocean-600 underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          type="button"
          onClick={() => {
            onChange({})
          }}
        >
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  )
}
