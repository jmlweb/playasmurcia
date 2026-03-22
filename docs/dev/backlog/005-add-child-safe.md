# Task #005: Add Child Safe

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a parent, I want to know which beaches are safe for young children so that I can choose a suitable destination for my family.

## Acceptance Criteria

- [ ] `childSafe` boolean field added to schema
- [ ] Script `scripts/add-child-safe.js` created using Ollama
- [ ] All 194 beaches have a value assigned
- [ ] All Mar Menor beaches reviewed (typically safer)
- [ ] Beaches with "familiar" tag are childSafe: true
- [ ] Rocky beaches are childSafe: false
- [ ] Distribution is reasonable (~40% true)
- [ ] Database schema and migration updated
- [ ] Beach detail page displays child safe indicator

## Implementation Notes

Inferred from existing fields using Ollama:
- `tags` (familiar, aguas-tranquilas)
- `sea` (Mar Menor = calmer waters)
- `soilType` (fine sand preferred)
- `lifeguard` boolean

Script is one-time enrichment (delete after use).

## Files to Modify

- `src/db/schema.ts` (add field)
- `scripts/add-child-safe.js` (create, then delete)
- `data/beaches.json` (add field values)
- `src/routes/playas/$slug.tsx` (display field)

## Dependencies

-

## Progress Log

(No progress yet)

## Learnings

(None yet)
