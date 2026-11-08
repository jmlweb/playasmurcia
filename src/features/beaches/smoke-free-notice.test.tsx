import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SmokeFreeNotice } from './smoke-free-notice'

describe('SmokeFreeNotice', () => {
  it('names the covered stretch and never a fine', () => {
    render(<SmokeFreeNotice beachCode="533" />)
    const note = screen.getByRole('note')
    expect(note.textContent).toContain('en la zona deportiva')
    expect(note.textContent).not.toMatch(/multa|sanci/i)
    expect(screen.getByRole('link').getAttribute('href')).toContain(
      'murciasalud.es',
    )
  })

  it('covers the whole sand when no stretch is listed', () => {
    render(<SmokeFreeNotice beachCode="581" />)
    expect(screen.getByRole('note').textContent).toContain(
      'no fumar en el arenal',
    )
  })

  it('renders nothing for a beach outside the network', () => {
    const { container } = render(<SmokeFreeNotice beachCode="590" />)
    expect(container.innerHTML).toBe('')
  })
})
