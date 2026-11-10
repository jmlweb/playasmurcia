import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ZoneToday } from '@/lib/zone-today'

import { ZoneJumpBar, ZoneTodayStrip } from './zone-today-strip'

const today: ZoneToday = {
  rows: [
    {
      anchorId: 'zona-calabardina',
      name: 'Calabardina',
      beachCount: 2,
      shownCount: 2,
      weather: { temp: { min: 24, max: 25 }, wind: { min: 9, max: 11 } },
      flags: { VERDE: 2 },
    },
    {
      anchorId: 'zona-otras',
      name: 'Otras playas',
      beachCount: 1,
      shownCount: 0,
    },
  ],
  weatherTime: '12:15',
  flaggedCount: 2,
}

describe('ZoneTodayStrip', () => {
  it('links each zone row to its section', () => {
    render(
      <ZoneTodayStrip expectsFlags municipalityName="Águilas" today={today} />,
    )

    expect(screen.getByRole('heading', { name: 'Hoy en Águilas' })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Calabardina/ }).getAttribute('href'),
    ).toBe('#zona-calabardina')
  })

  it('keeps a filtered-out zone as a row without a link', () => {
    render(
      <ZoneTodayStrip expectsFlags municipalityName="Águilas" today={today} />,
    )

    expect(screen.getByText('Otras playas')).toBeTruthy()
    expect(screen.getByText('0 de 1')).toBeTruthy()
    expect(screen.queryByRole('link', { name: /Otras playas/ })).toBeNull()
  })

  it('states the sources once, with flags in season', () => {
    render(
      <ZoneTodayStrip expectsFlags municipalityName="Águilas" today={today} />,
    )

    expect(screen.getByRole('status').textContent).toBe(
      'Open-Meteo · 12:15 · 112 · 2 playas con bandera hoy',
    )
  })

  it('says when the 112 publishes flags out of season', () => {
    render(
      <ZoneTodayStrip
        expectsFlags={false}
        municipalityName="Águilas"
        today={{ ...today, rows: [today.rows[1]], weatherTime: undefined }}
      />,
    )

    expect(screen.getByRole('status').textContent).toBe(
      'Bandera del 112: se publica de junio a septiembre.',
    )
  })
})

describe('ZoneJumpBar', () => {
  it('lists every zone with its count', () => {
    render(<ZoneJumpBar rows={today.rows} />)

    const nav = screen.getByRole('navigation', { name: 'Zonas' })
    expect(nav.textContent).toContain('Calabardina2')
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
