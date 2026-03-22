import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

function createDbClient() {
  const isProduction = process.env.NODE_ENV === "production"

  const client = createClient({
    url: isProduction
      ? process.env.TURSO_DATABASE_URL!
      : process.env.DATABASE_URL || "file:./local.db",
    authToken: isProduction ? process.env.TURSO_AUTH_TOKEN : undefined,
  })

  return drizzle(client, { schema })
}

export const db = createDbClient()
