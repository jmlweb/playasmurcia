import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BeachSafetyBar } from './beach-safety-bar'

describe('BeachSafetyBar', () => {
  it('warns when the beach has no lifeguard', () => {
    render(
      <BeachSafetyBar
        beachName="El Rincón"
        coordinates={[37.5, -1.1]}
        lifeguard={false}
      />,
    )
    expect(screen.getByRole('note').textContent).toContain('Sin socorrista')
  })

  it('shows no warning when the beach has a lifeguard', () => {
    render(
      <BeachSafetyBar
        lifeguard
        beachName="El Rincón"
        coordinates={[37.5, -1.1]}
      />,
    )
    expect(screen.queryByRole('note')).toBeNull()
  })

  it('shows no warning when lifeguard data is missing', () => {
    render(<BeachSafetyBar beachName="El Rincón" coordinates={[37.5, -1.1]} />)
    expect(screen.queryByRole('note')).toBeNull()
  })

  it('links to directions to the beach coordinates', () => {
    render(<BeachSafetyBar beachName="El Rincón" coordinates={[37.5, -1.1]} />)
    expect(
      screen
        .getByRole('link', { name: /Cómo llegar a El Rincón/ })
        .getAttribute('href'),
    ).toBe('https://www.google.com/maps/dir/?api=1&destination=37.5,-1.1')
  })
})
