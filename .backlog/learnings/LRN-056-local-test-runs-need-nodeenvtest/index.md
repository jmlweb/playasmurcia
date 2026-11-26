---
id: LRN-056
title: Local test runs need NODE_ENV=test, a seeded local.db and a prior build
status: active
tags: [testing, tooling]
task: TSK-196
created: 2026-11-26
---

With NODE_ENV=production in the shell, React loads its production build and every Testing Library test fails with "React.act is not a function". The db-data tests also need the seeded local DB CI uses (`DATABASE_URL=file:./local.db pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts`), and `src/lib/sitemap-routes.test.ts` reads `public/sitemap.xml`, which only `pnpm build` writes. Run `NODE_ENV=test DATABASE_URL=file:./local.db pnpm test` after a build.
