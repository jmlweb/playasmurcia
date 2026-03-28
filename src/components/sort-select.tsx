'use client'

import { useEffect, useRef, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

type SortOption = NonNullable<BeachSearchParams['sort']>

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'municipality', label: 'Municipio' },
  { value: 'length', label: 'Longitud' },
  { value: 'occupancy', label: 'Ocupación' },
]

type SortSelectProps = {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Nombre A-Z'

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap text-gray-500">
          Ordenar por
        </span>
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          className="focus:border-ocean-400 focus:ring-ocean-400 flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white py-2 pr-3 pl-3.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 focus:ring-2 focus:outline-none"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
        >
          {currentLabel}
          <svg
            aria-hidden="true"
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>
      {open && (
        <ul
          className="absolute right-0 z-20 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {SORT_OPTIONS.map((option) => (
            <li
              key={option.value}
              aria-selected={option.value === value}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                option.value === value
                  ? 'bg-ocean-50 text-ocean-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="option"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
