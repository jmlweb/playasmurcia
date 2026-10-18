---
id: LRN-010
title: La Manga is a place, not a municipality
status: active
tags: [database-data, geocoding, deployment]
task: 
created: 2026-10-18
---

## Context

`municipalities.json` listed "La Manga" as a municipality, reusing San Javier's INE code (30035). Four beaches were filed under it, and Playa de Gollerón sat under the wrong municipality. Fixed in commits bdc14e0 (data) and 854e043 (301 redirect from `/municipios/la-manga` to `/municipios/san-javier`).

## Insight

- **La Manga del Mar Menor is a strip split between two municipalities.** Cartagena owns the south, from Cabo de Palos up to Calnegre and Cala del Pino (postal code 30383). San Javier owns the north, from Playa La Isla to Las Encañizadas (postal code 30380).
- **The "La Manga" beaches were not on La Manga at all.** Barnuevo, Colón, El Castillico and El Pescador are in Santiago de la Ribera, on the San Javier mainland. Their generated copy said "casco urbano de La Manga".
- **`beaches[].municipality` is an index into `municipalities.json`, not an ID.** Removing an entry shifts every later municipality, so each beach pointing past it must be renumbered.
- **Reverse geocoding is unreliable here.** Nominatim returns no municipality for points in the sea; `zoom=17` snaps to nearby land. Its Cartagena/San Javier boundary is wrong near Cala del Pino, which press and tourism listings place in Cartagena.
- **CI never migrates Turso.** The migration step in `ci.yml` only seeds a local test DB. The production DB changes only when the migration is run by hand.

## Application

- Assign municipality from the legal boundary, not from the place name in the copy. Cross-check reverse geocoding against press or tourism listings near boundaries.
- When removing a municipality, renumber beach indices in the same change and update counts in `docs/data-schema.md`.
- `scripts/validate-beaches.js` now fails on duplicate INE codes; run it after editing `municipalities.json`.
- Run `NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts` before pushing data changes, since the CI build generates `sitemap.xml` from the production DB.
- Removing a slug that is in the live sitemap needs a 301 redirect.
