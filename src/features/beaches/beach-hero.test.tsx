import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BeachHero } from './beach-hero'

const renderHero = (zone?: string, municipalityName = 'Cartagena') =>
  render(
    <BeachHero
      breadcrumb={[{ label: 'Playa Isla Plana' }]}
      municipalityName={municipalityName}
      name="Playa Isla Plana"
      zone={zone}
    />,
  )

describe('BeachHero', () => {
  it('shows the zone before the municipality', () => {
    renderHero('isla-plana')
    expect(screen.getByText('Isla Plana · Cartagena')).toBeTruthy()
  })

  it('shows only the municipality when the beach has no zone', () => {
    renderHero(undefined)
    expect(screen.getByText('Cartagena')).toBeTruthy()
  })

  it('does not repeat a zone named like its municipality', () => {
    renderHero('los-alcazares', 'Los Alcázares')
    expect(screen.getByText('Los Alcázares')).toBeTruthy()
  })
})

describe('BeachHero sizing', () => {
  const heroClass = (picture?: string) =>
    render(
      <BeachHero
        breadcrumb={[{ label: 'Playa Isla Plana' }]}
        municipalityName="Cartagena"
        name="Playa Isla Plana"
        picture={picture}
      />,
    ).container.querySelector('section')?.className

  it('collapses to its content without a photo', () => {
    expect(heroClass()).not.toContain('min-h-')
  })

  it('keeps a minimum height with a photo', () => {
    expect(heroClass('cala_1.jpg')).toContain('min-h-')
  })

  it('renders the conditions slot', () => {
    render(
      <BeachHero
        breadcrumb={[{ label: 'Playa Isla Plana' }]}
        conditions={<p>Viento 6 km/h NE</p>}
        municipalityName="Cartagena"
        name="Playa Isla Plana"
      />,
    )
    expect(screen.getByText('Viento 6 km/h NE')).toBeTruthy()
  })
})
