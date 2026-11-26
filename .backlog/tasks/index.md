# PlayasMurcia - Task Index

## Stats

| Status | Count |
|--------|-------|
| Pending | 10 |
| Active | 0 |
| Blocked | 2 |
| Complete | 184 |

## Active Tasks

- TSK-194: Photos for the 55 beaches that still have none (P3) [BLOCKED: Needs a human with R2 access and photo licences: public/pictures is empty in a fresh clone (originals live only in R2), so pnpm score:picture-quality has no files to score; pnpm sync:pictures needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and rclone; non-Wikimedia sources (ITREM, municipal sites) need reuse permission obtained by a person; TSK-142 already used up Wikimedia Commons]
- TSK-198: Fix unverified sunbeds and umbrellas services (P2) [BLOCKED: Criteria 3-4 need the production Turso migration run by hand with prod credentials (NODE_ENV=production pnpm tsx scripts/migrate-to-database.ts, then validate counts per LRN-046) and a check that /playas La Reya (code 648) no longer shows Hamacas; the unattended run has no prod access]

## Pending Tasks

| ID | Title | Priority | Tags | Created |
|----|-------|----------|------|---------|
| TSK-172 | Fix: Search flushSync exception unverified on real phones | P4 | bug, navbar, needs-device | 2026-11-06 |
| TSK-185 | Fiesta de interés turístico badges per coastal municipality | P4 | data, content, municipalities | 2026-11-08 |
| TSK-186 | GR-92 Costa Cálida trail: length and stages copy | P4 | content, data | 2026-11-08 |
| TSK-187 | Cercanías Cartagena line 1 stations near Mar Menor beaches | P4 | data, access | 2026-11-08 |
| TSK-188 | Lifeguard season per beach from the COPLA 2025 BORM annex | P4 | data, beach-status | 2026-11-08 |
| TSK-189 | Coastal summer health points (SUAP, UME, SVAE) 2026 | P4 | data, external-source | 2026-11-08 |
| TSK-190 | Monthly sea temperature normals from Copernicus Marine | P4 | data, weather, external-source | 2026-11-08 |
| TSK-191 | Mar Menor latest IEO-CSIC report card | P4 | feature, external-source | 2026-11-08 |
| TSK-197 | Paginate or collapse long municipality pages | P4 | ui, listing, performance | 2026-11-09 |
| TSK-199 | Fix: CI never runs validate-beaches.js, so invalid beach data deploys | P3 |  | 2026-11-23 |

## Recently Completed

| ID | Title | Completed |
|----|-------|-----------|
| TSK-196 | Cache card weather per coordinate instead of per set of beach codes | 2026-11-26 |
| TSK-195 | Normalise the HTML cache key and cache 404s briefly | 2026-11-23 |
| TSK-192 | Rewrite the 65 descriptions that quote the OSM length | 2026-11-15 |
| TSK-193 | Review activities data: Natación, Kayak, Snorkel and Pesca are on nearly every beach | 2026-11-14 |
| TSK-147 | Official beach width and length from ITREM; review OSM length | 2026-11-09 |
| TSK-130 | Fix: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy | 2026-11-08 |
| TSK-132 | Fix: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection | 2026-11-08 |
| TSK-136 | Expose address and postalCode fields | 2026-11-08 |
| TSK-138 | Expand aemetId coverage | 2026-11-08 |
| TSK-139 | Sunrise and sunset per beach; derive puesta-sol tag | 2026-11-08 |
