import { useMemo } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { type FilterLookups, listActiveFilters } from '@/lib/active-filters'

type ActiveFilterChipsProps = FilterLookups & {
  /** Hidden when another control on the page already offers the reset */
  showClearAll?: boolean
  filters: BeachSearchParams
  onUpdateFilters: (next: BeachSearchParams) => void
  onClearAll: () => void
}

export function ActiveFilterChips({
  showClearAll = true,
  filters,
  municipalities,
  seas,
  services,
  activities,
  tags,
  onUpdateFilters,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips = useMemo(
    () =>
      listActiveFilters(filters, {
        municipalities,
        seas,
        services,
        activities,
        tags,
      }),
    [filters, municipalities, seas, services, activities, tags],
  )

  if (chips.length === 0) return null

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          aria-label={`Quitar ${chip.label}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 px-3 py-1 text-sm text-ocean-700 transition-colors hover:bg-ocean-100 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none pointer-coarse:min-h-11 pointer-coarse:px-4"
          type="button"
          onClick={() => {
            onUpdateFilters(chip.without)
          }}
        >
          {chip.label}
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      ))}
      {showClearAll && (
        <button
          className="rounded-full text-sm text-gray-600 underline underline-offset-2 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none pointer-coarse:min-h-11 pointer-coarse:px-3"
          type="button"
          onClick={onClearAll}
        >
          Limpiar todo
        </button>
      )}
    </div>
  )
}
