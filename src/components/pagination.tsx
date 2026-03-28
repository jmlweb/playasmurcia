const SIBLING_COUNT = 1

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const totalSlots = SIBLING_COUNT * 2 + 5 // siblings + first + last + current + 2 ellipsis
  if (totalPages <= totalSlots) return range(1, totalPages)

  const leftSibling = Math.max(currentPage - SIBLING_COUNT, 1)
  const rightSibling = Math.min(currentPage + SIBLING_COUNT, totalPages)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 3 + SIBLING_COUNT * 2)
    return [...leftRange, 'ellipsis-end', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(totalPages - (2 + SIBLING_COUNT * 2), totalPages)
    return [1, 'ellipsis-start', ...rightRange]
  }

  return [
    1,
    'ellipsis-start',
    ...range(leftSibling, rightSibling),
    'ellipsis-end',
    totalPages,
  ]
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav aria-label="Paginacion" className="mt-10 flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          <button
            aria-label="Pagina anterior"
            className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
            disabled={currentPage === 1}
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <svg
              aria-hidden="true"
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Anterior
          </button>
        </li>

        {pages.map((page) =>
          typeof page === 'string' ? (
            <li key={page}>
              <span className="flex h-10 w-10 items-center justify-center text-sm text-gray-400">
                ...
              </span>
            </li>
          ) : (
            <li key={page}>
              <button
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Pagina ${page}`}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-ocean-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                type="button"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            aria-label="Pagina siguiente"
            className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
            disabled={currentPage === totalPages}
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente
            <svg
              aria-hidden="true"
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  )
}
