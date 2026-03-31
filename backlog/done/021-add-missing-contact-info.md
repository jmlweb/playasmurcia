# Task #021: Research and Add Missing Contact Information

## Metadata

- **Status**: completed
- **Completed**: 2026-03-31
- **Priority**: P4 - Later
- **Slice**: Data
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want contact information and official URLs for beaches so that I can get up-to-date info from official sources.

## Context

Content audit (2026-03-27) found only 8% of beaches had phone, email, or `realUrl`. After this task, every beach has at least `phone` and `realUrl`; `email` is set where a published address was found on an official portal.

## Acceptance Criteria

- [x] Research official beach pages from municipality tourism portals (and CARM for La Unión beach detail URLs)
- [x] Populate `realUrl` for beaches that have official pages (municipal listing, per-beach page on ayuntamiento/CARM, or playas portal)
- [x] Add `phone` and `email` for beaches with tourist offices or info points where published (see **Gaps** below)
- [x] Hide `ContactInfo` component when all fields are empty — already implemented in `contact-info.tsx` (returns `null` when no phone, email, `realUrl`, or hashtag)
- [x] Document sources for each piece of contact data (this file, **Verified sources**)

## Verified sources (2026-03-31)

| Municipality        | `realUrl` pattern | Phone | Email | Source (verified) |
| ------------------- | ----------------- | ----- | ----- | ----------------- |
| **Cartagena** | `turismo.cartagena.es/listado_playas.asp?tipo=1` | 968 12 89 55 | turismo@ayto-cartagena.es | HTML footer `https://turismo.cartagena.es/` (curl) |
| **Lorca** | (unchanged) | (existing) | (existing) | Already in `beaches.json` — emergencias.lorca.es |
| **Águilas** | `aguilas.es/experiencias-en-aguilas/playas/` | 968 493 285 | — | Same number already on playa 566; playas URL from official site |
| **Mazarrón** | `mazarron.es/.../carta-de-playas/` | 968 590 012 | — | Ayuntamiento page footer |
| **San Javier** | `turismo.sanjavier.es/` | 968 573 700 | concejaliadeturismo@sanjavier.es | `https://www.sanjavier.es/es/seccion-33-turismo` |
| **La Manga** | `turismo.sanjavier.es/` | 968 573 700 | concejaliadeturismo@sanjavier.es | Same ayuntamiento as San Javier |
| **Los Alcázares** | `turismo.losalcazares.es/playas-2/` | 968 575 756 | turismo@ayto.di3d.es | `https://losalcazares.es/area-playas-2/` |
| **San Pedro del Pinatar** | Per-beach URLs under `sanpedrodelpinatar.es/.../lugares-de-interes/` | 968 182 301 | turismo@sanpedrodelpinatar.es | Playas index + `.../turismo/contacto/` |
| **La Unión** | CARM ficha per playa (`turismoregiondemurcia.es/es/playa/...`) | 968 54 16 14 | turismo@ayto-launion.org | CARM playas La Unión + `https://www.ayto-launion.org/turismo/` |

## Gaps / follow-up

- **Águilas (36 beaches)**: No municipal tourism email appeared in crawlable HTML on `aguilas.es` pages used; only `phone` + `realUrl` were added. Optional: confirm `turismo@aguilas.es` (or current address) from a PDF or transparencia and add to all Águilas rows.
- **Mazarrón (34 beaches)**: Carta de playas / footer lists switchboard `968 590 012` only; no dedicated email on that page. Optional: add beach/litoral inbox if published elsewhere on `mazarron.es`.
- **Per-beach `realUrl` for Cartagena / Águilas / Mazarrón / San Javier**: Currently the municipal **list** or **portal** URL is used for all beaches in that municipality (except San Pedro and La Unión, where per-beach official URLs were mapped). Cartagena’s site exposes `detalle_playas.asp?id=…` for individual beaches — a future pass could map codes to those IDs.

## Implementation notes

- `data/beaches.json` updated; `node scripts/validate-beaches.js` passed; `pnpm tsx scripts/migrate-to-database.ts` run locally after JSON change.
- One-off apply script was not kept (per repo guidance on disposable enrichment scripts); this file is the traceability record.

## Skip Reason (historical)

Skipped by Ralph Loop (2026-03-27): Requires manual research to find and verify contact info from municipality tourism portals and official sources. ContactInfo component already hides when empty (line 9-13 in contact-info.tsx).
