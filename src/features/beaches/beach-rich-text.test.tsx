import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BeachRichText } from './beach-rich-text'

describe('BeachRichText', () => {
  it('renders plain text as a paragraph', () => {
    render(<BeachRichText text="Una cala tranquila." />)
    expect(screen.getByText('Una cala tranquila.').tagName).toBe('P')
  })

  it('renders bold segments as strong', () => {
    render(<BeachRichText text="Tiene **arena fina** y agua." />)
    expect(screen.getByText('arena fina').tagName).toBe('STRONG')
  })

  it('renders the tip as a labelled callout', () => {
    render(
      <BeachRichText text={'Playa larga.\n\n**Consejo:** trae escarpines.'} />,
    )
    expect(screen.getByText('Consejo')).toBeTruthy()
    expect(screen.getByText('trae escarpines.').closest('aside')).toBeTruthy()
    expect(screen.queryByText(/\*\*/)).toBeNull()
  })

  it('renders bullet lists', () => {
    render(<BeachRichText text={'Intro.\n\n- Uno\n- Dos'} variant="body" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders safe links opening in a new tab', () => {
    render(
      <BeachRichText text="Ver la [web](https://murcianatural.carm.es)." />,
    )
    const link = screen.getByRole('link', { name: 'web' })
    expect(link.getAttribute('href')).toBe('https://murcianatural.carm.es')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('does not link unsafe schemes', () => {
    render(<BeachRichText text="[clic](javascript:alert(1))" />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})
