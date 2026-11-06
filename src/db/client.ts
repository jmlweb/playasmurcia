import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import type { Database } from './request-scope'

import { getDbScope } from './request-scope'
import * as schema from './schema'

export class DbScopeError extends Error {
  constructor() {
    super('Database accessed outside runWithDbScope in a Worker')
    this.name = 'DbScopeError'
  }
}

// Scripts and tests run in Node, where one long-lived client is safe
let processDb: Database | undefined

const isWorkerRuntime = (): boolean =>
  globalThis.navigator?.userAgent === 'Cloudflare-Workers'

function createDb(): Database {
  // DATABASE_URL first so local `file:./local.db` wins when both are in `.env`
  // (avoids hitting remote Turso without the latest schema during dev).
  const url =
    process.env.DATABASE_URL ||
    process.env.TURSO_DATABASE_URL ||
    'file:./local.db'
  const authToken = process.env.TURSO_AUTH_TOKEN

  return drizzle(createClient({ url, authToken }), { schema })
}

/**
 * Workers must not share a client across requests. Its concurrency limiter
 * starts a queued query in the context of whichever request frees a slot; that
 * query dies with that request, the slot is never released, and once all slots
 * are lost every later query waits forever.
 */
export function getDb(): Database {
  const scope = getDbScope()
  if (scope) {
    scope.db ??= createDb()
    return scope.db
  }
  if (isWorkerRuntime()) throw new DbScopeError()
  processDb ??= createDb()
  return processDb
}

// Keep backwards-compatible export that lazy-initializes
export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
