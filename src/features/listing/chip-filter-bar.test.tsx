import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ChipFilterBar } from './chip-filter-bar'

describe('ChipFilterBar', () => {
  it('toggles an access level on', () => {
    const onChange = vi.fn()
    render(<ChipFilterBar filters={{}} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Acceso fácil' }))

    expect(onChange).toHaveBeenCalledWith({ accessDifficulty: ['easy'] })
  })

  it('toggles a need flag off when already pressed', () => {
    const onChange = vi.fn()
    render(
      <ChipFilterBar filters={{ dogFriendly: true }} onChange={onChange} />,
    )

    const chip = screen.getByRole('button', { name: 'Admite perros' })
    expect(chip.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(chip)

    expect(onChange).toHaveBeenCalledWith({ dogFriendly: undefined })
  })

  it('clears all filters', () => {
    const onChange = vi.fn()
    render(
      <ChipFilterBar
        filters={{ lifeguard: true, occupancy: ['low'] }}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros (2)' }))

    expect(onChange).toHaveBeenCalledWith({})
  })

  it('hides the clear button without active filters', () => {
    render(<ChipFilterBar filters={{}} onChange={vi.fn()} />)

    expect(screen.queryByText(/Limpiar filtros/)).toBeNull()
  })
})
