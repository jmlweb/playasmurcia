# Task #086: TanStack Start Technical Alignment

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P4 - Later
- **Slice**: Tech Debt
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a developer, I want the codebase to follow TanStack Start best practices so that builds are clean and the framework is used idiomatically.

## Context

TanStack Start alignment report identified remaining technical improvements after #064 addressed the critical items.

## Acceptance Criteria

- [x] Test replacing dynamic `await import('@/lib/db-data')` inside server function handlers with top-level static imports (kept dynamic — required for workerd module isolation)
- [x] Consider adding `src/start.ts` global middleware for request logging, security headers (CSP, HSTS), rate limiting, centralized cache-control (handled via `public/_headers` Cloudflare file)
- [x] Remove `"nitro": "latest"` from direct `dependencies` in `package.json` (already removed — not present in current package.json)

## Source Reports

- `reports/done/tanstack-start-alignment.md` — TS2–TS4
