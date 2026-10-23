import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { BeachFlag, BeachStatus112 } from '@/lib/beach-status-112'

import { BeachStatusWidget } from './beach-status-widget'

const fetchBeachStatus = vi.hoisted(() =>
  vi.fn<() => Promise<BeachStatus112 | null>>(),
)

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({ handler: () => fetchBeachStatus }),
  }),
}))

const statusWithFlag = (flag: BeachFlag): BeachStatus112 => ({
  flag,
  seaState: 'BUENO',
  date: '15/08/2026',
  time: '10:00',
  isOffSeason: false,
})

async function renderWidgetWithFlag(flag: BeachFlag) {
  fetchBeachStatus.mockResolvedValueOnce(statusWithFlag(flag))
  const { unmount } = render(
    <BeachStatusWidget beachName="Calarreona" municipalityName="Águilas" />,
  )
  const circle = await screen.findByRole('img')
  const result = {
    label: circle.getAttribute('aria-label'),
    className: circle.className,
  }
  unmount()
  return result
}

describe('BeachStatusWidget', () => {
  it('labels a closed beach "Playa cerrada"', async () => {
    fetchBeachStatus.mockResolvedValueOnce(statusWithFlag('PLAYA CERRADA'))
    render(
      <BeachStatusWidget beachName="Calarreona" municipalityName="Águilas" />,
    )

    expect(await screen.findByText('Playa cerrada')).toBeTruthy()
    expect(screen.queryByText('Sin bandera')).toBeNull()
  })

  it('gives a closed beach its own colour', async () => {
    const closed = await renderWidgetWithFlag('PLAYA CERRADA')
    const others = await Promise.all(
      (['VERDE', 'AMARILLA', 'ROJA', 'SIN BANDERA'] as const).map(
        renderWidgetWithFlag,
      ),
    )

    expect(closed.label).toBe('Playa cerrada')
    for (const other of others) {
      expect(closed.className).not.toBe(other.className)
    }
  })
})
