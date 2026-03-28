import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { config as loadEnv } from "dotenv"
import { defineConfig } from "drizzle-kit"

// drizzle-kit does not load .env (unlike Vite). Match what developers expect from `pnpm dev`.
const rootDir = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(rootDir, ".env") })

// Must match src/db/client.ts: same DB the app uses when you run `pnpm dev`.
const url =
  process.env.DATABASE_URL ||
  process.env.TURSO_DATABASE_URL ||
  "file:./local.db"
const authToken = process.env.TURSO_AUTH_TOKEN

const isFileDb = url.startsWith("file:")

if (!isFileDb && !authToken?.trim()) {
  throw new Error(
    "Remote DB URL is set but TURSO_AUTH_TOKEN is missing or empty. " +
      "Add it to .env (see .env.example). For local file DB only: set DATABASE_URL=file:./local.db " +
      "or unset TURSO_DATABASE_URL before push.",
  )
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
})
