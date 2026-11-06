import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ZoneSections } from './zone-sections'

const beaches = [
  { code: '657', name: 'Playa Isla Plana', zone: 'isla-plana' },
  { code: '528', name: 'Playa de Los Alemanes' },
  { code: '518', name: 'Cala Reona', zone: 'cabo-de-palos' },
  { code: '656', name: 'Playa La Caleta', zone: 'isla-plana' },
]

const renderSections = () =>
  render(
    <ZoneSections
      beaches={beaches}
      renderBeach={(beach) => <span>{beach.name}</span>}
    />,
  )

describe('ZoneSections', () => {
  it('renders one section per zone in coastal order, beaches without zone last', () => {
    renderSections()
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    expect(headings).toEqual(['Cabo de Palos', 'Isla Plana', 'Otras playas'])
  })

  it('keeps the incoming order inside each zone and shows the count', () => {
    renderSections()
    const section = screen.getByRole('region', { name: 'Isla Plana' })
    expect(
      within(section)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Playa Isla Plana', 'Playa La Caleta'])
    expect(within(section).getByText('2 playas')).toBeTruthy()
    const capeSection = screen.getByRole('region', { name: 'Cabo de Palos' })
    expect(within(capeSection).getByText('1 playa')).toBeTruthy()
  })
})
