import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders buttons when pages have no URL', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Página 2' })).toBeTruthy()
  })

  it('renders links when pages have a URL, except the disabled step', () => {
    render(
      <Pagination
        currentPage={1}
        getPageHref={(page) => `/explorar?page=${page}`}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('link', { name: 'Página 2' }).getAttribute('href'),
    ).toBe('/explorar?page=2')
    expect(
      screen
        .getByRole('button', { name: 'Página anterior' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  it('handles a plain click but leaves a modified click to the browser', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        getPageHref={(page) => `/explorar?page=${page}`}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )
    const link = screen.getByRole('link', { name: 'Página 3' })

    fireEvent.click(link, { metaKey: true })
    expect(onPageChange).not.toHaveBeenCalled()

    fireEvent.click(link)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
