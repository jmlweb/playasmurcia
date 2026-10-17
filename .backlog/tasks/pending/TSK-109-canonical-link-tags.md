---
id: TSK-109
title: Canonical Link Tags
status: pending
priority: P3
tags: [seo]
created: 2026-10-17
source: manual
depends-on: []
---

# Canonical Link Tags

## Description

As a site owner, I want every page to declare its canonical `www.playasmurcia.com` URL so that search engines index one URL per page instead of duplicates from the workers.dev preview host or query-string variants.

## Acceptance Criteria

- [ ] Every route renders exactly one `<link rel="canonical">` with an absolute `https://www.playasmurcia.com` URL
- [ ] Canonical URLs use the path only: no query string (explorer filters, sort) and no trailing-slash variants that differ from the sitemap
- [ ] Canonical URLs match the `<loc>` entries in `sitemap.xml` for the same pages
- [ ] Pages served from `playasmurcia.jmlweb.workers.dev` still point their canonical at `www.playasmurcia.com`
- [ ] Unit test for the canonical URL helper; `pnpm build`, `pnpm test` and `pnpm check` pass

## Notes

Found during the 2026-10-16 domain cutover: `src/` has no canonical tags at all. The apex already 301s to `www` through a Cloudflare Redirect Rule, but the workers.dev preview URL serves the full site, so it can be indexed as a duplicate.

- `SITE_URL` is defined in `src/lib/schema.ts` (`process.env.SITE_URL ?? 'https://www.playasmurcia.com'`). Note it reads `process.env`, so check the value is available where route `head()` runs, or use a shared constant.
- Route `head()` functions live in `src/routes/__root.tsx` (already returns `links`), `index.tsx`, `explorar/index.tsx`, `colecciones/index.tsx`, `colecciones/$slug.tsx`, `playas/$slug.tsx`, `municipios/$slug.tsx`. Prefer a small helper (e.g. `canonicalLink(path)`) over repeating the URL building.
- Check that a child route's canonical replaces, not duplicates, any root-level one.
- Consider `og:url` at the same time, using the same helper.

## Files to Modify

- `src/lib/schema.ts` (or a new helper next to it)
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/explorar/index.tsx`
- `src/routes/colecciones/index.tsx`
- `src/routes/colecciones/$slug.tsx`
- `src/routes/playas/$slug.tsx`
- `src/routes/municipios/$slug.tsx`

## Dependencies

-

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #109)
