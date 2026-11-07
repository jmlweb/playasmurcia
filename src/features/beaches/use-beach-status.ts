import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { BeachStatus112 } from '@/lib/beach-status-112'

import { isFlagSeason } from '@/lib/beach-status-labels'

const fetchBeachStatus = createServerFn({ method: 'GET' })
  .validator((data: { beachName: string; municipalityName: string }) => {
    if (typeof data.beachName !== 'string' || !data.beachName.trim()) {
      throw new Error('Invalid beach name')
    }
    if (
      typeof data.municipalityName !== 'string' ||
      !data.municipalityName.trim()
    ) {
      throw new Error('Invalid municipality name')
    }
    return {
      beachName: data.beachName.trim(),
      municipalityName: data.municipalityName.trim(),
    }
  })
  .handler(async ({ data }) => {
    const [{ getBeachStatus }, { withTimeout }] = await Promise.all([
      import('@/lib/beach-status-112'),
      import('@/lib/beach-forecast'),
    ])
    return withTimeout(getBeachStatus(data.beachName, data.municipalityName))
  })

export type BeachStatusState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'notfound'; isInSeason: boolean }
  | { status: 'error'; isInSeason: boolean }
  | { status: 'success'; data: BeachStatus112 }

export function useBeachStatus(
  beachName: string,
  municipalityName: string,
): BeachStatusState {
  const [state, setState] = useState<BeachStatusState>({ status: 'idle' })

  // Reset to loading during render (not in an effect) when the target beach changes
  const requestKey = `${beachName}|${municipalityName}`
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey)
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    let cancelled = false

    fetchBeachStatus({ data: { beachName, municipalityName } })
      .then((data) => {
        if (cancelled) return
        setState(
          data
            ? { status: 'success', data }
            : { status: 'notfound', isInSeason: isFlagSeason(new Date()) },
        )
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error', isInSeason: isFlagSeason(new Date()) })
        }
      })

    return () => {
      cancelled = true
    }
  }, [beachName, municipalityName])

  return state
}
