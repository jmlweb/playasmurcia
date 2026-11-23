---
id: TSK-199
title: Fix: CI never runs validate-beaches.js, so invalid beach data deploys
status: pending
priority: P3
tags: []
created: 2026-11-23
source: report/RPT-082
depends-on: []
---

# Fix: CI never runs validate-beaches.js, so invalid beach data deploys

## Description

### Description

`scripts/validate-beaches.js` is the only guard for beach editorial data (LRN-037), but `.github/workflows/ci.yml` never runs it, and every push to `main` deploys. Invalid data (missing `shoreBearing`, unpaired `**`, `#` headings in `access`) passes the full Vitest suite and ships.

Source report: `.backlog/reports/complete/RPT-082-ci-never-runs-validate-beachesjs-so.md` (evidence and reproduction).

### Approach

Add a `node scripts/validate-beaches.js` step to `ci.yml` before the deploy step. It needs no env vars or network and passes on current `main` (0 errors, 0 warnings). Update `docs/development.md` accordingly.

## Acceptance Criteria

- [ ] CI runs node scripts/validate-beaches.js before the deploy step in .github/workflows/ci.yml
- [ ] A change to data/beaches.json that the validator rejects fails CI (verified with the reproduction in RPT-082)
- [ ] docs/development.md states that CI enforces the validator

## Notes

## Learnings

## Progress Log

- [2026-11-23] Created