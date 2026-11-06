import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FilterRow } from './filter-controls'

describe('FilterRow', () => {
  it('keeps the label and count as the accessible name', () => {
    render(
      <FilterRow
        count={93}
        label="Con socorrista"
        pressed={false}
        onToggle={vi.fn()}
      />,
    )

    expect(
      screen
        .getByRole('button', { name: 'Con socorrista 93' })
        .getAttribute('aria-pressed'),
    ).toBe('false')
  })

  it('hides the count once pressed and still toggles off', () => {
    const onToggle = vi.fn()
    render(
      <FilterRow
        pressed
        count={93}
        label="Con socorrista"
        onToggle={onToggle}
      />,
    )

    const row = screen.getByRole('button', { name: 'Con socorrista' })
    expect(row.getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(row)
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('blocks a zero-count row without removing it from the tab order', () => {
    const onToggle = vi.fn()
    render(
      <FilterRow
        count={0}
        label="Nudista"
        pressed={false}
        onToggle={onToggle}
      />,
    )

    const row = screen.getByRole('button', { name: 'Nudista 0' })
    expect(row.getAttribute('aria-disabled')).toBe('true')
    expect(row.hasAttribute('disabled')).toBe(false)

    fireEvent.click(row)
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('lets a pressed row with no remaining results be cleared', () => {
    const onToggle = vi.fn()
    render(<FilterRow pressed count={0} label="Nudista" onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: 'Nudista' }))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
