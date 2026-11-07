// Runs under TZ=America/New_York (see `pnpm test:tz`): the old local getDay()
// read UTC midnight as the previous day there, so this file fails if that regresses.
import { describe, expect, it } from 'vitest'

import {
  formatDayLabel,
  formatFullDayName,
  isWeekend,
} from '@/features/beaches/weather-widget'

const tuesday = Date.UTC(2026, 9, 27)
const saturday = Date.UTC(2026, 10, 7)
const sunday = Date.UTC(2026, 10, 8)

// Skipped in the plain run, where the zone is whatever the machine uses
const isPinnedWestOfUtc = process.env.TZ === 'America/New_York'

describe.runIf(isPinnedWestOfUtc)(
  'forecast weekday helpers west of UTC',
  () => {
    it('labels the Madrid calendar day, not the local one', () => {
      // Guard that the zone really is west of UTC, otherwise the test proves nothing
      expect(new Date(tuesday).getDay()).toBe(1)
      expect(formatDayLabel(tuesday)).toBe('Mar')
      expect(formatFullDayName(tuesday)).toBe('martes')
    })

    it('highlights the Madrid weekend', () => {
      expect(isWeekend(saturday)).toBe(true)
      expect(isWeekend(sunday)).toBe(true)
      expect(isWeekend(tuesday)).toBe(false)
    })
  },
)
