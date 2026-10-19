type ResultsSummaryProps = {
  totalItems: number
  currentPage: number
  totalPages: number
  itemLabel?: { singular: string; plural: string }
  suffix?: string
}

export function ResultsSummary({
  totalItems,
  currentPage,
  totalPages,
  itemLabel = { singular: 'playa', plural: 'playas' },
  suffix = '',
}: ResultsSummaryProps) {
  const label = totalItems === 1 ? itemLabel.singular : itemLabel.plural

  return (
    <p className="text-sm text-gray-500">
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
