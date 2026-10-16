import { useMemo } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'
import type { Activity, Municipality, Sea, Service, Tag } from '@/types/beach'

type ActiveFilterChipsProps = {
  filters: BeachSearchParams
  municipalities: Municipality[]
  seas: Sea[]
  services: Service[]
  activities: Activity[]
  tags: Tag[]
  onUpdateFilters: (next: BeachSearchParams) => void
  onClearAll: () => void
}

export function ActiveFilterChips({
  filters,
  municipalities,
  seas,
  services,
  activities,
  tags,
  onUpdateFilters,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips = useMemo(() => {
    const result: { key: string; label: string; onRemove: () => void }[] = []
    if (filters.municipality) {
      for (const i of filters.municipality) {
        const m = municipalities[i]
        if (m)
          result.push({
            key: `m-${i}`,
            label: m.name,
            onRemove: () => {
              onUpdateFilters({
                ...filters,
                municipality: filters.municipality?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.sea) {
      for (const i of filters.sea) {
        const s = seas[i]
        if (s)
          result.push({
            key: `s-${i}`,
            label: s.name,
            onRemove: () => {
              onUpdateFilters({
                ...filters,
                sea: filters.sea?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.services) {
      for (const i of filters.services) {
        const s = services[i]
        if (s)
          result.push({
            key: `sv-${i}`,
            label: s.name,
            onRemove: () => {
              onUpdateFilters({
                ...filters,
                services: filters.services?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.activities) {
      for (const i of filters.activities) {
        const a = activities[i]
        if (a)
          result.push({
            key: `a-${i}`,
            label: a.name,
            onRemove: () => {
              onUpdateFilters({
                ...filters,
                activities: filters.activities?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    if (filters.tags) {
      for (const i of filters.tags) {
        const t = tags[i]
        if (t)
          result.push({
            key: `t-${i}`,
            label: t.name,
            onRemove: () => {
              onUpdateFilters({
                ...filters,
                tags: filters.tags?.filter((v) => v !== i),
              })
            },
          })
      }
    }
    return result
  }, [
    filters,
    municipalities,
    seas,
    services,
    activities,
    tags,
    onUpdateFilters,
  ])

  if (chips.length === 0) return null

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 px-3 py-1 text-sm text-ocean-700 transition-colors hover:bg-ocean-100 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none"
          type="button"
          onClick={chip.onRemove}
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
      <button
        className="rounded-full text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none"
        type="button"
        onClick={onClearAll}
      >
        Limpiar todo
      </button>
    </div>
  )
}
