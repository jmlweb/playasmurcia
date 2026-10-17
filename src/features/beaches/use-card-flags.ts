import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

import type { BeachFlag } from '@/lib/beach-status-112'

import { parseCardFlagsInput } from './card-flags-input'

const fetchCardFlags = createServerFn({ method: 'POST' })
  .validator(parseCardFlagsInput)
  .handler(async ({ data }) => {
    const [{ getAllBeaches, getMunicipalityMap }, { getBatchBeachFlags }] =
      await Promise.all([
        import('@/lib/db-data/beach-queries'),
        import('@/lib/beach-status-112'),
      ])
    const wanted = new Set(data.codes)
    const [beaches, municipalities] = await Promise.all([
      getAllBeaches(),
      getMunicipalityMap(),
    ])
    const flags = await getBatchBeachFlags(
      beaches
        .filter((beach) => wanted.has(beach.code))
        .map((beach) => ({
          code: beach.code,
          name: beach.name,
          municipalityName: municipalities.get(beach.municipality)?.name ?? '',
        })),
    )
    return Object.fromEntries(flags)
  })

/**
 * Loads current 112 flags for listing cards after mount, in one request for
 * the whole list. Cards without a flag render nothing extra.
 */
export function useCardFlags(
  beaches: readonly { code: string }[],
): Record<string, BeachFlag> {
  const [flags, setFlags] = useState<Record<string, BeachFlag>>({})

  useEffect(() => {
    if (beaches.length === 0) return
    let cancelled = false
    fetchCardFlags({ data: { codes: beaches.map(({ code }) => code) } })
      .then((result) => {
        if (!cancelled) setFlags(result)
      })
      .catch(() => {
        // Cards stay without flags
      })
    return () => {
      cancelled = true
    }
  }, [beaches])

  return flags
}
