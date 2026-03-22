# Next Steps: Database Migration

## Current Status

The database migration is nearly complete. The local database is populated, routes use async DB queries, and all tests pass (58 tests). What remains is setting up the production database and deploying.

### Completed

- [x] Database infrastructure (`src/db/schema.ts`, `src/db/client.ts`)
- [x] Async data access layer (`src/lib/db-data.ts`)
- [x] Migration and validation scripts
- [x] Local database populated (194 beaches, 9 municipalities, 2 seas, 9 services, 10 activities, 17 tags)
- [x] Route `playas/$slug.tsx` wired to database queries
- [x] Tests for db-data module (21 tests) + consistency checks against JSON source

### Remaining

## 1. Setup Turso Cloud

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Authenticate
turso auth login

# Create database
turso db create playasmurcia

# Get credentials
turso db show playasmurcia --url
turso db tokens create playasmurcia
```

## 2. Configure Production Environment Variables

### Cloudflare Workers

```bash
wrangler secret put TURSO_DATABASE_URL
wrangler secret put TURSO_AUTH_TOKEN
```

### Netlify

```bash
netlify env:set TURSO_DATABASE_URL "libsql://your-db.turso.io"
netlify env:set TURSO_AUTH_TOKEN "your-token"
```

## 3. Run Production Migration

```bash
TURSO_DATABASE_URL="libsql://your-db.turso.io" \
TURSO_AUTH_TOKEN="your-token" \
NODE_ENV=production \
pnpm tsx scripts/migrate-to-database.ts
```

## 4. Test and Deploy

```bash
# Test locally
pnpm dev

# Build
pnpm build

# Deploy
# Cloudflare: wrangler deploy
# Netlify: netlify deploy --prod
```

## Files Created

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Drizzle schema (9 tables) |
| `src/db/client.ts` | Turso/libSQL client |
| `src/lib/db-data.ts` | Async data access layer |
| `src/lib/db-data.test.ts` | Tests for DB data layer |
| `scripts/migrate-to-database.ts` | JSON to DB migration |
| `scripts/validate-migration.ts` | Migration validation |
| `drizzle.config.ts` | Drizzle Kit config |
| `.env.example` | Environment template |

## Rollback

If issues arise, revert imports from `db-data` back to `data`:

```typescript
// Rollback to JSON
import { getBeachBySlug } from "@/lib/data"
```

JSON files in `data/` are kept as backup.
