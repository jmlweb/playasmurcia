import { useEffect, useId, useRef, useState } from 'react'

import type { BeachSearchParams } from '@/lib/beach-filters'

import { ChevronDownIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

type SortOption = NonNullable<BeachSearchParams['sort']>

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recomendados', label: 'Recomendados' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'municipality', label: 'Municipio' },
  { value: 'length', label: 'Longitud' },
  { value: 'occupancy', label: 'Ocupación' },
  { value: 'cercania', label: 'Cerca de mí' },
]

type SortSelectProps = {
  value: SortOption
  onChange: (value: SortOption) => void
  /** Offer "Cerca de mí"; only pages that can resolve the user's position should */
  includeNearby?: boolean
}

export function SortSelect({
  value,
  onChange,
  includeNearby = false,
}: SortSelectProps) {
  const options = SORT_OPTIONS.filter(
    (o) => includeNearby || o.value !== 'cercania',
  )
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const labelId = useId()
  const triggerId = useId()
  const currentLabel =
    options.find((o) => o.value === value)?.label ?? 'Nombre A-Z'

  // Reset focus during render (not in an effect) to avoid a cascading re-render
  const [prevOpen, setPrevOpen] = useState(open)
  const [prevValue, setPrevValue] = useState(value)
  if (open !== prevOpen || value !== prevValue) {
    setPrevOpen(open)
    setPrevValue(value)
    // Focus the currently selected item (or first) when opening
    const activeIndex = options.findIndex((o) => o.value === value)
    setFocusedIndex(open ? Math.max(activeIndex, 0) : -1)
  }

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
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, value])

  // Keep DOM focus in sync with focusedIndex
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listRef.current) return
    const items =
      listRef.current.querySelectorAll<HTMLElement>('[role="option"]')
    items[focusedIndex].focus()
  }, [open, focusedIndex])

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setFocusedIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setFocusedIndex(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (focusedIndex >= 0) {
        onChange(options[focusedIndex].value)
        setOpen(false)
        triggerRef.current?.focus()
      }
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm whitespace-nowrap text-gray-500" id={labelId}>
          Ordenar por
        </span>
        <button
          ref={triggerRef}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={`${labelId} ${triggerId}`}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white py-2 pr-3 pl-3.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 focus-visible:border-ocean-400 focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:outline-none pointer-coarse:min-h-11"
          id={triggerId}
          type="button"
          onClick={() => {
            setOpen((prev) => !prev)
          }}
        >
          {currentLabel}
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 text-gray-500 transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>
      </div>
      {open && (
        <ul
          ref={listRef}
          aria-labelledby={labelId}
          className="absolute right-0 z-20 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
          onKeyDown={handleListKeyDown}
        >
          {options.map((option) => (
            <li
              key={option.value}
              aria-selected={option.value === value}
              className={cn(
                'focus-visible:ring-ocean-500 cursor-pointer px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset pointer-coarse:flex pointer-coarse:min-h-11 pointer-coarse:items-center',
                option.value === value
                  ? 'bg-ocean-50 text-ocean-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50',
              )}
              role="option"
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
