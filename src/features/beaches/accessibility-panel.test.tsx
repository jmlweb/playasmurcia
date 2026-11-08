import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccessibilityPanel } from './accessibility-panel'

const sheet = {
  year: 2026,
  category: 'practicable equipada con baño asistido',
  assistedBathing: 'staff' as const,
  amphibiousChairs: 2,
  walkway: true,
  adaptedToilets: true,
  adaptedBathingZone: true,
  season: 'Del 01/07/26 al 15/09/26',
  hours: 'De 11:30 a 19:30',
  sourceUrl: 'https://itrem.carm.es/es/playa/playa-612/',
}

describe('AccessibilityPanel', () => {
  it('shows the category, the bathing help with its season and the equipment', () => {
    render(<AccessibilityPanel sheet={sheet} />)
    expect(screen.getByRole('heading', { name: 'Accesibilidad' })).toBeTruthy()
    expect(
      screen.getByText('Practicable equipada con baño asistido'),
    ).toBeTruthy()
    expect(
      screen.getByText(/personal de la playa acompaña al baño/),
    ).toBeTruthy()
    expect(screen.getByText('Temporada: Del 01/07/26 al 15/09/26')).toBeTruthy()
    expect(
      screen.getByText(
        /2 sillas anfibias, pasarela sobre la arena, aseo adaptado/,
      ),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: /ficha de accesibilidad de ITREM/ })
        .getAttribute('href'),
    ).toBe(sheet.sourceUrl)
  })

  it('describes a chair loan as needing a companion', () => {
    render(
      <AccessibilityPanel
        sheet={{ ...sheet, assistedBathing: 'loan', amphibiousChairs: 1 }}
      />,
    )
    expect(screen.getByText(/hace falta ir con acompañante/)).toBeTruthy()
    expect(screen.getByText(/1 silla anfibia,/)).toBeTruthy()
  })
})
