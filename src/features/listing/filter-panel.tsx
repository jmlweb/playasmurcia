import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'

import type {
  Activity,
  Beach,
  Municipality,
  Sea,
  Service,
  Tag,
} from '@/types/beach'

import { ChevronDownIcon } from '@/components/ui/icons'
import { isListedActivity } from '@/lib/activities'
import {
  AccessDifficultyLabels,
  type BeachSearchParams,
  beachCountLabel,
  countActiveFilters,
  countResultsWith,
  type FilterContext,
  NeedFilterKeys,
  NeedFilterLabels,
  OccupancyLabels,
  TodayFilterLabels,
} from '@/lib/beach-filters'
import { cn } from '@/lib/cn'
import { sortMunicipalitiesAlphabetically } from '@/lib/nav-builders'

import { FilterRow, SegmentedFilter, toggleValue } from './filter-controls'

const AccessOptions = [
  { value: 'easy', label: 'Fácil', title: AccessDifficultyLabels.easy },
  {
    value: 'moderate',
    label: 'Medio',
    title: AccessDifficultyLabels.moderate,
  },
  { value: 'hard', label: 'Difícil', title: AccessDifficultyLabels.hard },
] as const

const OccupancyOptions = [
  { value: 'low', label: 'Baja', title: OccupancyLabels.low },
  { value: 'medium', label: 'Media', title: OccupancyLabels.medium },
  { value: 'high', label: 'Alta', title: OccupancyLabels.high },
] as const

// Lifeguard lives in "Para hoy"; the other needs keep their own group
const OtherNeedKeys = NeedFilterKeys.filter((key) => key !== 'lifeguard')

// Tags that repeat a Servicios, Actividades or Necesidades option. Snorkel
// is not one: the Snorkel activity is unlisted, so the tag is the only filter
const DuplicateTagNames = new Set(['Chiringuito', 'Nudista', 'Playa canina'])

type FlagKey = (typeof NeedFilterKeys)[number] | 'blueFlag' | 'flagGreen'

type FilterPanelProps = {
  beaches: Beach[]
  /** Live data some filters need, such as today's green flags */
  context?: FilterContext
  flagGreenAvailable: boolean
  municipalities: Municipality[]
  seas: Sea[]
  services: Service[]
  activities: Activity[]
  tags: Tag[]
  filters: BeachSearchParams
  onChange: (filters: BeachSearchParams) => void
}

type IndexKey = 'municipality' | 'sea' | 'services' | 'activities' | 'tags'

type OptionCounts = {
  access: Record<string, number>
  occupancy: Record<string, number>
  flags: Partial<Record<FlagKey, number>>
  indexed: Record<IndexKey, number[]>
}

/** For every option, how many beaches would remain if it were selected. */
function useOptionCounts({
  beaches,
  context,
  filters,
  municipalities,
  seas,
  services,
  activities,
  tags,
}: Pick<
  FilterPanelProps,
  | 'beaches'
  | 'context'
  | 'filters'
  | 'municipalities'
  | 'seas'
  | 'services'
  | 'activities'
  | 'tags'
>): OptionCounts {
  const sizes = [
    municipalities.length,
    seas.length,
    services.length,
    activities.length,
    tags.length,
  ] as const

  return useMemo(() => {
    const countWith = (patch: Partial<BeachSearchParams>) =>
      countResultsWith(beaches, filters, patch, context)
    // Within a group the options widen the result, so each is counted alone;
    // across groups they narrow it, so each is added to the current choice
    const alone = (key: IndexKey, size: number) =>
      Array.from({ length: size }, (_, i) => countWith({ [key]: [i] }))
    const added = (key: 'services' | 'activities' | 'tags', size: number) =>
      Array.from({ length: size }, (_, i) =>
        countWith({ [key]: [...new Set([...(filters[key] ?? []), i])] }),
      )
    const flagKeys: FlagKey[] = [...NeedFilterKeys, 'blueFlag', 'flagGreen']

    return {
      access: Object.fromEntries(
        AccessOptions.map(({ value }) => [
          value,
          countWith({ accessDifficulty: [value] }),
        ]),
      ),
      occupancy: Object.fromEntries(
        OccupancyOptions.map(({ value }) => [
          value,
          countWith({ occupancy: [value] }),
        ]),
      ),
      flags: Object.fromEntries(
        flagKeys.map((key) => [key, countWith({ [key]: true })]),
      ),
      indexed: {
        municipality: alone('municipality', sizes[0]),
        sea: alone('sea', sizes[1]),
        services: added('services', sizes[2]),
        activities: added('activities', sizes[3]),
        tags: added('tags', sizes[4]),
      },
    }
    // sizes is a fresh array each render, so its members are listed instead
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beaches, context, filters, ...sizes])
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ocean-500 px-1.5 text-xs font-semibold text-white">
      {count}
    </span>
  )
}

