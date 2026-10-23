import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Beach, Municipality } from '@/types/beach'

import { BeachCard } from './beach-card'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}))

const beach: Beach = {
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
  recommendationScore: 0,
}
const municipality: Municipality = { name: 'Cartagena', id: '30016' }

function renderCard(props: Partial<React.ComponentProps<typeof BeachCard>>) {
  return render(
    <BeachCard
      beach={beach}
      municipality={municipality}
      slug="playa-test"
      tags={[]}
      {...props}
    />,
  )
}

describe('BeachCard conditions', () => {
  it('shows temperature with wind speed and direction', () => {
    renderCard({
      weather: { temp: 24, icon: 'sunny', windSpeed: 12, windDirection: 'SE' },
    })

    expect(screen.getByText('12 km/h SE')).toBeTruthy()
    expect(
      screen.getByLabelText('Viento 12 kilómetros por hora, dirección SE'),
    ).toBeTruthy()
  })

  it('omits wind when the weather has none', () => {
    renderCard({ weather: { temp: 24, icon: 'sunny' } })

    expect(screen.queryByText(/km\/h/)).toBeNull()
  })

  it.each([
    ['VERDE', 'Bandera verde'],
    ['AMARILLA', 'Bandera amarilla'],
    ['ROJA', 'Bandera roja'],
    ['PLAYA CERRADA', 'Playa cerrada'],
  ] as const)('shows the %s flag', (flag, label) => {
    renderCard({ flag })

    expect(screen.getByText(label)).toBeTruthy()
  })

  it('shows nothing when there is no flag or it is "SIN BANDERA"', () => {
    renderCard({})
    renderCard({ flag: 'SIN BANDERA' })

    expect(screen.queryByText(/Bandera/)).toBeNull()
  })

  it('shows the distance next to the municipality', () => {
    renderCard({ distanceKm: 12.4 })

    expect(screen.getByText(/Cartagena · a 12 km/)).toBeTruthy()
  })

  it('overlays at most 2 tags on the photo and moves extras to the body', () => {
    const tags = ['A', 'B', 'C'].map((name, id) => ({ id, name }))
    const { container } = renderCard({
      beach: { ...beach, pictures: ['x.jpg'], tags: [0, 1, 2] },
      tags: tags as never,
    })

    expect(container.querySelectorAll('li')).toHaveLength(1)
    expect(screen.getByText('C').tagName).toBe('LI')
    expect(screen.getByText('A').tagName).toBe('SPAN')
  })

  it('uses a readable gray-600 metadata line', () => {
    renderCard({})

    expect(screen.getByText('Arena').className).toContain('text-gray-600')
  })

  it('renders an ocean gradient fallback without pictures', () => {
    const { container } = renderCard({})

    expect(container.querySelector('.from-ocean-700')).toBeTruthy()
    expect(container.querySelector('img')).toBeNull()
  })
})
