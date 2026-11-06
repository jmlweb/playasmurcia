// @vitest-environment node
import { sql } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Database } from './request-scope'

import { db, DbScopeError, getDb } from './client'
import { runWithDbScope } from './request-scope'

// Well above libSQL's limiter, so the first request holds every slot
const SATURATING_QUERIES = 100

const hangingFetch = vi.fn(() => new Promise<Response>(() => undefined))

const nextTask = () => new Promise((resolve) => setTimeout(resolve, 1))

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
      await nextTask()
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
      Array.from({ length: SATURATING_QUERIES }).forEach(startQuery)
    })
    await vi.waitFor(() => {
      expect(hangingFetch).toHaveBeenCalled()
    })
    await nextTask()
    const slots = hangingFetch.mock.calls.length
    expect(slots).toBeLessThan(SATURATING_QUERIES)

    runWithDbScope(startQuery)
    await vi.waitFor(() => {
      expect(hangingFetch).toHaveBeenCalledTimes(slots + 1)
    })
  })

  // Node stands in for workerd here: this pins the scope contract only
  it('keeps the client for work that outlives the scope callback', async () => {
    const { first, late } = await runWithDbScope(async () => {
      const inHandler = getDb()
      return {
        first: inHandler,
        late: new Promise<Database>((resolve) => {
          setTimeout(() => {
            resolve(getDb())
          }, 1)
        }),
      }
    })

    expect(await late).toBe(first)
  })

  it('throws outside a scope', () => {
    expect(() => getDb()).toThrow(DbScopeError)
    expect(() => db.query).toThrow(DbScopeError)
  })
})
