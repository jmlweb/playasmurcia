---
id: TSK-006
title: Add Natural Shade
status: complete
priority: P3
tags: [data]
created: 2026-03-22
source: manual
depends-on: []
completed: 2026-03-27
---

# Add Natural Shade

## Description

As a beachgoer, I want to know which beaches have natural shade so that I can avoid bringing parasols or choose shaded spots in summer.

## Acceptance Criteria

- [ ] `naturalShade` boolean field added to schema
- [ ] Script `scripts/add-natural-shade.js` created using Ollama
- [ ] All 194 beaches have a value assigned
- [ ] Beaches with "acantilados" tag reviewed
- [ ] Calas with high walls are typically true
- [ ] Wide urban beaches are typically false
- [ ] Distribution is reasonable (~25% true)
- [ ] Database schema and migration updated
- [ ] Beach detail page displays natural shade indicator

## Notes

Inferred from existing fields using Ollama:
- `description` (mentions pines, cliffs, trees)
- `tags` (acantilados)
- `orientation` (east-facing cliffs provide afternoon shade)

Script is one-time enrichment (delete after use).

## Files to Modify

- `src/db/schema.ts` (add field)
- `scripts/add-natural-shade.js` (create, then delete)
- `data/beaches.json` (add field values)
- `src/routes/playas/$slug.tsx` (display field)

## Dependencies

-

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #006)
