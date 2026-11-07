import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BeachForecast } from '@/lib/forecast-days'

import {
  WeatherWidget,
  formatDayLabel,
  formatFullDayName,
  isWeekend,
} from './weather-widget'

const serverFn = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({ handler: () => serverFn }),
  }),
}))

// Forecast days are UTC midnight of the Madrid calendar day, as the parsers emit
const SATURDAY = Date.UTC(2026, 10, 7)
const SUNDAY = Date.UTC(2026, 10, 8)
const TUESDAY = Date.UTC(2026, 9, 27)

const forecast: BeachForecast = {
  source: 'aemet+open-meteo',
  observedAt: '2026-11-07T01:45',
  waterTemp: 22,
  waves: { height: 0.3, direction: 'NO', exposure: 'expuesta' },
  days: [
    {
      fecha: SATURDAY,
      skyDescription: 'Cubierto',
      skyIcon: 'cloudy',
      tMaxima: 21,
      tMinima: 17,
      windSpeed: 12,
      windDirection: 'NO',
      uvIndex: 2,
    },
    {
      fecha: SUNDAY,
      skyDescription: 'Despejado',
      skyIcon: 'sunny',
      tMaxima: 22,
      tMinima: 16,
      precipitationProbability: 24,
    },
  ],
}

const madridWeekday = (timestamp: number): string =>
  new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    timeZone: 'Europe/Madrid',
  }).format(timestamp)

// Run under TZ=America/New_York as well: a local getter would read the previous day
describe('forecast day helpers', () => {
  it('labels the Madrid weekday whatever the process timezone', () => {
    expect(formatDayLabel(TUESDAY)).toBe('Mar')
    expect(formatDayLabel(SATURDAY)).toBe('Sáb')
    expect(formatDayLabel(SUNDAY)).toBe('Dom')
  })

  it('agrees with Intl in Europe/Madrid for a whole week', () => {
    for (let offset = 0; offset < 7; offset += 1) {
      const day = TUESDAY + offset * 24 * 60 * 60 * 1000
      expect(formatFullDayName(day)).toBe(madridWeekday(day))
    }
  })

  it('highlights Saturday and Sunday only', () => {
    expect(isWeekend(SATURDAY)).toBe(true)
    expect(isWeekend(SUNDAY)).toBe(true)
    expect(isWeekend(TUESDAY)).toBe(false)
    expect(isWeekend(SUNDAY + 24 * 60 * 60 * 1000)).toBe(false)
  })
})

describe('WeatherWidget', () => {
  beforeEach(() => {
    serverFn.mockReset()
  })

  it('labels the next days with the Madrid weekday and marks the weekend', async () => {
    serverFn.mockResolvedValue({
      ...forecast,
      days: [
        forecast.days[0],
        { ...forecast.days[1], fecha: SUNDAY },
        { ...forecast.days[1], fecha: SUNDAY + 24 * 60 * 60 * 1000 },
      ],
    })
    render(<WeatherWidget beachCode="1" />)
    const sunday = await screen.findByText('Dom')
    expect(sunday.className).toContain('font-semibold')
    expect(screen.getByText('Lun').className).not.toContain('font-semibold')
  })

  it('names today and states when the data is from', async () => {
    serverFn.mockResolvedValue(forecast)
    render(<WeatherWidget beachCode="1" />)
    expect(await screen.findByText('Hoy, sábado')).toBeTruthy()
    expect(
      screen.getByText('Fuente: AEMET y Open-Meteo · Datos de las 01:45'),
    ).toBeTruthy()
  })

  it('describes the waves in plain words', async () => {
    serverFn.mockResolvedValue(forecast)
    render(<WeatherWidget beachCode="1" />)
    expect(
      await screen.findByText(/Oleaje hoy: bajo, 0,3 m del noroeste/),
    ).toBeTruthy()
    expect(screen.getByText('Llega de frente a la playa')).toBeTruthy()
  })

  it('shows no wave line when the forecast has none', async () => {
    serverFn.mockResolvedValue({ ...forecast, waves: undefined })
    render(<WeatherWidget beachCode="1" />)
    expect(await screen.findByText('Agua 22°')).toBeTruthy()
    expect(screen.queryByText(/Oleaje/)).toBeNull()
  })

  it('labels rain for screen readers', async () => {
    serverFn.mockResolvedValue(forecast)
    render(<WeatherWidget beachCode="1" />)
    expect(await screen.findByText('Lluvia')).toBeTruthy()
    expect(screen.getByText('24%')).toBeTruthy()
  })

  it('offers a retry when the forecast fails and recovers', async () => {
    serverFn.mockResolvedValueOnce(null)
    render(<WeatherWidget beachCode="1" />)
    const retry = await screen.findByRole('button', { name: 'Reintentar' })
    serverFn.mockResolvedValue(forecast)
    fireEvent.click(retry)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Previsión' })).toBeTruthy()
      expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull()
    })
  })
})
