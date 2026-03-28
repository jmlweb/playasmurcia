import { type ReactNode, useState } from 'react'

import { type BeachSearchParams, countActiveFilters } from '@/lib/beach-filters'
import type { Activity, Municipality, Sea, Service, Tag } from '@/types/beach'

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
        className="hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:ring-ocean-500 flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-gray-800 transition-colors focus:outline-none focus-visible:rounded focus-visible:ring-2"
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <span className="flex items-center gap-2">
          {label}
          {activeCount > 0 && (
            <span className="bg-ocean-500 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
        className="text-ocean-600 accent-ocean-600 focus:ring-ocean-500 h-4 w-4 rounded border-gray-300"
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
            className="text-ocean-600 text-sm hover:underline focus:outline-none"
            type="button"
            onClick={clearAll}
          >
            Limpiar todo ({totalActive})
          </button>
        )}
      </div>

      <FilterGroup
        activeCount={filters.municipality?.length ?? 0}
        defaultOpen
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

      <FilterGroup activeCount={filters.sea?.length ?? 0} defaultOpen label="Mar">
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

export function FilterPanel(props: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalActive = countActiveFilters(props.filters)

  return (
    <>
      {/* Mobile toggle button (positioned in toolbar via parent) */}
      <div className="lg:hidden">
        <button
          className="hover:border-ocean-300 hover:text-ocean-700 focus:ring-ocean-500 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors focus:ring-2 focus:outline-none"
          type="button"
          onClick={() => {
            setMobileOpen(true)
          }}
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
          {totalActive > 0 && (
            <span className="bg-ocean-500 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white">
              {totalActive}
            </span>
          )}
        </button>

        {/* Mobile modal overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              aria-hidden="true"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setMobileOpen(false)
              }}
            />
            <div className="animate-slide-in-left fixed inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Filtros
                </h2>
                <button
                  aria-label="Cerrar filtros"
                  className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
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
                  className="bg-ocean-600 hover:bg-ocean-700 focus:ring-ocean-500 w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
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
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
          <FilterContent {...props} />
        </div>
      </aside>
    </>
  )
}
