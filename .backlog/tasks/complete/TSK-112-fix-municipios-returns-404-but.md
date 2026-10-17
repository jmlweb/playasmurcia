---
id: TSK-112
title: Fix: /municipios returns 404 but is listed in sitemap.xml
status: complete
priority: P2
tags: []
created: 2026-10-17
source: report/RPT-045
depends-on: []
started: 2026-10-17
completed: 2026-10-17
---

# Fix: /municipios returns 404 but is listed in sitemap.xml

## Description

`GET /municipios` returns 404 but `sitemap.xml` lists it. `scripts/generate-sitemap.ts:29` hardcodes the URL; `src/routes/municipios/` has only `$slug.tsx` (no `index.tsx`). Navbar and footer link only to `/municipios/$slug`.

Preferred fix: add `src/routes/municipios/index.tsx` (the UI review template already expects it). Alternative: drop the line from the sitemap script and point breadcrumbs at `/explorar`.

Report: .backlog/reports/complete/RPT-045-municipios-returns-404-but-is.md

## Acceptance Criteria

- [x] /municipios returns 200 with a municipality index page, or the URL is removed from the sitemap
- [x] A test checks that every sitemap URL maps to an existing route
- [x] docs/architecture.md routing updated if a route is added

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] Added /municipios index route; sitemap-routes test checks every sitemap URL maps to a route; architecture doc updated.
- [2026-10-17] Started
- [2026-10-17] Completed