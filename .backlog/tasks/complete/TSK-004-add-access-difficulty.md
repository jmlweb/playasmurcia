---
id: TSK-004
title: Add Access Difficulty
status: complete
priority: P3
tags: [data]
created: 2026-03-22
source: manual
depends-on: []
completed: 2026-03-27
---

# Add Access Difficulty

## Description

As a user, I want to know how difficult it is to access each beach so that I can plan my visit based on physical requirements.

## Acceptance Criteria

- [ ] `accessDifficulty` field added to schema (`"easy" | "moderate" | "hard"`)
- [ ] Script `scripts/add-access-difficulty.js` created using Ollama
- [ ] All 194 beaches have a value assigned
- [ ] Beaches with "accesible" tag are "easy"
- [ ] Beaches with "acantilados" or "aislada" tags reviewed for correctness
- [ ] Distribution is reasonable (~60% easy, ~30% moderate, ~10% hard)
- [ ] Database schema and migration updated
- [ ] Beach detail page displays access difficulty

## Notes

Inferred from existing fields using Ollama:
- `access` field (main source)
- `tags` array (acantilados, aislada, salvaje)
- `services` array (wheelchair-ramp indicates easy)

Script is one-time enrichment (delete after use per project rules).

## Files to Modify

- `src/db/schema.ts` (add field)
- `scripts/add-access-difficulty.js` (create, then delete)
- `data/beaches.json` (add field values)
- `src/routes/playas/$slug.tsx` (display field)

## Dependencies

-

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #004)
