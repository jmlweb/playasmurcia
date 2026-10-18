import { describe, expect, it, vi } from 'vitest'

import type { BeachToolDeps } from './beach-tools'

import { createBeachTools } from './beach-tools'

function makeDeps(overrides: Partial<BeachToolDeps> = {}): BeachToolDeps {
  return {
    searchBeaches: vi.fn(async () => ({
      total: 1,
      results: [],
      filters: { municipality: [2], dogFriendly: true as const },
      unresolved: [],
    })),
    getBeach: vi.fn(async () => null),
    getBeachWeather: vi.fn(async () => null),
    navigate: vi.fn(),
    ...overrides,
  }
}

const toolNamed = (deps: BeachToolDeps, name: string) => {
  const tool = createBeachTools(deps).find((t) => t.name === name)
  if (!tool) throw new Error(`missing tool ${name}`)
  return tool
}

describe('createBeachTools', () => {
  it('exposes three read-only tools with object schemas', () => {
    const tools = createBeachTools(makeDeps())
    expect(tools.map((t) => t.name)).toEqual([
      'search_beaches',
      'get_beach',
      'get_beach_weather',
    ])
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true)
      expect(tool.inputSchema).toMatchObject({ type: 'object' })
    }
  })

  it('search_beaches forwards input and navigates with the resolved filters', async () => {
    const deps = makeDeps()
    const input = { municipality: 'Águilas', dogFriendly: true }

    const result = await toolNamed(deps, 'search_beaches').execute(input)

    expect(deps.searchBeaches).toHaveBeenCalledWith(input)
    expect(deps.navigate).toHaveBeenCalledWith({
      to: '/explorar',
      search: { municipality: [2], dogFriendly: true },
    })
    expect(result).toMatchObject({ total: 1 })
  })

  it('get_beach opens the beach page when found', async () => {
    const deps = makeDeps({
      getBeach: vi.fn(async () => ({
        slug: 'cala-cortina',
        name: 'Cala Cortina',
      })) as never,
    })

    const result = await toolNamed(deps, 'get_beach').execute({
      slug: 'cala-cortina',
    })

    expect(deps.navigate).toHaveBeenCalledWith({
      to: '/playas/$slug',
      params: { slug: 'cala-cortina' },
    })
    expect(result).toMatchObject({ name: 'Cala Cortina' })
  })

  it('get_beach reports a missing beach without navigating', async () => {
    const deps = makeDeps()

    const result = await toolNamed(deps, 'get_beach').execute({ slug: 'nope' })

    expect(deps.navigate).not.toHaveBeenCalled()
    expect(result).toEqual({ error: 'Beach not found', slug: 'nope' })
  })

  it('get_beach_weather never navigates', async () => {
    const deps = makeDeps({
      getBeachWeather: vi.fn(async () => ({
        beach: 'X',
        current: null,
        forecast: [],
        sea: null,
      })),
    })

    const result = await toolNamed(deps, 'get_beach_weather').execute({
      slug: 'x',
    })

    expect(deps.navigate).not.toHaveBeenCalled()
    expect(result).toMatchObject({ beach: 'X' })
  })
})
