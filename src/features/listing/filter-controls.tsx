import type { ReactNode } from 'react'

import { CheckIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

const segmentStateClass = {
  pressed: 'bg-ocean-600 font-medium text-white',
  idle: 'text-gray-700 hover:bg-ocean-50 hover:text-ocean-700',
  unavailable: 'cursor-not-allowed bg-gray-50 text-gray-500',
} as const

const optionStateClass = {
  pressed: 'border-ocean-600 bg-ocean-600 font-medium text-white',
  idle: 'border-gray-200 bg-white text-gray-700 hover:border-ocean-300 hover:text-ocean-700',
  unavailable: 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500',
} as const

function optionState(pressed: boolean, disabled: boolean) {
  if (pressed) return optionStateClass.pressed
  return disabled ? optionStateClass.unavailable : optionStateClass.idle
}

/** Results this option would leave; hidden once the option is selected. */
function OptionCount({ count }: { count: number }) {
  return <span className="font-normal tabular-nums">{count}</span>
}

type FilterChipProps = {
  label: ReactNode
  pressed: boolean
  onToggle: () => void
  /** Beaches left if this option were added; 0 disables an unselected chip */
  count?: number
}

export function FilterChip({
  label,
  pressed,
  onToggle,
  count,
}: FilterChipProps) {
  const isDisabled = !pressed && count === 0

  // aria-disabled, not disabled: the chip stays reachable so a keyboard user
  // hears that it exists and leaves no results
  return (
    <button
      aria-disabled={isDisabled || undefined}
      aria-pressed={pressed}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none pointer-coarse:min-h-11',
        optionState(pressed, isDisabled),
      )}
      type="button"
      onClick={() => {
        if (!isDisabled) onToggle()
      }}
    >
      {label}
      {count !== undefined && !pressed && <OptionCount count={count} />}
    </button>
  )
}

const rowStateClass = {
  pressed: 'rounded-lg bg-ocean-50 font-medium text-ocean-600',
  idle: 'text-gray-700 hover:rounded-lg hover:border-transparent hover:bg-ocean-50 hover:text-ocean-700',
  unavailable: 'cursor-not-allowed text-gray-500',
} as const

export function FilterRow({
  label,
  pressed,
  onToggle,
  count,
}: FilterChipProps) {
  const isDisabled = !pressed && count === 0

  // aria-disabled, not disabled: see FilterChip
  return (
    <button
      aria-disabled={isDisabled || undefined}
      aria-pressed={pressed}
      className={cn(
        'group flex min-h-8 w-full items-center gap-2 border-b px-2 py-1 text-left text-sm transition-colors last:border-b-0 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none focus-visible:ring-inset pointer-coarse:min-h-11',
        pressed ? 'border-transparent' : 'border-gray-100',
        pressed
          ? rowStateClass.pressed
          : isDisabled
            ? rowStateClass.unavailable
            : rowStateClass.idle,
      )}
      type="button"
      onClick={() => {
        if (!isDisabled) onToggle()
      }}
    >
      {pressed && <CheckIcon className="h-4 w-4 shrink-0" />}
      {/* The space keeps label and count apart in the accessible name */}
      <span className="min-w-0 flex-1">{label}</span>{' '}
      {count !== undefined && !pressed && (
        // Faded, not removed: screen readers still hear the count
        <span
          className={cn(
            'tabular-nums opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100',
            isDisabled ? 'text-inherit' : 'text-gray-600',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

type SegmentedOption<TValue extends string> = {
  value: TValue
  label: string
  title?: string
  count?: number
}

type SegmentedFilterProps<TValue extends string> = {
  label: string
  options: readonly SegmentedOption<TValue>[]
  selected: readonly TValue[]
  onToggle: (value: TValue) => void
}

// Multi-select on purpose: filters accept several levels at once, so the
// buttons toggle independently instead of acting like a radio group.
export function SegmentedFilter<TValue extends string>({
  label,
  options,
  selected,
  onToggle,
}: SegmentedFilterProps<TValue>) {
  return (
    <div
      aria-label={label}
      className="flex divide-x divide-gray-200 overflow-hidden rounded-full border border-gray-200 bg-white"
      role="group"
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value)
        const isDisabled = !isSelected && option.count === 0
        return (
          <button
            key={option.value}
            aria-disabled={isDisabled || undefined}
            aria-pressed={isSelected}
            className={cn(
              'inline-flex min-h-9 flex-1 items-center justify-center px-1.5 py-1.5 text-sm transition-colors pointer-coarse:min-h-11 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none focus-visible:ring-inset',
              isSelected
                ? segmentStateClass.pressed
                : isDisabled
                  ? segmentStateClass.unavailable
                  : segmentStateClass.idle,
            )}
            title={
              option.count === undefined
                ? option.title
                : `${option.title ?? option.label} · ${option.count} ${option.count === 1 ? 'playa' : 'playas'}`
            }
            type="button"
            onClick={() => {
              if (!isDisabled) onToggle(option.value)
            }}
          >
            {option.label}
            {option.count !== undefined && !isSelected && (
              <span className="sr-only pointer-coarse:not-sr-only pointer-coarse:ml-1 pointer-coarse:font-normal pointer-coarse:tabular-nums">
                {' '}
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function toggleValue<TValue>(
  current: readonly TValue[] | undefined,
  value: TValue,
): TValue[] | undefined {
  const arr = current ?? []
  const next = arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value]
  return next.length > 0 ? next : undefined
}
