import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import { AsyncLocalStorage } from 'node:async_hooks'

import type * as schema from './schema'

export type Database = LibSQLDatabase<typeof schema>

type DbScope = { db?: Database }

// Kept apart from client.ts so the Worker entry can open a scope without
// loading the libSQL driver, which cached pages never need.
const dbScope = new AsyncLocalStorage<DbScope>()

export const getDbScope = (): DbScope | undefined => dbScope.getStore()

/**
 * Runs `run` with its own database scope. The client is created on first use
 * and is reachable only from this scope, so it is released with the request.
 *
 * It is not closed when `run` settles: the response body may still be
 * streaming, and the HTTP client holds no socket between queries.
 */
export const runWithDbScope = <T>(run: () => T): T => dbScope.run({}, run)
