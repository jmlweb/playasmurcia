import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Beach, Municipality } from '@/types/beach'

import { NearbyCarousel } from './nearby-carousel'

function makeBeach(overrides: Partial<Beach> = {}): Beach {
  return {
    code: '001',
    name: 'Playa Test',
    municipality: 0,
    sea: 0,
    coordinates: [37.6, -0.9],
    soilType: 'Arena',
    nudist: false,
    promenade: false,
    anchorageZone: false,
    dogFriendly: false,
    lifeguard: false,
    services: [],
    activities: [],
    description: 'Una playa',
    access: 'Por carretera',
    nearby: [],
    orientation: 'Sur',
    instagramHashtag: '#test',
    ...overrides,
    recommendationScore: overrides.recommendationScore ?? 0,
  }
}

const mockMunicipality: Municipality = { name: 'Cartagena', id: '30016' }

describe('NearbyCarousel', () => {
  it('renders nothing when no nearby items are provided', () => {
    const { container } = render(<NearbyCarousel items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the heading', () => {
    render(
      <NearbyCarousel
        items={[
          {
            beach: makeBeach(),
            municipality: mockMunicipality,
            slug: 'playa-test',
          },
        ]}
      />,
    )
    expect(
      screen.getByRole('heading', { name: 'Playas cercanas' }),
    ).toBeTruthy()
  })

  it('renders a link for each nearby beach', () => {
    const items = [
      {
        beach: makeBeach({ code: '001', name: 'Playa A' }),
        municipality: mockMunicipality,
        slug: 'playa-a',
      },
      {
        beach: makeBeach({ code: '002', name: 'Playa B' }),
        municipality: mockMunicipality,
        slug: 'playa-b',
      },
    ]
    render(<NearbyCarousel items={items} />)
    const linkA = screen.getByRole('link', { name: 'Ver playa Playa A' })
    const linkB = screen.getByRole('link', { name: 'Ver playa Playa B' })
    expect(linkA.getAttribute('href')).toBe('/playas/playa-a')
    expect(linkB.getAttribute('href')).toBe('/playas/playa-b')
  })

  it('renders the beach picture when available', () => {
    const beach = makeBeach({ name: 'Playa Foto', pictures: ['foto.jpg'] })
    render(
      <NearbyCarousel
        items={[{ beach, municipality: mockMunicipality, slug: 'playa-foto' }]}
      />,
    )
    const img = screen.getByRole('img', { name: 'Playa Foto' })
    expect(img.getAttribute('src')).toBe('/pictures/foto.jpg')
  })

  it('renders the default image when no pictures are available', () => {
    render(
      <NearbyCarousel
        items={[
          {
            beach: makeBeach({ name: 'Sin Foto' }),
            municipality: mockMunicipality,
            slug: 'sin-foto',
          },
        ]}
      />,
    )
    const img = screen.getByRole('img', { name: 'Sin Foto' })
    expect(img.getAttribute('src')).toBe('/pictures/default-beach.png')
  })

  it('renders the municipality name', () => {
    render(
      <NearbyCarousel
        items={[
          {
            beach: makeBeach(),
            municipality: mockMunicipality,
            slug: 'playa-test',
          },
        ]}
      />,
    )
    expect(screen.getByText('Cartagena')).toBeTruthy()
  })
})
