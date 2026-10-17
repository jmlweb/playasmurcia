import { type ReactNode, useEffect, useRef, useState } from 'react'

import type { Activity, Municipality, Sea, Service, Tag } from '@/types/beach'

import { ChevronDownIcon } from '@/components/ui/icons'
import {
  AccessDifficultyLabels,
  type BeachSearchParams,
  countActiveFilters,
  NeedFilterKeys,
  NeedFilterLabels,
  OccupancyLabels,
} from '@/lib/beach-filters'
import { cn } from '@/lib/cn'

type FilterPanelProps = {
  municipalities: Municipality[]
  seas: Sea[]
  services: Service[]
  activities: Activity[]
  tags: Tag[]
  filters: BeachSearchParams
  onChange: (filters: BeachSearchParams) => void
}

type FilterGroupProps = {
  label: string
  children: ReactNode
  activeCount: number
  defaultOpen?: boolean
}

function FilterGroup({
  label,
  children,
  activeCount,
  defaultOpen = false,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-gray-800 transition-colors hover:text-ocean-600 focus-visible:rounded focus-visible:text-ocean-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <span className="flex items-center gap-2">
          {label}
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ocean-500 px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="space-y-2.5 pb-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

type CheckboxItemProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-0.5 text-sm text-gray-600 transition-colors hover:text-gray-900">
      <input
        checked={checked}
        className="h-4 w-4 rounded border-gray-300 text-ocean-600 accent-ocean-600 focus-visible:ring-ocean-500"
        type="checkbox"
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
      <span className={checked ? 'font-medium text-gray-900' : ''}>
        {label}
      </span>
    </label>
  )
}

