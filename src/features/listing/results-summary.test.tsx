import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResultsSummary } from './results-summary'

describe('ResultsSummary', () => {
  it('merges count and page indicator in one line', () => {
    render(<ResultsSummary currentPage={1} totalItems={35} totalPages={3} />)

    expect(screen.getByText(/playas/).textContent).toBe(
      '35 playas · página 1 de 3',
    )
  })

  it('omits the page indicator for a single page', () => {
    render(<ResultsSummary currentPage={1} totalItems={1} totalPages={1} />)

    expect(screen.getByText(/playa/).textContent).toBe('1 playa')
  })

  it.each([
    [1, '1 playa encontrada'],
    [4, '4 playas encontradas'],
  ])('agrees a custom label with a total of %i', (totalItems, expected) => {
    render(
      <ResultsSummary
        currentPage={1}
        itemLabel={{
          singular: 'playa encontrada',
          plural: 'playas encontradas',
        }}
        totalItems={totalItems}
        totalPages={1}
      />,
    )

    expect(screen.getByText(/encontrada/).textContent).toBe(expected)
  })
})
