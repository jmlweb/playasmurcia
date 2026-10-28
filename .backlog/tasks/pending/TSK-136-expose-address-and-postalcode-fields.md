---
id: TSK-136
title: Expose address and postalCode fields
status: pending
priority: P3
tags: [data, seo]
created: 2026-10-28
source: manual
depends-on: []
---

# Expose address and postalCode fields

## Description

`address` (43 beaches) and `postalCode` (42 beaches) exist in `data/beaches.json` but are not in `src/types/beach.ts`, `src/db/schema.ts` or `docs/data-schema.md`, so the site does not use them. Expose them in the access block and in structured data.

## Acceptance Criteria

- [ ] Beach type, Drizzle schema and migration include address and postalCode
- [ ] Shown on the beach page when present
- [ ] JSON-LD carries a schema.org PostalAddress
- [ ] docs/data-schema.md updated

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created