// @vitest-environment node
import { sql } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db, DbScopeError, getDb } from './client'
import { runWithDbScope } from './request-scope'

const CLIENT_QUERY_LIMIT = 20

const hangingFetch = vi.fn(() => new Promise<Response>(() => undefined))

// Drizzle queries are lazy thenables: nothing is sent until `then` is called
const startQuery = () => {
  void db.run(sql`select 1`).then(() => undefined)
}

describe('database request scope', () => {
  beforeEach(() => {
    vi.stubEnv('DATABASE_URL', 'http://db.test')
    vi.stubGlobal('fetch', hangingFetch)
    hangingFetch.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('reuses one client across property accesses in a scope', () => {
    runWithDbScope(() => {
      const first = getDb()
      expect(db.query).toBe(first.query)
      expect(getDb()).toBe(first)
    })
  })

  it('gives concurrent scopes separate clients that survive awaits', async () => {
    const useScope = async () => {
      const before = getDb()
      await new Promise((resolve) => setTimeout(resolve, 1))
      expect(getDb()).toBe(before)
      return before
    }

    const [first, second] = await Promise.all([
      runWithDbScope(useScope),
      runWithDbScope(useScope),
    ])

    expect(first).not.toBe(second)
  })

  // A shared client would leave the second request queued behind the first
  // one's stuck queries, which is how the Worker wedged.
  it('does not queue a request behind queries of another request', async () => {
    runWithDbScope(() => {
      Array.from({ length: CLIENT_QUERY_LIMIT + 5 }).forEach(startQuery)
    })
    await vi.waitFor(() => {
      expect(hangingFetch).toHaveBeenCalledTimes(CLIENT_QUERY_LIMIT)
    })

    runWithDbScope(startQuery)
    await vi.waitFor(() => {
      expect(hangingFetch).toHaveBeenCalledTimes(CLIENT_QUERY_LIMIT + 1)
    })
  })

  it('throws outside a scope in a Worker', () => {
    vi.stubGlobal('navigator', { userAgent: 'Cloudflare-Workers' })

    expect(() => getDb()).toThrow(DbScopeError)
    expect(() => db.query).toThrow(DbScopeError)
  })

  it('keeps one client outside a scope in Node', () => {
    expect(getDb()).toBe(getDb())
  })
})
