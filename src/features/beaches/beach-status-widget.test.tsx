import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { BeachFlag, BeachStatus112 } from '@/lib/beach-status-112'

import { BeachStatusWidget } from './beach-status-widget'
import { useBeachStatus } from './use-beach-status'

const fetchBeachStatus = vi.hoisted(() =>
  vi.fn<() => Promise<BeachStatus112 | null>>(),
)

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({ handler: () => fetchBeachStatus }),
  }),
}))

function Widget() {
  return <BeachStatusWidget state={useBeachStatus('Calarreona', 'Águilas')} />
}

const statusWithFlag = (flag: BeachFlag): BeachStatus112 => ({
  flag,
  seaState: 'BUENO',
  date: '15/08/2026',
  time: '10:00',
  isOffSeason: false,
})

async function renderFlagCircle(flag: BeachFlag) {
  fetchBeachStatus.mockResolvedValueOnce(statusWithFlag(flag))
  const { container, unmount } = render(<Widget />)
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
    render(<Widget />)

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

  it('explains that flags are seasonal instead of showing nothing', async () => {
    fetchBeachStatus.mockResolvedValueOnce({
      ...statusWithFlag('VERDE'),
      isOffSeason: true,
    })
    render(<Widget />)
    expect(
      await screen.findByText(
        'Bandera del 112: se publica de junio a septiembre.',
      ),
    ).toBeTruthy()
  })

  describe('in season', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('says the lookup failed rather than showing nothing', async () => {
      vi.useFakeTimers({
        now: new Date('2026-07-15T12:00:00'),
        toFake: ['Date'],
      })
      fetchBeachStatus.mockRejectedValueOnce(new Error('down'))
      render(<Widget />)
      expect(
        await screen.findByText(/No hemos podido consultar la bandera/),
      ).toBeTruthy()
    })

    it('says when the 112 has no flag for the beach', async () => {
      vi.useFakeTimers({
        now: new Date('2026-07-15T12:00:00'),
        toFake: ['Date'],
      })
      fetchBeachStatus.mockResolvedValueOnce(null)
      render(<Widget />)
      expect(
        await screen.findByText('El 112 no publica bandera para esta playa.'),
      ).toBeTruthy()
    })
  })
})
