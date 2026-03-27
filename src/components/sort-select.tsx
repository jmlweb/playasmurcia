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
      <label htmlFor="sort-select" className="text-sm text-gray-500 whitespace-nowrap">
        Ordenar por
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer rounded-full border border-gray-200 bg-white py-2 pr-8 pl-3.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-400 focus:outline-none"
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
