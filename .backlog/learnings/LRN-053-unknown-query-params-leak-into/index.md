---
id: LRN-053
title: Unknown query params leak into TanStack search and Link active state
status: active
tags: [cache, tanstack-router, hydration, ssr]
task: TSK-195
created: 2026-11-23
---

Serving one cached HTML render for URLs that differ only in unknown query parameters (fbclid, utm_*) is only hydration-safe if nothing rendered depends on those parameters. Two things did in this app:

1. The root route has no `validateSearch`, so a child's `Route.useSearch()` returns the validated keys **plus every raw parameter** inherited from the root. Spreading it into `router.buildLocation({ search })` (explorer pagination hrefs) copied `fbclid` into every page link. Re-run the route's validator before building hrefs (`explorerPageSearch`).
2. `Link activeOptions={{ exact: true }}` compares the full search object, so `?fbclid=x` turns off `aria-current`/`data-status="active"` on the current-page link. Add `includeSearch: false` when the link carries no search of its own.

Production React 19 silently ignores attribute mismatches, so a Playwright check against the production build reports clean. Verify with `pnpm dev` (React dev build logs "A tree hydrated but some attributes ... didn't match") and include a positive control (a known parameter such as `?page=2`) to prove the check can fail. Quick leak probe: `curl` the page with `?fbclid=probe123` and count `probe123` in the HTML.
