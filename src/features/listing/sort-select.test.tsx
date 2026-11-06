import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SortSelect } from './sort-select'

describe('SortSelect', () => {
  it('names the control with its label and current value', () => {
    render(<SortSelect value="name" onChange={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Ordenar por Nombre A-Z' }),
    ).toBeTruthy()
  })

  it('exposes a single-choice listbox with the current option selected', () => {
    render(<SortSelect value="name" onChange={vi.fn()} />)
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('listbox', { name: 'Ordenar por' })).toBeTruthy()
    expect(
      screen
        .getByRole('option', { name: 'Nombre A-Z' })
        .getAttribute('aria-selected'),
    ).toBe('true')
  })

  it('selects with the keyboard, including End', () => {
    const onChange = vi.fn()
    render(<SortSelect value="name" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    const list = screen.getByRole('listbox')

    fireEvent.keyDown(list, { key: 'End' })
    fireEvent.keyDown(list, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('occupancy')
  })
})
