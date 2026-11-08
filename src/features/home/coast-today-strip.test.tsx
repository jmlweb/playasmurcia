import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { CoastToday } from '@/lib/coast-today'

import { CoastTodayStrip } from './coast-today-strip'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    params,
    to,
    ...props
  }: {
    children: React.ReactNode
    params: { slug: string }
    to: string
  }) => (
    <a href={to.replace('$slug', params.slug)} {...props}>
      {children}
    </a>
  ),
}))

const beachCounts = { 'mar-menor': 43, 'mar-mediterraneo': 150 }

const inSeason: CoastToday = {
  seas: {
    'mar-menor': {
      weather: {
        temp: { min: 19, max: 20 },
        wind: { min: 8, max: 11 },
        icon: 'sunny',
      },
      flags: { VERDE: 38, AMARILLA: 3, ROJA: 1 },
    },
    'mar-mediterraneo': {
      weather: { temp: { min: 18, max: 21 }, wind: { min: 9, max: 26 } },
      flags: { VERDE: 41, 'PLAYA CERRADA': 2 },
    },
  },
  weatherTime: '11:15',
  flagsTime: '11:40',
}

const offSeason: CoastToday = {
  seas: {
    'mar-menor': { weather: { temp: { min: 19, max: 19 } } },
    'mar-mediterraneo': {},
  },
  weatherTime: '11:15',
}

const renderStrip = (today: CoastToday | undefined, isLoading = false) =>
  render(
    <CoastTodayStrip
      beachCounts={beachCounts}
      expectsFlags={false}
      isLoading={isLoading}
      today={today}
    />,
  )

describe('CoastTodayStrip', () => {
  it('links each sea to its collection', () => {
    renderStrip(inSeason)

    expect(
      screen.getByRole('link', { name: /Mar Menor/ }).getAttribute('href'),
    ).toBe('/colecciones/mar-menor')
    expect(
      screen.getByRole('link', { name: /Mediterráneo/ }).getAttribute('href'),
    ).toBe('/colecciones/mar-mediterraneo')
  })

  it('shows ranges, flag counts and both sources in season', () => {
    renderStrip(inSeason)

    expect(screen.getByText('19–20°')).toBeTruthy()
    expect(screen.getByText('38 verdes')).toBeTruthy()
    expect(screen.getByText('1 roja')).toBeTruthy()
    expect(screen.getByText('2 cerradas')).toBeTruthy()
    expect(
      screen.getByText(
        'Open-Meteo · 11:15 · 112 · 11:40 · 85 playas con dato hoy',
      ),
    ).toBeTruthy()
  })

  it('drops flags and the 112 source when no flags were published', () => {
    renderStrip(offSeason)

    expect(screen.queryByText(/con dato hoy/)).toBeNull()
    expect(screen.getByText('Open-Meteo · 11:15')).toBeTruthy()
  })

  it('keeps the sea links while facts load', () => {
    renderStrip(undefined, true)

    expect(
      screen.getByRole('heading', { name: 'Hoy en la costa' }),
    ).toBeTruthy()
    expect(screen.getByText('43 playas')).toBeTruthy()
  })

  it('says that today has no data when no source answered', () => {
    renderStrip(undefined)

    expect(
      screen.getByRole('heading', { name: 'Hoy en la costa' }),
    ).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe(
      'Sin datos de hoy: el tiempo y las banderas no están disponibles ahora mismo. Cada mar enlaza a sus playas.',
    )
    expect(screen.queryByText(/°/)).toBeNull()
    expect(
      screen.getByRole('link', { name: /Mar Menor/ }).getAttribute('href'),
    ).toBe('/colecciones/mar-menor')
  })

  it('shows no unavailable notice while loading or with a source', () => {
    const { unmount } = renderStrip(undefined, true)
    expect(screen.getByRole('status').textContent).toBe('')
    unmount()

    renderStrip(offSeason)
    expect(screen.getByRole('status').textContent).toBe('Open-Meteo · 11:15')
  })
})
