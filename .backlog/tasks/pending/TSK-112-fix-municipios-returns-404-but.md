---
id: TSK-112
title: Fix: /municipios returns 404 but is listed in sitemap.xml
status: pending
priority: P2
tags: []
created: 2026-10-17
source: report/RPT-045
depends-on: []
---

# Fix: /municipios returns 404 but is listed in sitemap.xml

## Description

`GET /municipios` returns 404 but `sitemap.xml` lists it. `scripts/generate-sitemap.ts:29` hardcodes the URL; `src/routes/municipios/` has only `$slug.tsx` (no `index.tsx`). Navbar and footer link only to `/municipios/$slug`.

Preferred fix: add `src/routes/municipios/index.tsx` (the UI review template already expects it). Alternative: drop the line from the sitemap script and point breadcrumbs at `/explorar`.

Report: .backlog/reports/complete/RPT-045-municipios-returns-404-but-is.md

## Acceptance Criteria

- [ ] /municipios returns 200 with a municipality index page, or the URL is removed from the sitemap
- [ ] A test checks that every sitemap URL maps to an existing route
- [ ] docs/architecture.md routing updated if a route is added

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created