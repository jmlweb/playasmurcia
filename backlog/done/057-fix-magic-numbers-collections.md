# Task #057: Fix Magic Numbers in Collections

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a developer, I want collection filters to use named constants so that a schema migration doesn't silently break all collections.

## Context

Code quality audit (2026-03-29) found that `src/lib/collections.ts:40-166` uses raw numeric IDs (`tags.includes(1)`, `services.includes(6)`, `activities.includes(8)`) to filter beaches into collections. These are positional IDs from the database. If a migration adds a row before these IDs, every collection returns incorrect beaches.

## Acceptance Criteria

- [ ] All magic numbers in `collections.ts` replaced with named constants (e.g., `TAG_CALA = 1`, `SERVICE_PARKING = 6`)
- [ ] Constants defined in a single place (e.g., top of `collections.ts` or a shared constants file)
- [ ] Collection filters produce the same results as before (verify with tests or manual check)
- [ ] Consider: document that IDs are insertion-order-dependent and must be kept in sync with DB

## Notes

Report: `reports/done/code-quality-audit.md` (item 6). A more robust long-term fix would store collection membership as a DB tag rather than relying on positional IDs.
