'use client'

import type { BeachSearchParams } from "@/lib/beach-filters"

type SortOption = NonNullable<BeachSearchParams["sort"]>

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "name", label: "Nombre A-Z" },
  { value: "municipality", label: "Municipio" },
  { value: "length", label: "Longitud" },
  { value: "occupancy", label: "Ocupación" },
]

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">
        Ordenar por
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
