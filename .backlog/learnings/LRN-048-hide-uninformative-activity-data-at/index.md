---
id: LRN-048
title: Hide uninformative activity data at the display layer, not in beaches.json
status: active
tags: [data, content, database]
task: TSK-193
created: 2026-11-14
---

Near-universal activities (Natación, Kayak, Snorkel, Pesca) were unlisted with an id-based allowlist in `src/lib/activities.ts` instead of being deleted from `data/beaches.json`.

Why: editing the JSON needs a hand-run production Turso migration (CI does not migrate), activity references are positional indices, and the "Para hacer snorkel" collection still reads the snorkeling activity. A display-layer rule ships with a normal deploy and keeps the data for collection rules.

Also: a fresh clone cannot `pnpm build` (the sitemap step queries the DB) or `pnpm check` (needs `src/routeTree.gen.ts` from the build) until a local DB exists: `pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts` creates `file:./local.db`, which the Node build scripts accept.
