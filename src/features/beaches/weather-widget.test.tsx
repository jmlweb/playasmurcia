import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BeachForecast } from '@/lib/forecast-days'

import { WeatherWidget } from './weather-widget'

const serverFn = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({ handler: () => serverFn }),
  }),
}))

const SATURDAY = Date.parse('2026-11-07T12:00:00Z')
const SUNDAY = Date.parse('2026-11-08T12:00:00Z')

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

describe('WeatherWidget', () => {
  beforeEach(() => {
    serverFn.mockReset()
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
