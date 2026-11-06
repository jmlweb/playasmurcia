import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { fetchCoastToday } from '@/features/home/use-coast-today'
import { getModelContext, registerWebMcpTools } from '@/lib/webmcp'

import { createBeachTools } from './beach-tools'
import { getBeachFn, getBeachWeatherFn, searchBeachesFn } from './webmcp-server'

/**
 * Registers the site's WebMCP tools after hydration when the browser exposes
 * `document.modelContext`. Does nothing anywhere else.
 */
export function useWebMcp(): void {
  const navigate = useNavigate()

  useEffect(() => {
    const context = getModelContext()
    if (!context) return

    return registerWebMcpTools(
      context,
      createBeachTools({
        searchBeaches: (input) => searchBeachesFn({ data: input }),
        getBeach: (input) => getBeachFn({ data: input }),
        getBeachWeather: (input) => getBeachWeatherFn({ data: input }),
        getCoastToday: () => fetchCoastToday(),
        navigate: (target) => {
          void navigate(target)
        },
      }),
    )
  }, [navigate])
}
