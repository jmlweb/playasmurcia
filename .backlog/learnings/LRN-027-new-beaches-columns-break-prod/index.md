---
id: LRN-027
title: New beaches columns break prod until Turso is migrated; bundle list-level metadata instead
status: active
tags: [data, database, deploy]
task: TSK-134
created: 2026-11-03
---

A new column in the beaches table breaks production on deploy. db.query.beaches.findMany selects every column in src/db/schema.ts, CI never migrates Turso, and every push to main deploys. Until someone migrates by hand, all beach queries fail with "no such column".

Metadata that belongs to a whole list (for example the certification season year) can skip the DB. Keep it in a small data/*.json file and import it statically from src/lib, with resolveJsonModule on in tsconfig.json. Vite bundles it, so it ships with the deploy and needs no migration. TSK-134 used data/certification-seasons.json this way.
