---
id: TSK-090
title: Reposition TanStack Devtools in Development
status: complete
priority: P3
tags: [tech-debt]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Reposition TanStack Devtools in Development

## Description

As a developer reviewing UI locally, I want devtools not to cover municipality cards or other primary content, so that screenshots and manual QA reflect real layout.

## Acceptance Criteria

- [x] In `import.meta.env.DEV`, the floating devtools control does not overlap interactive card content on `/municipios` at 1280×800 (move corner, adjust offset, or constrain z-index/stacking context).
- [x] No change to production bundles (devtools remain dev-only).

## Context

UI review (2026-03-30): `TanStackDevtools` in `src/routes/__root.tsx` uses `position: 'bottom-right'` and overlaps grid cards on `/municipios`.

## Source Reports

- `.backlog/reports/complete/RPT-026-ui-review-cross-cutting-findings-2026-03-30.md` — Important (devtools overlap)

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #090)
