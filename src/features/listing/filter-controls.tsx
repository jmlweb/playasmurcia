import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type FilterChipProps = {
  label: ReactNode
  pressed: boolean
  onToggle: () => void
}

export function FilterChip({ label, pressed, onToggle }: FilterChipProps) {
  return (
    <button
      aria-pressed={pressed}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none',
        pressed
          ? 'border-ocean-600 bg-ocean-600 font-medium text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-ocean-300 hover:text-ocean-700',
      )}
      type="button"
      onClick={onToggle}
    >
      {label}
    </button>
  )
}

type SegmentedOption<TValue extends string> = {
  value: TValue
  label: string
  title?: string
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
        return (
          <button
            key={option.value}
            aria-pressed={isSelected}
            className={cn(
              'flex-1 border px-2 py-1.5 text-sm transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none',
              index === 0 && 'rounded-l-full',
              index === options.length - 1 && 'rounded-r-full',
              isSelected
                ? 'border-ocean-600 bg-ocean-600 font-medium text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-ocean-300 hover:text-ocean-700',
            )}
            title={option.title}
            type="button"
            onClick={() => {
              onToggle(option.value)
            }}
          >
            {option.label}
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
