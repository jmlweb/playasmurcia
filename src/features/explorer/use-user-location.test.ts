import { afterEach, describe, expect, it, vi } from 'vitest'

import { hasGeolocationGrant } from './use-user-location'

const stubPermissions = (permissions: unknown) => {
  vi.stubGlobal('navigator', { permissions })
}

describe('hasGeolocationGrant', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    ['granted', true],
    ['prompt', false],
    ['denied', false],
  ])('maps the %s state to %s', async (state, expected) => {
    stubPermissions({ query: vi.fn().mockResolvedValue({ state }) })

    await expect(hasGeolocationGrant()).resolves.toBe(expected)
  })

  it('reports no grant when the Permissions API is missing', async () => {
    stubPermissions(undefined)

    await expect(hasGeolocationGrant()).resolves.toBe(false)
  })

  it('reports no grant when the browser rejects the query', async () => {
    stubPermissions({ query: vi.fn().mockRejectedValue(new TypeError()) })

    await expect(hasGeolocationGrant()).resolves.toBe(false)
  })
})
