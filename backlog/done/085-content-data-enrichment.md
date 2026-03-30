# Task #085: Content Data Enrichment

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P4 - Later
- **Slice**: Data
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want complete beach data so that I can make informed decisions about wave conditions and find beaches via search engines.

## Context

Content audit identified 119 beaches missing wave data (inferable from geography) and 32 beaches with meta descriptions exceeding 160 characters (truncated in SERPs).

## Acceptance Criteria

- [x] Enrich `waves` field for 119 beaches (all beaches already have waves data — 0 missing)
- [x] Trim `metaDescription` for 32 beaches exceeding 160 characters (all within limit — 0 over 160 chars)
- [x] Run `scripts/validate-beaches.js` after edits to verify data integrity (no changes needed)

## Source Reports

- `reports/done/content-audit.md` — CA2, CA3
