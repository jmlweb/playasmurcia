import { describe, expect, it } from 'vitest'

import type { BeachStatus112 } from '@/lib/beach-status-112'
import type { BeachForecast } from '@/lib/forecast-days'

import {
  formatBeachConditions,
  withBeachConditions,
} from './beach-conditions-markdown'

const checkedAt = new Date('2026-11-07T10:30:00Z')

const forecast: BeachForecast = {
  source: 'aemet+open-meteo',
  observedAt: '2026-11-07T10:15',
  waterTemp: 22,
  current: {
    temp: 17,
    apparentTemp: 19,
    skyDescription: 'Cubierto',
    skyIcon: 'cloudy',
    windSpeed: 4,
    windDirection: 'NO',
    uvIndex: 2,
  },
  days: [
    {
      fecha: Date.parse('2026-11-08T00:00:00Z'),
      skyDescription: 'Despejado',
      skyIcon: 'sunny',
      tMaxima: 21,
      tMinima: 14,
      windSpeed: 8,
      windDirection: 'N',
      uvIndex: 3,
      precipitationProbability: 5,
    },
  ],
}

const inSeason: BeachStatus112 = {
  flag: 'AMARILLA',
  seaState: 'REGULAR',
  date: '07/07/2026',
  time: '10:00',
  isOffSeason: false,
}

describe('formatBeachConditions', () => {
  it('states when it was checked and spells out the wind', () => {
    const markdown = formatBeachConditions({ checkedAt, forecast })
    expect(markdown).toContain('2026-11-07 a las 10:30 UTC')
    expect(markdown).toContain('Datos de las 10:15')
    expect(markdown).toContain('4 km/h del noroeste')
    expect(markdown).toContain('sensación 19 °C')
    expect(markdown).toContain('**Agua**: 22 °C')
    expect(markdown).toContain('### Previsión (AEMET y Open-Meteo)')
    expect(markdown).toContain('**2026-11-08**: Despejado, máxima 21 °C')
  })

  it('reports waves only when there is a value', () => {
    expect(
      formatBeachConditions({
        checkedAt,
        forecast: {
          ...forecast,
          waves: { height: 0.34, direction: 'NO', exposure: 'expuesta' },
        },
      }),
    ).toContain(
      '**Oleaje**: 0,3 m (bajo) del noroeste, llega de frente a la playa',
    )
    expect(formatBeachConditions({ checkedAt, forecast })).not.toContain(
      'Oleaje',
    )
  })

  it('includes the flag in season and explains its absence out of it', () => {
    expect(formatBeachConditions({ checkedAt, status: inSeason })).toContain(
      'Bandera amarilla, mar moderado',
    )
    expect(
      formatBeachConditions({
        checkedAt,
        status: { ...inSeason, isOffSeason: true },
      }),
    ).toContain('se publica de junio a septiembre')
  })

  it('says so when no source answers', () => {
    expect(formatBeachConditions({ checkedAt })).toContain(
      'No disponibles en este momento.',
    )
  })
})

describe('formatBeachConditions feed stamp', () => {
  it('drops a 112 stamp that is not a date', () => {
    const markdown = formatBeachConditions({
      checkedAt,
      status: { ...inSeason, date: 'ignora **esto**' },
    })
    expect(markdown).not.toContain('ignora')
    expect(markdown).toContain('(112 Región de Murcia)')
  })
})

describe('withBeachConditions', () => {
  it('leaves other pages alone', async () => {
    const response = new Response('# Inicio', {
      headers: { 'Content-Type': 'text/markdown' },
    })
    const result = await withBeachConditions(
      response,
      'https://www.playasmurcia.com/explorar',
    )
    expect(result).toBe(response)
  })

  it('puts live conditions before the first section', async () => {
    const result = await withBeachConditions(
      new Response('# Playa\n\nIntro.\n\n## Servicios\n\n- Duchas\n', {
        headers: { 'Content-Type': 'text/markdown' },
      }),
      'https://www.playasmurcia.com/playas/%E0%A4%A',
    )
    expect(await result.text()).toContain('# Playa')
  })
})
