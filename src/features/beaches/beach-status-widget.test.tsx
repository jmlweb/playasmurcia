import { render, screen, within } from '@testing-library/react'
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

async function renderFlagCircle(flag: BeachFlag) {
  fetchBeachStatus.mockResolvedValueOnce(statusWithFlag(flag))
  const { container, unmount } = render(
    <BeachStatusWidget beachName="Calarreona" municipalityName="Águilas" />,
  )
  const circle = await within(container).findByRole('img')
  const rendered = {
    label: circle.getAttribute('aria-label'),
    className: circle.className,
  }
  unmount()
  return rendered
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
    const closed = await renderFlagCircle('PLAYA CERRADA')
    const otherFlags = [
      ['VERDE', 'Bandera verde'],
      ['AMARILLA', 'Bandera amarilla'],
      ['ROJA', 'Bandera roja'],
      ['SIN BANDERA', 'Sin bandera'],
    ] as const

    expect(closed.label).toBe('Playa cerrada')
    for (const [flag, label] of otherFlags) {
      const other = await renderFlagCircle(flag)
      expect(other.label).toBe(label)
      expect(closed.className).not.toBe(other.className)
    }
  })
})
