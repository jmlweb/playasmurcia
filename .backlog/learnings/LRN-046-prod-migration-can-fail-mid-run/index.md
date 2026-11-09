---
id: LRN-046
title: Prod migration can fail mid-run and leave relations empty; always validate counts after migrating
status: active
tags: [data, database, deploy, migration]
task: TSK-139
created: 2026-11-09
---

## Context

On 2026-11-08 `NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts` exited early (transient Turso error while inserting beach-service rows). Only its last two lines were read, so the failure went unnoticed. Production kept 193 beaches but 202 of 669 service rows, 0 activity rows and 0 tag rows for several minutes.

## Insight

The migration clears every table and reinserts without a transaction (documented in docs/development.md). A partial run is not visible from the summary tail, and the live site then shows beaches without services, activities or tags.

## Application

- Redirect the migration output to a file and check the exit code and the final summary block (`193 beaches`, `669 beach-service`, `873 beach-activity`, `609 beach-tag` on 2026-11-08)
- Run `NODE_ENV=production pnpm tsx --env-file=.env scripts/validate-migration.ts` after every production migration (18 checks) before pushing
- A failed run is fixed by rerunning the migration; nothing else is needed
