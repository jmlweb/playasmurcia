---
id: TSK-136
title: Expose address and postalCode fields
status: complete
priority: P3
tags: [data, seo]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Expose address and postalCode fields

## Description

`address` (43 beaches) and `postalCode` (42 beaches) exist in `data/beaches.json` but are not in `src/types/beach.ts`, `src/db/schema.ts` or `docs/data-schema.md`, so the site does not use them. Expose them in the access block and in structured data.

## Acceptance Criteria

- [x] Beach type, Drizzle schema and migration include address and postalCode — evidence: src/types/beach.ts, src/db/schema.ts (address, postal_code), beach-mapper.ts, migrate-to-database.ts; prod ALTER TABLE run by hand 2026-11-08 (2026-11-08)
- [x] Shown on the beach page when present — evidence: LocationMap renders Dirección: … · CP … (Playwright on /playas/playa-de-el-rincon) (2026-11-08)
- [x] JSON-LD carries a schema.org PostalAddress — evidence: generateBeachSchema PostalAddress streetAddress/postalCode; schema.test.ts (2026-11-08)
- [x] docs/data-schema.md updated — evidence: docs/data-schema.md address/postalCode rows (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-08] Started
- [2026-11-08] Dropped 10 address values that only repeated the municipality (Lorca); stripped the Acceso: prefix on 3. Prod migrated and validate-migration.ts 18/18 passed.
- [2026-11-08] Completed