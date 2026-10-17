---
id: RPT-045
title: `/municipios` returns 404 but is listed in `sitemap.xml`
type: bug
severity: high
status: triaged
created: 2026-10-17
triaged: 2026-10-17
task-id: TSK-112
---

- **Found**: 2026-10-17, against https://www.playasmurcia.com
- **Area**: `src/routes/municipios/`, sitemap generation

## Observed

`GET /municipios` returns 404. `sitemap.xml` lists `https://www.playasmurcia.com/municipios` as its second URL. `src/routes/municipios/` has only `$slug.tsx`; there is no `index.tsx`. The 404 is also the only response for the parent path of every `/municipios/<slug>` page, so any breadcrumb or manual URL trimming leads to a dead end.

## Expected

Either a municipality index page exists, or the sitemap does not list it.

## Repro

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.playasmurcia.com/municipios   # 404
curl -s https://www.playasmurcia.com/sitemap.xml | grep -c '/municipios<'            # 1
```

## Suggested fix

Preferred: add `src/routes/municipios/index.tsx` (the UI review template already expects it). Otherwise, remove the URL from the sitemap and point breadcrumbs at `/explorar`. Add a test that every sitemap URL maps to an existing route.

## Impact

A 404 in the sitemap hurts crawl quality and is a dead link for users.