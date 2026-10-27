---
id: LRN-026
title: pnpm test fails with React.act is not a function when the shell exports NODE_ENV=production
status: active
tags: [testing, tooling, database]
task: TSK-129
created: 2026-10-27
---

On the hustle machine the shell exports `NODE_ENV=production`. With it, React loads its production build and every Testing Library test fails with `TypeError: React.act is not a function`, and `scripts/migrate-to-database.ts` reads `TURSO_DATABASE_URL` instead of `DATABASE_URL` (`URL_INVALID: The URL 'undefined'`). CI does not set it. Run `unset NODE_ENV`, then seed like CI (`DATABASE_URL=file:./local.db pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts`) before `pnpm build`, `pnpm check` and `pnpm test`.
