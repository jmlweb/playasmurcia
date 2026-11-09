---
id: LRN-047
title: NODE_ENV=production in the shell breaks pnpm test with React.act is not a function
status: active
tags: [testing, tooling]
task: TSK-140
created: 2026-11-09
---

When the shell exports `NODE_ENV=production`, vitest loads the production React build and 226 component tests fail with `TypeError: React.act is not a function`. The DB tests also fail without a seeded database. Run the local checks the way CI does:

```bash
env -u NODE_ENV DATABASE_URL=file:./local.db pnpm drizzle-kit push --force
env -u NODE_ENV DATABASE_URL=file:./local.db pnpm tsx scripts/migrate-to-database.ts
env -u NODE_ENV DATABASE_URL=file:./local.db pnpm build
env -u NODE_ENV DATABASE_URL=file:./local.db pnpm test
```

Under `NODE_ENV=production`, `migrate-to-database.ts` targets Turso, so unset it before seeding. Salvaged from PR #25 (hustle maintainer agent), closed as superseded by the TSK-140 implementation on `main`.
