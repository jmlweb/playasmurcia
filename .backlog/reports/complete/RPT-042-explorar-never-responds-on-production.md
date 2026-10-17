---
id: RPT-042
title: `/explorar` never responds on production
type: bug
severity: critical
status: triaged
created: 2026-10-17
triaged: 2026-10-17
task-id: TSK-111
---

- **Found**: 2026-10-17, against https://www.playasmurcia.com
- **Area**: `src/routes/explorar/index.tsx`, `src/lib/open-meteo.ts`

## Observed

`GET /explorar` (also `?page=1`, `?page=9999`, `?q=sol`) sends no response. curl times out with exit 28 (`000`) at 25 s and at 40 s, repeated over several minutes. Other routes answer in under 1 s (`/` 0.5 s, `/playas/<slug>` 0.2-0.6 s).

## Expected

The explorer, the main discovery page (linked from the home page and the sitemap), renders in a few seconds.

## Repro

```bash
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" --max-time 30 https://www.playasmurcia.com/explorar
# 000 30.00
```

## Likely cause (unverified)

The route loader calls `fetchBatchCardWeather(beaches)` for all ~194 beaches and awaits it before rendering. In `src/lib/open-meteo.ts` the Open-Meteo `fetch` has no timeout or `AbortSignal`, so a slow or throttled upstream blocks SSR. The batch also puts every unique coordinate in one GET URL, which may hit URL-length or rate limits. The `catch` only handles thrown errors, not a hang.

## Suggested fix

- Add `AbortSignal.timeout(~2000)` to the Open-Meteo calls and return an empty map on timeout.
- Do not block the loader on weather: defer it, or fetch it client-side.
- Split the batch into chunks.
- Add a regression test for the timeout path.

## Impact

The core feature is unavailable. SEO and users are hit.