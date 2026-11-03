---
id: LRN-028
title: Local test run needs NODE_ENV unset, a seeded local.db and a prior build
status: active
tags: [testing, tooling]
task: TSK-134
created: 2026-11-03
---

Running pnpm test locally needs the same setup as CI:

- Unset NODE_ENV. With NODE_ENV=production, React loads its production build, and every Testing Library test fails with "React.act is not a function".
- Seed a local DB: DATABASE_URL=file:./local.db pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts. Without it, db-data.test.ts fails.
- Run pnpm build first. It writes public/sitemap.xml, which sitemap-routes.test.ts reads, and src/routeTree.gen.ts, which pnpm check (tsc) needs.
