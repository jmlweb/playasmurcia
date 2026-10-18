import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BeachDescription } from './beach-description'

describe('BeachDescription', () => {
  it('renders plain text as a paragraph', () => {
    render(<BeachDescription text="Una cala tranquila." />)
    expect(screen.getByText('Una cala tranquila.').tagName).toBe('P')
  })

  it('renders bold segments as strong', () => {
    render(<BeachDescription text="Tiene **arena fina** y agua." />)
    expect(screen.getByText('arena fina').tagName).toBe('STRONG')
  })

  it('renders the tip as a labelled callout', () => {
    render(
      <BeachDescription
        text={'Playa larga.\n\n**Consejo:** trae escarpines.'}
      />,
    )
    expect(screen.getByText('Consejo')).toBeTruthy()
    expect(screen.getByText('trae escarpines.').closest('aside')).toBeTruthy()
    expect(screen.queryByText(/\*\*/)).toBeNull()
  })
})
