---
id: LRN-054
title: Run pnpm dev offline with a throwaway Hrana HTTP shim when turso CLI is missing
status: active
tags: [dev, database, libsql, workerd, testing]
task: TSK-195
created: 2026-11-23
---

`pnpm dev` runs SSR in workerd, where `@libsql/client` only accepts network URLs, and the documented offline path needs the `turso` CLI (`turso dev`). Without it, a ~60-line Node script that answers `POST /v2/pipeline` (Hrana v2 `execute`/`batch`/`close`) from `local.db` through the `libsql` package is enough to render every page locally. Point the worker at it with `DATABASE_URL=http://127.0.0.1:8181` in `.dev.vars` (gitignored); an env var on the `pnpm dev` command line is not picked up by the worker. Keep the shim outside the repo (one-off verification tooling).

Also: the agent shell on the hustle machine exports `NODE_ENV=production`. That makes `scripts/migrate-to-database.ts` target Turso (fails with `URL_INVALID: 'undefined'` when no Turso env is set) and makes Vitest load React's production build (`React.act is not a function`). Prefix local seeding and tests with `env -u NODE_ENV`.
