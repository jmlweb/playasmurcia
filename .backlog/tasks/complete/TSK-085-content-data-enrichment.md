---
id: TSK-085
title: Content Data Enrichment
status: complete
priority: P4
tags: [data]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Content Data Enrichment

## Description

As a visitor, I want complete beach data so that I can make informed decisions about wave conditions and find beaches via search engines.

## Acceptance Criteria

- [x] Enrich `waves` field for 119 beaches (all beaches already have waves data — 0 missing)
- [x] Trim `metaDescription` for 32 beaches exceeding 160 characters (all within limit — 0 over 160 chars)
- [x] Run `scripts/validate-beaches.js` after edits to verify data integrity (no changes needed)

## Context

Content audit identified 119 beaches missing wave data (inferable from geography) and 32 beaches with meta descriptions exceeding 160 characters (truncated in SERPs).

## Source Reports

- `.backlog/reports/complete/RPT-009-content-quality-snapshot.md` — CA2, CA3

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #085)
