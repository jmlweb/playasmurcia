import type { MouseEvent, ReactNode } from 'react'

import { cn } from '@/lib/cn'

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

const FocusRing =
  'focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

const StepClass = cn(
  'flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 sm:px-3 pointer-coarse:h-11',
  FocusRing,
)

function isPlainClick(e: MouseEvent) {
  return !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0
}

/** A link when the page has a URL, so it can be crawled or opened in a new tab. */
function PageControl({
  children,
  disabled = false,
  href,
  onSelect,
  ...rest
}: {
  'aria-current'?: 'page'
  'aria-label': string
  children: ReactNode
  className: string
  disabled?: boolean
  href?: string
  onSelect: () => void
}) {
  if (href && !disabled) {
    return (
      <a
        {...rest}
        href={href}
        onClick={(e) => {
          if (!isPlainClick(e)) return
          e.preventDefault()
          onSelect()
        }}
      >
        {children}
      </a>
    )
  }
  return (
    <button {...rest} disabled={disabled} type="button" onClick={onSelect}>
      {children}
    </button>
  )
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Pages with their own URL render as links */
  getPageHref?: (page: number) => string
}) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav aria-label="Paginación" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
        <li>
          <PageControl
            aria-label="Página anterior"
            className={StepClass}
            disabled={currentPage === 1}
            href={getPageHref?.(currentPage - 1)}
            onSelect={() => {
              onPageChange(currentPage - 1)
            }}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 sm:mr-1"
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
            <span className="sr-only sm:not-sr-only">Anterior</span>
          </PageControl>
        </li>

        {pages.map((page) =>
          typeof page === 'string' ? (
            <li key={page}>
              <span
                aria-hidden="true"
                className="flex h-10 w-6 items-center justify-center text-sm text-gray-600 sm:w-10"
              >
                …
              </span>
            </li>
          ) : (
            <li key={page}>
              <PageControl
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Página ${page}`}
                className={cn(
                  'flex h-10 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors sm:w-10 pointer-coarse:h-11',
                  FocusRing,
                  page === currentPage
                    ? 'bg-ocean-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
                href={getPageHref?.(page)}
                onSelect={() => {
                  onPageChange(page)
                }}
              >
                {page}
              </PageControl>
            </li>
          ),
        )}

        <li>
          <PageControl
            aria-label="Página siguiente"
            className={StepClass}
            disabled={currentPage === totalPages}
            href={getPageHref?.(currentPage + 1)}
            onSelect={() => {
              onPageChange(currentPage + 1)
            }}
          >
            <span className="sr-only sm:not-sr-only">Siguiente</span>
            <svg
              aria-hidden="true"
              className="h-4 w-4 sm:ml-1"
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
          </PageControl>
        </li>
      </ul>
    </nav>
  )
}
