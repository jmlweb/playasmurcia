import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProtectedAreaNotice } from './protected-area-notice'

describe('ProtectedAreaNotice', () => {
  it('names the regional park and the Natura 2000 site with their codes', () => {
    render(<ProtectedAreaNotice beachCode="590" />)
    const items = screen
      .getAllByRole('listitem')
      .map((item) => item.textContent)
    expect(items).toHaveLength(2)
    expect(items[0]).toContain(
      'Calblanque, Monte de las Cenizas y Peña del Águila',
    )
    expect(items[0]).toContain('Parque regional')
    expect(items[0]).toContain('ENP000005')
    expect(items[1]).toContain('Lugar de Importancia Comunitaria')
    expect(items[1]).toContain('Red Natura 2000')
    expect(items[1]).toContain('ES6200001')
  })

  it('cites the regional WFS and the date it was read', () => {
    render(<ProtectedAreaNotice beachCode="590" />)
    expect(screen.getByRole('link').getAttribute('href')).toContain(
      'mapas-gis-inter.carm.es',
    )
    expect(screen.getByRole('note').textContent).toContain(
      '8 de noviembre de 2026',
    )
  })

  it('spells out a space still waiting for its figure', () => {
    render(<ProtectedAreaNotice beachCode="510" />)
    expect(screen.getByRole('note').textContent).toContain(
      'Espacio natural protegido, propuesto como parque regional',
    )
  })

  it('renders nothing for a beach outside every protected space', () => {
    const { container } = render(<ProtectedAreaNotice beachCode="559" />)
    expect(container.innerHTML).toBe('')
  })
})
