import { useMemo } from 'react'

import type { BeachSearchParams, FilterContext } from '@/lib/beach-filters'
import type { Beach } from '@/types/beach'

import { EmptyState } from '@/components/ui/empty-state'
import { type FilterLookups, listActiveFilters } from '@/lib/active-filters'
import { beachCountLabel, filterBeaches } from '@/lib/beach-filters'

const MaxSuggestions = 4

function joinLabels(labels: string[]): string {
  if (labels.length < 2) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`
}

type EmptyResultsProps = FilterLookups & {
  beaches: Beach[]
  filters: BeachSearchParams
  context?: FilterContext
  onChange: (next: BeachSearchParams) => void
}

/** No results: name the filters whose removal brings beaches back. */
export function EmptyResults({
  beaches,
  filters,
  context,
  municipalities,
  seas,
  services,
  activities,
  tags,
  onChange,
}: EmptyResultsProps) {
  const query = filters.q?.trim()

  const suggestions = useMemo(() => {
    const candidates = [
      ...listActiveFilters(filters, {
        municipalities,
        seas,
        services,
        activities,
        tags,
      }).map(({ key, label, without }) => ({ key, label, next: without })),
      ...(query
        ? [
            {
              key: 'q',
              label: `la búsqueda «${query}»`,
              next: { ...filters, q: undefined },
            },
          ]
        : []),
    ]
    return candidates
      .map((candidate) => ({
        ...candidate,
        count: filterBeaches(beaches, candidate.next, context).length,
      }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, MaxSuggestions)
  }, [
    beaches,
    filters,
    context,
    query,
    municipalities,
    seas,
    services,
    activities,
    tags,
  ])

  const hasConstraints = suggestions.length > 0 || Boolean(query)
  const combination = joinLabels([
    ...listActiveFilters(filters, {
      municipalities,
      seas,
      services,
      activities,
      tags,
    }).map(({ label }) => label),
    ...(query ? [`«${query}»`] : []),
  ])

  return (
    <EmptyState
      action={
        hasConstraints ? (
          <div className="flex flex-col items-center gap-3">
            {suggestions.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2">
                {suggestions.map(({ key, label, next, count }) => (
                  <li key={key}>
                    <button
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-ocean-300 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none pointer-coarse:min-h-11"
                      type="button"
                      onClick={() => {
                        onChange(next)
                      }}
                    >
                      Quitar {label}{' '}
                      <span className="ml-1 text-gray-600 tabular-nums">
                        {beachCountLabel(count)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="rounded-full bg-ocean-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 focus-visible:outline-none pointer-coarse:min-h-11"
              type="button"
              onClick={() => {
                onChange({})
              }}
            >
              Limpiar todo
            </button>
          </div>
        ) : undefined
      }
      description={
        combination
          ? `Ninguna playa reúne a la vez ${combination}.${suggestions.length > 0 ? ' Quita uno para ver resultados.' : ''}`
          : 'No hay playas que mostrar.'
      }
      icon={
        <svg
          aria-hidden="true"
          className="h-14 w-14"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
      }
      title="No hay playas con estos filtros"
    />
  )
}
