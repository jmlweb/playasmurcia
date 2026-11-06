import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

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
    <div aria-label={label} className="flex gap-px" role="group">
      {options.map((option, index) => {
        const isSelected = selected.includes(option.value)
        const isDisabled = !isSelected && option.count === 0
        return (
          <button
            key={option.value}
            aria-disabled={isDisabled || undefined}
            aria-pressed={isSelected}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1 border px-1.5 py-1.5 text-sm transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none pointer-coarse:min-h-11',
              index === 0 && 'rounded-l-full',
              index === options.length - 1 && 'rounded-r-full',
              optionState(isSelected, isDisabled),
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
              <OptionCount count={option.count} />
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
