---
id: LRN-050
title: Unset NODE_ENV=production before local tests and DB seeding
status: active
tags: [testing, tooling, database]
task: TSK-198
created: 2026-11-17
---

If the shell exports NODE_ENV=production, `pnpm test` fails about 230 tests with "TypeError: React.act is not a function" (React loads its production build, which has no act), and `scripts/migrate-to-database.ts` targets TURSO_DATABASE_URL instead of DATABASE_URL, failing with "URL_INVALID: The URL 'undefined'". Run `unset NODE_ENV`, then seed with `DATABASE_URL=file:./local.db pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts`, as CI does. For a local `pnpm build`, the sitemap step needs `TURSO_DATABASE_URL=file:./local.db`.
