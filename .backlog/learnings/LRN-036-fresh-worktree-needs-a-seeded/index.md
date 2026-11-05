---
id: LRN-036
title: Fresh worktree needs a seeded local DB and a build before check and test mean anything
status: active
tags: [worktree, testing, tooling, setup]
task: TSK-161
created: 2026-11-05
---

## Context
In a new worktree, `pnpm check` fails with about 30 TS errors about `./routeTree.gen`, `pnpm test` fails 30 tests in `src/lib/db-data.test.ts` and all of `src/lib/sitemap-routes.test.ts`, and `pnpm build` can fail with "no such table: beaches". Seen by both TSK-153 and TSK-161 agents.
## Insight
These are environment gaps, not regressions. `local.db`, `src/routeTree.gen.ts` and `public/sitemap.xml` are untracked. The route tree comes from `vite build` or `pnpm dev`, the sitemap comes from `pnpm build`, and the sitemap step plus `db-data.test.ts` need a seeded `local.db`.
## Application
In a fresh worktree, copy `local.db` and `.dev.vars` from the main checkout (or run `pnpm drizzle-kit push --force`, then `pnpm tsx scripts/migrate-to-database.ts`). Run `pnpm build` next, and only then `pnpm check` and `pnpm test`.
