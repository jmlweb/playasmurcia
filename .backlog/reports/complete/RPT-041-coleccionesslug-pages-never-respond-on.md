---
id: RPT-041
title: `/colecciones/<slug>` pages never respond on production
type: bug
severity: critical
status: triaged
created: 2026-10-17
triaged: 2026-10-17
task-id: TSK-110
---

- **Found**: 2026-10-17, against https://www.playasmurcia.com
- **Area**: `src/routes/colecciones/$slug.tsx`

## Observed

`/colecciones/snorkel`, `calas-escondidas`, `playas-familiares`, `bandera-azul` and `accesibles` all time out (curl `000`) at 12-30 s. `/colecciones` (the index) returns 200 in about 0.4 s. All 13 collection URLs are listed in `sitemap.xml`; the five above were the ones tested.

## Expected

Collection detail pages render in under 2 s.

## Repro

```bash
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" --max-time 30 https://www.playasmurcia.com/colecciones/snorkel
```

## Likely cause (unverified)

Same suspect as QA-1: a weather call without a timeout in the loader. Check the loader for `fetchBatchCardWeather` first. Beach detail pages (`/playas/<slug>`) are fine, so the problem is probably specific to the batch weather path.

## Suggested fix

Fix together with QA-1 (shared helper timeout). Then confirm all 13 sitemap collection URLs return 200.

## Impact

Every collection landing page is down.