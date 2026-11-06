// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DbScopeError, getDb } from '@/db/client'

vi.mock('@tanstack/react-start/server', () => ({
  createServerEntry: <T>(entry: T) => entry,
  createStartHandler: () => async () => {
    getDb()
    return new Response('ok', { headers: { 'content-type': 'text/plain' } })
  },
  defaultStreamHandler: () => undefined,
}))

describe('Worker entry', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('runs the app inside a database scope', async () => {
    vi.stubEnv('DATABASE_URL', 'http://db.test')
    vi.stubGlobal('navigator', { userAgent: 'Cloudflare-Workers' })
    expect(() => getDb()).toThrow(DbScopeError)

    const { default: worker } = await import('./server')
    const response = await worker.fetch(
      new Request('https://www.playasmurcia.com/'),
      {},
      { waitUntil: () => undefined },
    )

    expect(response.status).toBe(200)
  })
})
