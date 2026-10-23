---
id: LRN-023
title: COPLA reports beach closures in the bandera field, and unknown values silently become SIN BANDERA
status: active
tags: [bug, beach-status, testing]
task: TSK-125
created: 2026-10-23
---

The 112 COPLA feed has no separate closure tag: a closed beach comes as `<bandera>PLAYA CERRADA</bandera>`. `toBeachFlag` in `src/lib/beach-status-112.ts` maps any value outside `VALID_FLAGS` to `SIN BANDERA`, so a new feed value is lost without an error. Check the live value set (`curl -s https://www.112rmurcia.es/copla/copla.xml | grep -o '<bandera>[^<]*</bandera>' | sort | uniq -c`) before assuming the union is complete.

`FlagBadges` in `beach-card.tsx` is a `Partial<Record<BeachFlag, …>>`, so adding a flag to the union does not make the compiler ask for a card badge; only the widget maps are full `Record`s.

Testing notes:
- The widget's `createServerFn` can be mocked with `vi.mock('@tanstack/react-start', () => ({ createServerFn: () => ({ validator: () => ({ handler: () => fn }) }) }))`; `fn` must come from `vi.hoisted`, because the mock factory runs before module-level `const`s.
- If the shell exports `NODE_ENV=production`, every Testing Library test fails with `React.act is not a function`; run tests with `NODE_ENV=test`. `db-data.test.ts` and `pnpm build` (sitemap) also need a seeded DB: `DATABASE_URL=file:./local.db pnpm drizzle-kit push --force && pnpm tsx scripts/migrate-to-database.ts`.
