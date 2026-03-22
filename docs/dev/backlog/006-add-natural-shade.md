# Task #006: Add Natural Shade

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

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

## Implementation Notes

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

## Progress Log

(No progress yet)

## Learnings

(None yet)
