type ResultsSummaryProps = {
  totalItems: number
  currentPage: number
  totalPages: number
  itemLabel?: { singular: string; plural: string }
  suffix?: string
  /** Announce count changes to screen readers */
  live?: boolean
}

export function ResultsSummary({
  totalItems,
  currentPage,
  totalPages,
  itemLabel = { singular: 'playa', plural: 'playas' },
  suffix = '',
  live = false,
}: ResultsSummaryProps) {
  const label = totalItems === 1 ? itemLabel.singular : itemLabel.plural

  return (
    <p
      aria-atomic={live || undefined}
      aria-live={live ? 'polite' : undefined}
      className="text-sm text-gray-500"
      role={live ? 'status' : undefined}
    >
      <strong className="font-semibold text-gray-900">{totalItems}</strong>{' '}
      {label}
      {suffix}
      {totalPages > 1 && (
        <>
          {' · '}página{' '}
          <strong className="font-semibold text-gray-900">{currentPage}</strong>{' '}
          de{' '}
          <strong className="font-semibold text-gray-900">{totalPages}</strong>
        </>
      )}
    </p>
  )
}
