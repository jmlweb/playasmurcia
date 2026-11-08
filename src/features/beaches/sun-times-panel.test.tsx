import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SunTimesPanel } from './sun-times-panel'

// Cartagena, 21 June 2026 at 10:00 UTC
const NOW = Date.UTC(2026, 5, 21, 10)

describe('SunTimesPanel', () => {
  it('shows sunrise and sunset in Madrid time for the given day', () => {
    render(<SunTimesPanel coordinates={[37.6, -0.98]} now={NOW} />)

    expect(screen.getByRole('heading', { name: 'Sol hoy' })).toBeTruthy()
    expect(screen.getByText(/Amanece a las 06:4\d/)).toBeTruthy()
    expect(screen.getByText(/Se pone a las 21:(2|3)\d/)).toBeTruthy()
    expect(screen.queryByText(/sobre el agua/)).toBeNull()
  })

  it('mentions the sunset over the water only for west-facing shores', () => {
    render(
      <SunTimesPanel sunsetOverWater coordinates={[37.6, -0.98]} now={NOW} />,
    )

    expect(screen.getByText(/el sol se pone sobre el agua/)).toBeTruthy()
  })
})
