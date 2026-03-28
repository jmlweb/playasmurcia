import { type ReactNode, useState } from "react"
import type { Activity, Municipality, Sea, Service, Tag } from "@/types/beach"
import { type BeachSearchParams, countActiveFilters } from "@/lib/beach-filters"

interface FilterPanelProps {
  municipalities: Array<Municipality>
  seas: Array<Sea>
  services: Array<Service>
  activities: Array<Activity>
  tags: Array<Tag>
  filters: BeachSearchParams
  onChange: (filters: BeachSearchParams) => void
}

interface FilterGroupProps {
  label: string
  children: ReactNode
  activeCount: number
}

function FilterGroup({ label, children, activeCount }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-gray-800 transition-colors hover:text-ocean-600 focus-visible:text-ocean-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:rounded focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {label}
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ocean-500 px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-4 space-y-2.5">{children}</div>
        </div>
      </div>
    </div>
  )
}

interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-0.5 text-sm text-gray-600 transition-colors hover:text-gray-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-ocean-600 accent-ocean-600 focus:ring-ocean-500"
      />
      <span className={checked ? "font-medium text-gray-900" : ""}>{label}</span>
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
    current: Array<number> | undefined,
  ) {
    const arr = current ?? []
    const next = arr.includes(index) ? arr.filter((v) => v !== index) : [...arr, index]
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Filtros</h2>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-ocean-600 hover:underline focus:outline-none"
          >
            Limpiar todo ({totalActive})
          </button>
        )}
      </div>

      <FilterGroup label="Municipio" activeCount={filters.municipality?.length ?? 0}>
        {municipalities.map((m, i) => (
          <CheckboxItem
            key={m.id}
            label={m.name}
            checked={(filters.municipality ?? []).includes(i)}
            onChange={() => toggleArrayFilter("municipality", i, filters.municipality)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Mar" activeCount={filters.sea?.length ?? 0}>
        {seas.map((s, i) => (
          <CheckboxItem
            key={s.name}
            label={s.name}
            checked={(filters.sea ?? []).includes(i)}
            onChange={() => toggleArrayFilter("sea", i, filters.sea)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Servicios" activeCount={filters.services?.length ?? 0}>
        {services.map((s, i) => (
          <CheckboxItem
            key={s.id}
            label={s.name}
            checked={(filters.services ?? []).includes(i)}
            onChange={() => toggleArrayFilter("services", i, filters.services)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Actividades" activeCount={filters.activities?.length ?? 0}>
        {activities.map((a, i) => (
          <CheckboxItem
            key={a.id}
            label={a.name}
            checked={(filters.activities ?? []).includes(i)}
            onChange={() => toggleArrayFilter("activities", i, filters.activities)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Etiquetas" activeCount={filters.tags?.length ?? 0}>
        {tags.map((t, i) => (
          <CheckboxItem
            key={t.id}
            label={t.name}
            checked={(filters.tags ?? []).includes(i)}
            onChange={() => toggleArrayFilter("tags", i, filters.tags)}
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
      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-ocean-300 hover:text-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:outline-none"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" />
          </svg>
          Filtros
          {totalActive > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ocean-500 px-1.5 text-[11px] font-semibold text-white">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* Mobile modal overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar filtros"
                className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent {...props} />
            <div className="mt-8 sticky bottom-0 bg-white pt-4 pb-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-full bg-ocean-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 focus:outline-none"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <FilterContent {...props} />
      </div>
    </>
  )
}
