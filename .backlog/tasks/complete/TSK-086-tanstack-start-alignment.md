---
id: TSK-086
title: TanStack Start Technical Alignment
status: complete
priority: P4
tags: [tech-debt]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# TanStack Start Technical Alignment

## Description

As a developer, I want the codebase to follow TanStack Start best practices so that builds are clean and the framework is used idiomatically.

## Acceptance Criteria

- [x] Test replacing dynamic `await import('@/lib/db-data')` inside server function handlers with top-level static imports (kept dynamic — required for workerd module isolation)
- [x] Consider adding `src/start.ts` global middleware for request logging, security headers (CSP, HSTS), rate limiting, centralized cache-control (handled via `public/_headers` Cloudflare file)
- [x] Remove `"nitro": "latest"` from direct `dependencies` in `package.json` (already removed — not present in current package.json)

## Context

TanStack Start alignment report identified remaining technical improvements after #064 addressed the critical items.

## Source Reports

- `.backlog/reports/complete/RPT-021-tanstack-start-alignment-report.md` — TS2–TS4

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #086)
