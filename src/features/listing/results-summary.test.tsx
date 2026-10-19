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

  it('appends the suffix after the label', () => {
    render(
      <ResultsSummary
        currentPage={1}
        suffix=" encontradas"
        totalItems={4}
        totalPages={1}
      />,
    )

    expect(screen.getByText(/encontradas/).textContent).toBe(
      '4 playas encontradas',
    )
  })
})
