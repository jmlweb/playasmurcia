type PageInfoProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemLabel?: string
}

export function PageInfo({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = 'playas',
}: PageInfoProps) {
  if (totalPages <= 1) return null

  return (
    <p className="mb-4 text-sm text-gray-500">
      Pagina{' '}
      <strong className="font-semibold text-gray-900">{currentPage}</strong> de{' '}
      <strong className="font-semibold text-gray-900">{totalPages}</strong> (
      {totalItems} {itemLabel})
    </p>
  )
}
