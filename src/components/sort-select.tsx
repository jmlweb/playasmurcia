import { useEffect, useRef, useState } from 'react'

import { ChevronDownIcon } from '@/components/icons'
import type { BeachSearchParams } from '@/lib/beach-filters'

type SortOption = NonNullable<BeachSearchParams['sort']>

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recomendados', label: 'Recomendados' },
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
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Nombre A-Z'

  useEffect(() => {
    if (!open) {
      setFocusedIndex(-1)
      return
    }

    // Focus the currently selected item (or first) when opening
    const activeIndex = SORT_OPTIONS.findIndex((o) => o.value === value)
    const initialIndex = activeIndex >= 0 ? activeIndex : 0
    setFocusedIndex(initialIndex)

    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, value])

  // Keep DOM focus in sync with focusedIndex
  useEffect(() => {
    if (!open || focusedIndex < 0 || !menuRef.current) return
    const items =
      menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
    items[focusedIndex].focus()
  }, [open, focusedIndex])

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % SORT_OPTIONS.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(
        (prev) => (prev - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length,
      )
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (focusedIndex >= 0) {
        onChange(SORT_OPTIONS[focusedIndex].value)
        setOpen(false)
        triggerRef.current?.focus()
      }
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap text-gray-500">
          Ordenar por
        </span>
        <button
          ref={triggerRef}
          aria-expanded={open}
          aria-haspopup="menu"
          className="focus-visible:border-ocean-400 focus-visible:ring-ocean-400 flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white py-2 pr-3 pl-3.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 focus-visible:ring-2 focus-visible:outline-none"
          type="button"
          onClick={() => {
            setOpen((prev) => !prev)
          }}
        >
          {currentLabel}
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {open && (
        <ul
          ref={menuRef}
          className="absolute right-0 z-20 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {SORT_OPTIONS.map((option) => (
            <li
              key={option.value}
              aria-current={option.value === value ? true : undefined}
              className={`focus-visible:ring-ocean-500 cursor-pointer px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset ${
                option.value === value
                  ? 'bg-ocean-50 text-ocean-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
                triggerRef.current?.focus()
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
