import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MunicipalityFactsPanel } from './municipality-facts-panel'

describe('MunicipalityFactsPanel', () => {
  it('shows population, appraised value and offices with sources', () => {
    render(<MunicipalityFactsPanel ineCode="30035" name="San Javier" />)
    expect(screen.getByText('36.524 habitantes')).toBeTruthy()
    expect(screen.getByText('1.952,8 €/m²')).toBeTruthy()
    expect(screen.getByText(/no es un precio de venta/)).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /INE, cifras oficiales/ }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Turismo San Javier' }),
    ).toBeTruthy()
  })

  it('omits the appraised value when the municipality has none', () => {
    render(
      <MunicipalityFactsPanel ineCode="30036" name="San Pedro del Pinatar" />,
    )
    expect(screen.getByText('29.674 habitantes')).toBeTruthy()
    expect(screen.queryByText(/Valor tasado/)).toBeNull()
    expect(screen.queryByText(/Oficina de turismo/)).toBeNull()
  })

  it('renders nothing for an unknown municipality', () => {
    const { container } = render(
      <MunicipalityFactsPanel ineCode="00000" name="Nowhere" />,
    )
    expect(container.innerHTML).toBe('')
  })
})
