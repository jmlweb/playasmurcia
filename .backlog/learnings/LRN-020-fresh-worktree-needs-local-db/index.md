---
id: LRN-020
title: Fresh worktree needs local DB and generated route tree before build/check
status: active
tags: [worktree, tooling, database]
task: TSK-120
created: 2026-10-19
---

## Context
`pnpm build` fails on the sitemap step with "no such table: beaches" on an empty `local.db`. `src/routeTree.gen.ts` is generated, so `tsc` shows bogus errors until a build or dev run creates it. `.env` can point at production Turso.
## Insight
Run `drizzle-kit push --force` and `scripts/migrate-to-database.ts` with `DATABASE_URL=file:./local.db` and the Turso vars blanked, so nothing touches production. Then build, then check, then test. For real photos in dev, set `VITE_PICTURES_BASE_URL=https://img.playasmurcia.com`. `scripts/screenshot.ts` hardcodes port 3000; pass a full URL if dev lands elsewhere.
## Application
Worktree bootstrap order: install, local push and migrate (local override), build, check, test.
