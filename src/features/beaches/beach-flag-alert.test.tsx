import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { BeachStatus112 } from '@/lib/beach-status-112'

import { BeachFlagAlert } from './beach-flag-alert'

const data: BeachStatus112 = {
  flag: 'ROJA',
  seaState: 'MALO',
  date: '15/08/2026',
  time: '10:00',
  isOffSeason: false,
}

describe('BeachFlagAlert', () => {
  it('announces a red flag with its source and alternatives', () => {
    render(
      <BeachFlagAlert hasNearbyBeaches state={{ status: 'success', data }} />,
    )
    expect(screen.getByRole('alert').textContent).toContain(
      'Bandera roja: baño prohibido',
    )
    expect(
      screen
        .getByRole('link', { name: 'Ver playas cercanas' })
        .getAttribute('href'),
    ).toBe('#playas-cercanas')
  })

  it('announces a closed beach', () => {
    render(
      <BeachFlagAlert
        hasNearbyBeaches={false}
        state={{
          status: 'success',
          data: { ...data, flag: 'PLAYA CERRADA' },
        }}
      />,
    )
    expect(screen.getByText('Playa cerrada')).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('stays quiet for other flags and off season', () => {
    const { container, rerender } = render(
      <BeachFlagAlert
        hasNearbyBeaches
        state={{ status: 'success', data: { ...data, flag: 'VERDE' } }}
      />,
    )
    expect(container.firstChild).toBeNull()
    rerender(
      <BeachFlagAlert
        hasNearbyBeaches
        state={{ status: 'success', data: { ...data, isOffSeason: true } }}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})
