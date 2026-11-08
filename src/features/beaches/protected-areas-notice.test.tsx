import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProtectedAreasNotice } from './protected-areas-notice'

describe('ProtectedAreasNotice', () => {
  it('names the park, the land Natura site and the sea separately', () => {
    render(
      <ProtectedAreasNotice
        areas={{
          natura2000: [
            { code: 'ES6200001', name: 'Calblanque', type: 'B' },
            { code: 'ES6200029', name: 'Franja Litoral Sumergida', type: 'B' },
          ],
          regional: [
            {
              code: 'ENP000005',
              name: 'Calblanque, Monte de las Cenizas y Peña del Águila',
              figure: 'Parque Regional',
              norm: 'Decreto 45/1995',
            },
          ],
        }}
      />,
    )
    const text = screen.getByRole('note').textContent
    expect(text).toContain(
      'dentro del Parque Regional Calblanque, Monte de las Cenizas',
    )
    expect(text).toContain('Red Natura 2000: Calblanque (LIC/ZEC ES6200001)')
    expect(text).toContain(
      'Las aguas frente a la playa forman parte de Franja Litoral Sumergida',
    )
  })

  it('renders nothing without sites', () => {
    const { container } = render(
      <ProtectedAreasNotice areas={{ natura2000: [], regional: [] }} />,
    )
    expect(container.innerHTML).toBe('')
  })
})
