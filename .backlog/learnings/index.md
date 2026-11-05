# PlayasMurcia - Learnings Index

> Consult a learning's full document before starting related work.

| ID | Title | Tags | Status | Date |
|----|-------|------|--------|------|
| LRN-001 | 33% AEMET → 100% Open-Meteo | database-data | active | 2026-10-17 |
| LRN-002 | Composite recommendation score | database-data | active | 2026-10-17 |
| LRN-003 | Component modularization — hybrid, not screen-only | frontend-ui | active | 2026-10-17 |
| LRN-004 | Low-value sections belong out | frontend-ui | active | 2026-10-17 |
| LRN-005 | Progressive loading > classic pagination | frontend-ui | active | 2026-10-17 |
| LRN-006 | workerd is not Node | infrastructure-deploy | active | 2026-10-17 |
| LRN-007 | Per-isolate cache is ephemeral | infrastructure-deploy | active | 2026-10-17 |
| LRN-008 | `.env` vs `.dev.vars` | infrastructure-deploy | active | 2026-10-17 |
| LRN-009 | Diagnose before changing code | general | active | 2026-10-17 |
| LRN-010 | La Manga is a place, not a municipality | database-data, geocoding, deployment | active | 2026-10-18 |
| LRN-011 | Undefined Tailwind color step fails silently | tailwind, theme, ui | active | 2026-10-19 |
| LRN-012 | Run oxfmt after oxlint --fix | tooling, lint, format | active | 2026-10-19 |
| LRN-013 | Fresh worktrees need setup before build, test and screenshots | worktree, testing, build, dev-environment | active | 2026-10-19 |
| LRN-014 | Worktree agents must call /usr/bin/git | tooling, rtk, worktree | active | 2026-10-19 |
| LRN-015 | Beach slugs are not globally unique | slugs, data, routing | active | 2026-10-19 |
| LRN-016 | Fresh agent worktrees lack gitignored runtime files | worktree, build, dev, screenshots | active | 2026-10-19 |
| LRN-017 | Worktree agents cannot run git through the rtk hook | tooling, git, rtk, worktree | active | 2026-10-19 |
| LRN-018 | Same-name beaches share a slug, so deleting a duplicate is URL-safe | slugs, data, routing | active | 2026-10-19 |
| LRN-019 | pictureQualityScore does not measure subject quality | ui, data, homepage | active | 2026-10-19 |
| LRN-020 | Fresh worktree needs local DB and generated route tree before build/check | worktree, tooling, database | active | 2026-10-19 |
| LRN-021 | Coast order needs a hand-written list, not mean latitude | data, frontend-ui | active | 2026-10-19 |
| LRN-022 | Seaward bearing comes from OSM coastline direction, but beach coordinates can be hundreds of metres off | data, weather | active | 2026-10-20 |
| LRN-023 | COPLA reports beach closures in the bandera field, and unknown values silently become SIN BANDERA | bug, beach-status, testing | active | 2026-10-23 |
| LRN-024 | Drizzle inArray returns table order, so lookups by a code list must re-order | bug, database, beach-detail | active | 2026-10-25 |
| LRN-025 | COPLA segment names: compare bare names by equality and never use the parenthesized text as an alias | bug, beach-status, copla | active | 2026-10-27 |
| LRN-026 | pnpm test fails with React.act is not a function when the shell exports NODE_ENV=production | testing, tooling, database | active | 2026-10-27 |
| LRN-027 | New beaches columns break prod until Turso is migrated; bundle list-level metadata instead | data, database, deploy | active | 2026-11-03 |
| LRN-028 | Local test run needs NODE_ENV unset, a seeded local.db and a prior build | testing, tooling | active | 2026-11-03 |
| LRN-029 | EEA bathing water data: use the ArcGIS map service, not discodata SQL | data, external-source, eea | active | 2026-10-31 |
| LRN-030 | Bathing water IDs carry the NUTS region: ES620 is Murcia | data, external-source, eea | active | 2026-10-31 |
| LRN-031 | Local scripts inherit NODE_ENV=production from the hustle shell | tooling, database | active | 2026-10-31 |
| LRN-032 | Qualified beach slugs are keyed by beach code, not derived from the data | slugs, routing, seo | active | 2026-11-04 |
| LRN-033 | Redirect map must not redirect a live slug | slugs, redirects | active | 2026-11-04 |
| LRN-034 | Fresh worktree needs a local DB for build and DB tests | worktree, build, testing | active | 2026-11-04 |
| LRN-035 | AEMET API keys expire and the widget hides the failure | weather, aemet, external-source | active | 2026-11-05 |
| LRN-036 | Fresh worktree needs a seeded local DB and a build before check and test mean anything | worktree, testing, tooling, setup | active | 2026-11-05 |
| LRN-037 | Beach editorial fields are one-off LLM output; the validator is the only guard | data, validation, content | active | 2026-11-05 |
