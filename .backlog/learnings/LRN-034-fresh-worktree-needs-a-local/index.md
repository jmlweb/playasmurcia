---
id: LRN-034
title: Fresh worktree needs a local DB for build and DB tests
status: active
tags: [worktree, build, testing]
task: TSK-168
created: 2026-11-04
---

## Context
Without a local DB, `pnpm build` fails at sitemap generation and the `db-data` tests fail with "no such table: beaches". `pnpm check` also fails until `pnpm build` has generated `routeTree.gen.ts`.
## Insight
`pnpm drizzle-kit push --force` followed by `pnpm tsx scripts/migrate-to-database.ts` fills the gitignored `local.db`. After that, `pnpm build`, then check and test, work.
## Application
Run these two commands in any new worktree before the verification steps.
