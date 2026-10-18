import type { BeachSearchParams } from '@/lib/beach-filters'
import type { WebMcpTool, WebMcpToolInput } from '@/lib/webmcp'

import type {
  getBeachFn,
  getBeachWeatherFn,
  searchBeachesFn,
} from './webmcp-server'

import { MAX_SEARCH_LIMIT, SearchSortValues } from './tool-input'

export type WebMcpNavigation =
  | { to: '/explorar'; search: BeachSearchParams }
  | { to: '/playas/$slug'; params: { slug: string } }

export type BeachToolDeps = {
  searchBeaches: (input: WebMcpToolInput) => ReturnType<typeof searchBeachesFn>
  getBeach: (input: WebMcpToolInput) => ReturnType<typeof getBeachFn>
  getBeachWeather: (
    input: WebMcpToolInput,
  ) => ReturnType<typeof getBeachWeatherFn>
  navigate: (target: WebMcpNavigation) => void
}

const slugSchema = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
      description:
        'Beach slug as returned by search_beaches (for example "cala-cortina").',
    },
  },
  required: ['slug'],
} as const

const searchSchema = {
  type: 'object',
  properties: {
    query: {
      type: 'string',
      description: 'Free text matched against beach names (accents ignored).',
    },
    municipality: {
      type: 'string',
      description:
        'Municipality name, e.g. "Cartagena", "Águilas", "Mazarrón".',
    },
    sea: {
      type: 'string',
      description: '"Mar Menor" or "Mar Mediterráneo".',
    },
    services: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Required services by Spanish name, e.g. ["Duchas", "Aseos", "Aparcamiento"].',
    },
    activities: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Required activities by Spanish name, e.g. ["Buceo", "Kayak"].',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Beach tags by Spanish name, e.g. ["Cala", "Virgen"].',
    },
    dogFriendly: {
      type: 'boolean',
      description: 'Only beaches that allow dogs.',
    },
    lifeguard: {
      type: 'boolean',
      description: 'Only beaches with lifeguards.',
    },
    childSafe: { type: 'boolean', description: 'Only child-friendly beaches.' },
    naturalShade: {
      type: 'boolean',
      description: 'Only beaches with natural shade.',
    },
    nudist: { type: 'boolean', description: 'Only nudist beaches.' },
    accessDifficulty: {
      type: 'string',
      enum: ['easy', 'moderate', 'hard'],
      description: 'How hard the beach is to reach.',
    },
    occupancy: {
      type: 'string',
      enum: ['low', 'medium', 'high'],
      description: 'Summer crowd level.',
    },
    sort: {
      type: 'string',
      enum: [...SearchSortValues],
      description: 'Result order; defaults to recommended.',
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: MAX_SEARCH_LIMIT,
      description: 'Maximum results to return (default 10).',
    },
  },
} as const

/**
 * Tools exposed to in-browser agents. Read-only against the site data; the
 * only side effect is navigating the page so the user sees what the agent found.
 */
export function createBeachTools(deps: BeachToolDeps): WebMcpTool[] {
  return [
    {
      name: 'search_beaches',
      description:
        'Search the 190+ beaches of the Región de Murcia (Spain) by name, municipality, sea, services, activities, tags and accessibility flags. Returns beach summaries with their slug and URL, and shows the results on the page.',
      inputSchema: searchSchema,
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const result = await deps.searchBeaches(input)
        deps.navigate({ to: '/explorar', search: result.filters })
        return result
      },
    },
    {
      name: 'get_beach',
      description:
        'Full details of one beach by slug: description, access, services, activities, nearby beaches and URL. Opens the beach page.',
      inputSchema: slugSchema,
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const beach = await deps.getBeach(input)
        if (!beach) return { error: 'Beach not found', slug: input.slug }
        deps.navigate({ to: '/playas/$slug', params: { slug: beach.slug } })
        return beach
      },
    },
    {
      name: 'get_beach_weather',
      description:
        'Current weather, 3-day forecast, water temperature and wave height for one beach by slug.',
      inputSchema: slugSchema,
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const weather = await deps.getBeachWeather(input)
        return weather ?? { error: 'Beach not found', slug: input.slug }
      },
    },
  ]
}