function Disclosure({
  label,
  children,
  activeCount,
  defaultOpen = false,
  className,
  nested = false,
}: {
  label: string
  children: ReactNode
  activeCount: number
  defaultOpen?: boolean
  className?: string
  /** Sub-group inside another disclosure: lighter than its parent */
  nested?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className={className}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={cn(
          'flex min-h-11 w-full items-center justify-between py-2 text-left text-sm transition-colors',
          nested ? 'text-gray-700' : 'font-medium text-gray-800',
          'hover:text-ocean-600 focus-visible:rounded focus-visible:text-ocean-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none',
        )}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <span className="flex items-center gap-2">
          {label}
          <CountBadge count={activeCount} />
        </span>
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        {/* inert keeps collapsed options out of the tab order and the reading order */}
        <div className="overflow-hidden" id={panelId} inert={!isOpen}>
          {children}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  children,
  activeCount,
}: {
  label: string
  children: ReactNode
  activeCount: number
}) {
  return (
    <Disclosure
      nested
      activeCount={activeCount}
      className="border-b border-gray-100 last:border-0"
      label={label}
    >
      <div className="pb-3 pl-3">{children}</div>
    </Disclosure>
  )
}

function FilterSection({
  label,
  children,
  activeCount = 0,
  grouped = false,
}: {
  label: string
  children: ReactNode
  activeCount?: number
  /** Chips carry no group role of their own, so the section names them */
  grouped?: boolean
}) {
  const headingId = useId()

  return (
    <section className="mb-5">
      <h3
        className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-800"
        id={headingId}
      >
        {label}
        <CountBadge count={activeCount} />
      </h3>
      {grouped ? (
        <div aria-labelledby={headingId} role="group">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

type CheckboxItemProps = {
  label: string
  checked: boolean
  count: number
  onChange: (checked: boolean) => void
}

function CheckboxItem({ label, checked, count, onChange }: CheckboxItemProps) {
  const isDisabled = !checked && count === 0

  return (
    <label
      className={cn(
        'group flex items-center gap-2.5 rounded-lg py-2 text-sm transition-colors pointer-coarse:py-3',
        isDisabled
          ? 'cursor-not-allowed text-gray-500'
          : 'cursor-pointer text-gray-600 hover:text-gray-900',
      )}
    >
      <input
        aria-disabled={isDisabled || undefined}
        checked={checked}
        className="h-4 w-4 rounded border-gray-300 text-ocean-600 accent-ocean-600 focus-visible:ring-ocean-500"
        type="checkbox"
        onChange={(e) => {
          if (!isDisabled) onChange(e.target.checked)
        }}
      />
      <span
        className={cn('min-w-0 flex-1', checked && 'font-medium text-gray-900')}
      >
        {label}
      </span>
      {!checked && (
        <span className="tabular-nums opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
          {count}
        </span>
      )}
    </label>
  )
}

function FilterContent({
  beaches,
  context,
  flagGreenAvailable,
  municipalities,
  seas,
  services,
  activities,
  tags,
  filters,
  onChange,
  showHeading = true,
}: FilterPanelProps & { showHeading?: boolean }) {
  const counts = useOptionCounts({
    beaches,
    context,
    filters,
    municipalities,
    seas,
    services,
    activities,
    tags,
  })

  // Filter values are positions in `municipalities`, so each row keeps its own
  const sortedMunicipalities = useMemo(
    () =>
      sortMunicipalitiesAlphabetically(
        municipalities.map(({ name }, index) => ({ name, index })),
      ),
    [municipalities],
  )

  function toggleArrayFilter(
    key: IndexKey,
    index: number,
    current: number[] | undefined,
  ) {
    const arr = current ?? []
    const next = arr.includes(index)
      ? arr.filter((v) => v !== index)
      : [...arr, index]
    onChange({ ...filters, [key]: next.length > 0 ? next : undefined })
  }

  function toggleFlag(key: FlagKey) {
    onChange({ ...filters, [key]: filters[key] ? undefined : true })
  }

  const needsActive = OtherNeedKeys.filter((key) => filters[key]).length
  const todayActive =
    Number(Boolean(filters.flagGreen)) +
    Number(Boolean(filters.lifeguard)) +
    Number(Boolean(filters.blueFlag))
  const moreActive =
    (filters.services?.length ?? 0) +
    (filters.activities?.length ?? 0) +
    (filters.tags?.length ?? 0)

  const totalActive = countActiveFilters(filters)
  const resultTotal = useMemo(
    () => countResultsWith(beaches, filters, {}, context),
    [beaches, filters, context],
  )
  // An unchecked option that leaves every current result filters nothing
  const isRedundant = (checked: boolean, count: number) =>
    !checked && resultTotal > 0 && count === resultTotal
  const visibleServices = services
    .map((item, index) => ({ item, index }))
    .filter(
      ({ index }) =>
        !isRedundant(
          (filters.services ?? []).includes(index),
          counts.indexed.services[index],
        ),
    )
  const visibleActivities = activities
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item, index }) =>
        (isListedActivity(item) ||
          (filters.activities ?? []).includes(index)) &&
        !isRedundant(
          (filters.activities ?? []).includes(index),
          counts.indexed.activities[index],
        ),
    )
  const visibleTags = tags
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item, index }) =>
        (!DuplicateTagNames.has(item.name) ||
          (filters.tags ?? []).includes(index)) &&
        !isRedundant(
          (filters.tags ?? []).includes(index),
          counts.indexed.tags[index],
        ),
    )

  function clearAll() {
    onChange({
      q: filters.q,
      sort: filters.sort,
    })
  }

  return (
    <div>
      <div
        className={cn(
          'mb-4 flex items-center',
          showHeading ? 'justify-between' : 'justify-end',
        )}
      >
        {showHeading && (
          <h2 className="font-(family-name:--default-font-family) text-base font-semibold text-gray-900">
            Filtros
          </h2>
        )}
        {totalActive > 0 && (
          <button
            className="min-h-6 rounded text-sm text-ocean-600 underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1 focus-visible:outline-none pointer-coarse:min-h-11"
            type="button"
            onClick={clearAll}
          >
            Limpiar todo ({totalActive})
          </button>
        )}
      </div>

      <FilterSection grouped activeCount={todayActive} label="Para hoy">
        <div className="-mx-2">
          {flagGreenAvailable && (
            <FilterRow
              count={counts.flags.flagGreen}
              label={TodayFilterLabels.flagGreen}
              pressed={Boolean(filters.flagGreen)}
              onToggle={() => {
                toggleFlag('flagGreen')
              }}
            />
          )}
          <FilterRow
            count={counts.flags.lifeguard}
            label={TodayFilterLabels.lifeguard}
            pressed={Boolean(filters.lifeguard)}
            onToggle={() => {
              toggleFlag('lifeguard')
            }}
          />
          <FilterRow
            count={counts.flags.blueFlag}
            label={TodayFilterLabels.blueFlag}
            pressed={Boolean(filters.blueFlag)}
            onToggle={() => {
              toggleFlag('blueFlag')
            }}
          />
        </div>
      </FilterSection>

      <FilterSection label="Acceso">
        <SegmentedFilter
          label="Acceso"
          options={AccessOptions.map((option) => ({
            ...option,
            count: counts.access[option.value],
          }))}
          selected={filters.accessDifficulty ?? []}
          onToggle={(value) => {
            onChange({
              ...filters,
              accessDifficulty: toggleValue(filters.accessDifficulty, value),
            })
          }}
        />
      </FilterSection>

      <FilterSection label="Ocupación en verano">
        <SegmentedFilter
          label="Ocupación en verano"
          options={OccupancyOptions.map((option) => ({
            ...option,
            count: counts.occupancy[option.value],
          }))}
          selected={filters.occupancy ?? []}
          onToggle={(value) => {
            onChange({
              ...filters,
              occupancy: toggleValue(filters.occupancy, value),
            })
          }}
        />
      </FilterSection>

      <FilterSection grouped activeCount={filters.sea?.length ?? 0} label="Mar">
        <div className="-mx-2">
          {seas.map((s, i) => (
            <FilterRow
              key={s.name}
              count={counts.indexed.sea[i]}
              label={s.name}
              pressed={(filters.sea ?? []).includes(i)}
              onToggle={() => {
                toggleArrayFilter('sea', i, filters.sea)
              }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection grouped activeCount={needsActive} label="Necesidades">
        <div className="-mx-2">
          {OtherNeedKeys.map((key) => (
            <FilterRow
              key={key}
              count={counts.flags[key]}
              label={NeedFilterLabels[key]}
              pressed={Boolean(filters[key])}
              onToggle={() => {
                toggleFlag(key)
              }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        grouped
        activeCount={filters.municipality?.length ?? 0}
        label="Municipio"
      >
        <div className="-mx-2">
          {sortedMunicipalities.map(({ name, index }) => (
            <FilterRow
              key={name}
              count={counts.indexed.municipality[index]}
              label={name}
              pressed={(filters.municipality ?? []).includes(index)}
              onToggle={() => {
                toggleArrayFilter('municipality', index, filters.municipality)
              }}
            />
          ))}
        </div>
      </FilterSection>

      <Disclosure
        activeCount={moreActive}
        className="border-t border-gray-100"
        defaultOpen={moreActive > 0}
        label="Más filtros"
      >
        {visibleServices.length > 0 && (
          <FilterGroup
            activeCount={filters.services?.length ?? 0}
            label="Servicios"
          >
            {visibleServices.map(({ item, index }) => (
              <CheckboxItem
                key={item.id}
                checked={(filters.services ?? []).includes(index)}
                count={counts.indexed.services[index]}
                label={item.name}
                onChange={() => {
                  toggleArrayFilter('services', index, filters.services)
                }}
              />
            ))}
          </FilterGroup>
        )}

        {visibleActivities.length > 0 && (
          <FilterGroup
            activeCount={filters.activities?.length ?? 0}
            label="Actividades"
          >
            {visibleActivities.map(({ item, index }) => (
              <CheckboxItem
                key={item.id}
                checked={(filters.activities ?? []).includes(index)}
                count={counts.indexed.activities[index]}
                label={item.name}
                onChange={() => {
                  toggleArrayFilter('activities', index, filters.activities)
                }}
              />
            ))}
          </FilterGroup>
        )}

        {visibleTags.length > 0 && (
          <FilterGroup activeCount={filters.tags?.length ?? 0} label="Ambiente">
            {visibleTags.map(({ item, index }) => (
              <CheckboxItem
                key={item.id}
                checked={(filters.tags ?? []).includes(index)}
                count={counts.indexed.tags[index]}
                label={item.name}
                onChange={() => {
                  toggleArrayFilter('tags', index, filters.tags)
                }}
              />
            ))}
          </FilterGroup>
        )}
      </Disclosure>
    </div>
  )
}

const FilterDialogId = 'explorer-filters'

export function FilterToggleButton({
  activeCount,
  expanded,
  onClick,
}: {
  activeCount: number
  expanded: boolean
  onClick: () => void
}) {
  return (
    <button
      aria-controls={expanded ? FilterDialogId : undefined}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      className="flex min-h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-ocean-300 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none lg:hidden"
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
      <CountBadge count={activeCount} />
      {activeCount > 0 && (
        <span className="sr-only">
          {activeCount === 1 ? 'activo' : 'activos'}
        </span>
      )}
    </button>
  )
}

// Tailwind's lg breakpoint, where the sidebar replaces the dialog
const DesktopQuery = '(min-width: 64rem)'

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DesktopQuery)
  query.addEventListener('change', onChange)
  return () => {
    query.removeEventListener('change', onChange)
  }
}

// The server renders the sidebar so it reaches crawlers and agents; phones
// then drop it, or every toggle would recount all options for a hidden copy
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DesktopQuery).matches,
    () => true,
  )
}

/** Hides everything but the dialog from focus and assistive tech. */
function makeBackgroundInert(dialog: Element | null) {
  const background = Array.from(document.body.children).filter(
    (el) => el !== dialog && !el.hasAttribute('inert'),
  )
  background.forEach((el) => {
    el.setAttribute('inert', '')
  })
  return () => {
    background.forEach((el) => {
      el.removeAttribute('inert')
    })
  }
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Collapsed groups are inert, so they must not take part in the focus trap
function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => !el.closest('[inert]'))
}

export function FilterPanel(
  props: FilterPanelProps & {
    mobileOpen: boolean
    onMobileClose: () => void
    /** Beaches matching the current filters, shown on the mobile close button */
    resultCount: number
  },
) {
  const { mobileOpen, onMobileClose, resultCount, ...contentProps } = props
  const panelRef = useRef<HTMLDivElement>(null)
  // The parent passes a new closure each render; the focus effect must not
  // restart on every filter toggle, or focus would snap back to the dialog's
  // first control and then to the trigger
  const onMobileCloseRef = useRef(onMobileClose)
  useEffect(() => {
    onMobileCloseRef.current = onMobileClose
  })
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!mobileOpen) return

    // Save the element that had focus before the modal opened
    previousFocusRef.current = document.activeElement as HTMLElement

    // Lock body scroll
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const restoreBackground = makeBackgroundInert(
      document.getElementById(FilterDialogId),
    )

    // The dialog is hidden from lg up, which would strand the inert page
    const desktopQuery = window.matchMedia(DesktopQuery)
    function closeOnDesktop(e: MediaQueryListEvent) {
      if (e.matches) onMobileCloseRef.current()
    }
    desktopQuery.addEventListener('change', closeOnDesktop)

    // Move focus into the modal
    const panel = panelRef.current
    if (panel) {
      getFocusable(panel)[0]?.focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onMobileCloseRef.current()
        return
      }

      if (e.key !== 'Tab' || !panelRef.current) return

      const focusableElements = getFocusable(panelRef.current)

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
      desktopQuery.removeEventListener('change', closeOnDesktop)
      document.body.style.overflow = previousOverflow
      // An inert element cannot take focus, so this order matters
      restoreBackground()
      previousFocusRef.current?.focus()
    }
  }, [mobileOpen])

  return (
    <>
      {/* In body, not the page tree: the whole page around it goes inert */}
      {mobileOpen &&
        createPortal(
          <div
            aria-label="Filtros"
            aria-modal="true"
            className="fixed inset-0 z-50 lg:hidden"
            id={FilterDialogId}
            role="dialog"
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 bg-black/50"
              onClick={() => {
                onMobileClose()
              }}
            />
            <div
              ref={panelRef}
              className="animate-slide-in-left fixed inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white px-6 pt-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-(family-name:--default-font-family) text-lg font-semibold text-gray-900">
                  Filtros
                </h2>
                <button
                  aria-label="Cerrar filtros"
                  className="-mr-2.5 flex size-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
                  type="button"
                  onClick={() => {
                    onMobileClose()
                  }}
                >
                  <svg
                    aria-hidden="true"
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
              <FilterContent {...contentProps} showHeading={false} />
              <div className="sticky bottom-0 -mx-6 mt-4 bg-white px-6 pt-4 pb-6 before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-linear-to-t before:from-white before:to-transparent">
                <button
                  className="min-h-11 w-full rounded-full bg-ocean-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  type="button"
                  onClick={() => {
                    onMobileClose()
                  }}
                >
                  {resultCount > 0
                    ? `Ver ${beachCountLabel(resultCount)}`
                    : 'Sin resultados: cambia los filtros'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Desktop sidebar */}
      <aside aria-label="Filtros" className="hidden w-72 shrink-0 lg:block">
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:mb-3 focus-visible:block focus-visible:rounded focus-visible:text-sm focus-visible:text-ocean-700 focus-visible:underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          href="#resultados"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('resultados')?.focus()
          }}
        >
          Saltar a los resultados
        </a>
        {isDesktop && (
          <DesktopSidebar>
            <FilterContent {...contentProps} />
          </DesktopSidebar>
        )}
      </aside>
    </>
  )
}

// Capped to the viewport so the groups at the bottom stay reachable
// Scroll must chain to the page: the box starts below the fold under the hero,
// so containing it strands the wheel with the panel's end still off screen
function DesktopSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-20 max-h-[calc(100svh-6rem)] [scrollbar-width:thin] overflow-y-auto rounded-2xl border border-gray-200/60 bg-white p-6">
      {children}
    </div>
  )
}
