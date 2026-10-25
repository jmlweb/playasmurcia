---
id: LRN-024
title: Drizzle inArray returns table order, so lookups by a code list must re-order
status: active
tags: [bug, database, beach-detail]
task: TSK-126
created: 2026-10-25
---

## Context
`getNearbyBeaches` fetched beaches with `inArray(code, codes)`. SQLite returns those rows in table order, not in the order of the `IN (...)` list, so the distance-sorted `nearby` array lost its order.
## Insight
Any query that takes an ordered list of keys must re-order its rows itself. Build a `Map` by key and walk the input list with `flatMap`, which also drops unknown keys. In `data/beaches.json`, 190 of 193 `nearby` lists are sorted by haversine distance; the other 3 are not, which is a data issue, not a query issue.
## Application
`scripts/migrate-to-database.ts` reads `NODE_ENV`; this machine exports `NODE_ENV=production`, so run it with `env -u NODE_ENV DATABASE_URL=file:./local.db` or it targets the empty Turso URL. `pnpm dev` cannot use `file:` URLs (workerd), and without the `turso` CLI no local page render is possible; prove UI order with component tests instead.