function FilterContent({
  municipalities,
  seas,
  services,
  activities,
  tags,
  filters,
  onChange,
}: FilterPanelProps) {
  function toggleArrayFilter<TKey extends keyof BeachSearchParams>(
    key: TKey,
    index: number,
    current: number[] | undefined,
  ) {
    const arr = current ?? []
    const next = arr.includes(index)
      ? arr.filter((v) => v !== index)
      : [...arr, index]
    onChange({ ...filters, [key]: next.length > 0 ? next : undefined })
  }

  function toggleEnumFilter<TValue extends string>(
    key: 'accessDifficulty' | 'occupancy',
    value: TValue,
    current: readonly TValue[] | undefined,
  ) {
    const arr = current ?? []
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value]
    onChange({ ...filters, [key]: next.length > 0 ? next : undefined })
  }

  const needsActive =
    NeedFilterKeys.filter((key) => filters[key]).length +
    (filters.accessDifficulty?.length ?? 0) +
    (filters.occupancy?.length ?? 0)

  const totalActive = countActiveFilters(filters)

  function clearAll() {
    onChange({
      q: filters.q,
      sort: filters.sort,
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filtros</h2>
        {totalActive > 0 && (
          <button
            className="rounded text-sm text-ocean-600 underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none"
            type="button"
            onClick={clearAll}
          >
            Limpiar todo ({totalActive})
          </button>
        )}
      </div>

      <FilterGroup defaultOpen activeCount={needsActive} label="Necesidades">
        {NeedFilterKeys.map((key) => (
          <CheckboxItem
            key={key}
            checked={Boolean(filters[key])}
            label={NeedFilterLabels[key]}
            onChange={(checked) => {
              onChange({ ...filters, [key]: checked ? true : undefined })
            }}
          />
        ))}
        {(
          Object.keys(
            AccessDifficultyLabels,
          ) as (keyof typeof AccessDifficultyLabels)[]
        ).map((level) => (
          <CheckboxItem
            key={level}
            checked={(filters.accessDifficulty ?? []).includes(level)}
            label={AccessDifficultyLabels[level]}
            onChange={() => {
              toggleEnumFilter(
                'accessDifficulty',
                level,
                filters.accessDifficulty,
              )
            }}
          />
        ))}
        {(Object.keys(OccupancyLabels) as (keyof typeof OccupancyLabels)[]).map(
          (level) => (
            <CheckboxItem
              key={level}
              checked={(filters.occupancy ?? []).includes(level)}
              label={OccupancyLabels[level]}
              onChange={() => {
                toggleEnumFilter('occupancy', level, filters.occupancy)
              }}
            />
          ),
        )}
      </FilterGroup>

      <FilterGroup
        defaultOpen
        activeCount={filters.municipality?.length ?? 0}
        label="Municipio"
      >
        {municipalities.map((m, i) => (
          <CheckboxItem
            key={m.id}
            checked={(filters.municipality ?? []).includes(i)}
            label={m.name}
            onChange={() => {
              toggleArrayFilter('municipality', i, filters.municipality)
            }}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        defaultOpen
        activeCount={filters.sea?.length ?? 0}
        label="Mar"
      >
        {seas.map((s, i) => (
          <CheckboxItem
            key={s.name}
            checked={(filters.sea ?? []).includes(i)}
            label={s.name}
            onChange={() => {
              toggleArrayFilter('sea', i, filters.sea)
            }}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        activeCount={filters.services?.length ?? 0}
        label="Servicios"
      >
        {services.map((s, i) => (
          <CheckboxItem
            key={s.id}
            checked={(filters.services ?? []).includes(i)}
            label={s.name}
            onChange={() => {
              toggleArrayFilter('services', i, filters.services)
            }}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        activeCount={filters.activities?.length ?? 0}
        label="Actividades"
      >
        {activities.map((a, i) => (
          <CheckboxItem
            key={a.id}
            checked={(filters.activities ?? []).includes(i)}
            label={a.name}
            onChange={() => {
              toggleArrayFilter('activities', i, filters.activities)
            }}
          />
        ))}
      </FilterGroup>

      <FilterGroup activeCount={filters.tags?.length ?? 0} label="Etiquetas">
        {tags.map((t, i) => (
          <CheckboxItem
            key={t.id}
            checked={(filters.tags ?? []).includes(i)}
            label={t.name}
            onChange={() => {
              toggleArrayFilter('tags', i, filters.tags)
            }}
          />
        ))}
      </FilterGroup>
    </div>
  )
}

export function FilterToggleButton({
  activeCount,
  onClick,
}: {
  activeCount: number
  onClick: () => void
}) {
  return (
    <button
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-ocean-300 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none lg:hidden"
      type="button"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 4h18M6 8h12M9 12h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
      Filtros
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ocean-500 px-1.5 text-[11px] font-semibold text-white">
          {activeCount}
        </span>
      )}
    </button>
  )
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function FilterPanel(
  props: FilterPanelProps & { mobileOpen: boolean; onMobileClose: () => void },
) {
  const { mobileOpen, onMobileClose } = props
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!mobileOpen) return

    // Save the element that had focus before the modal opened
    previousFocusRef.current = document.activeElement as HTMLElement

    // Lock body scroll
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the modal
    const panel = panelRef.current
    if (panel) {
      const firstFocusable =
        panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      firstFocusable?.focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onMobileClose()
        return
      }

      if (e.key !== 'Tab' || !panelRef.current) return

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )

      if (focusableElements.length === 0) return

      const firstEl = focusableElements[0]
      const lastEl = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [mobileOpen, onMobileClose])

  return (
    <>
      {/* Mobile modal */}
      <div className="lg:hidden">
        {/* Mobile modal overlay */}
        {mobileOpen && (
          <div
            aria-label="Filtros"
            aria-modal="true"
            className="fixed inset-0 z-50"
            role="dialog"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                onMobileClose()
              }}
            />
            <div
              ref={panelRef}
              className="animate-slide-in-left fixed inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <button
                  aria-label="Cerrar filtros"
                  className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
                  type="button"
                  onClick={() => {
                    onMobileClose()
                  }}
                >
                  <svg
                    className="h-5 w-5"
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
              </div>
              <FilterContent {...props} />
              <div className="sticky bottom-0 mt-8 bg-white pt-4 pb-2">
                <button
                  className="w-full rounded-full bg-ocean-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  type="button"
                  onClick={() => {
                    onMobileClose()
                  }}
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <DesktopSidebar>
          <FilterContent {...props} />
        </DesktopSidebar>
      </aside>
    </>
  )
}

function DesktopSidebar({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showGradient, setShowGradient] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function update() {
      if (!el) return
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 4
      setShowGradient(!atBottom && el.scrollHeight > el.clientHeight)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative sticky top-20 max-h-[calc(100vh-6rem)]">
      <div
        ref={scrollRef}
        className="overflow-y-auto rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm"
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
      >
        {children}
      </div>
      {showGradient && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-12 rounded-b-2xl bg-gradient-to-t from-white to-transparent"
        />
      )}
    </div>
  )
}
