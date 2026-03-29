import { createClient } from '@libsql/client'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

let _db: LibSQLDatabase<typeof schema> | null = null

export function getDb(): LibSQLDatabase<typeof schema> {
  if (_db) return _db

  // DATABASE_URL first so local `file:./local.db` wins when both are in `.env`
  // (avoids hitting remote Turso without the latest schema during dev).
  const url =
    process.env.DATABASE_URL ||
    process.env.TURSO_DATABASE_URL ||
    'file:./local.db'
  const authToken = process.env.TURSO_AUTH_TOKEN

  const client = createClient({ url, authToken })
  _db = drizzle(client, { schema })
  return _db
}

// Keep backwards-compatible export that lazy-initializes
export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
