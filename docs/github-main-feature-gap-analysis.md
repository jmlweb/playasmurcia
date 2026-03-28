# Product parity and feature status (GitHub `main` / production vs local v3)

This document compares **user-facing and data features** between the public repo [jmlweb/playasmurcia](https://github.com/jmlweb/playasmurcia) on branch `main` (Next.js under `apps/web/`), **www.playasmurcia.com** where behavior matches that stack, and **this codebase** (TanStack Start on Cloudflare Workers, `v3` branch).

**Status labels**

| Label | Meaning |
|-------|---------|
| **Done** | v3 matches or exceeds the comparison baseline for that row. |
| **Partial** | Implemented for some cases, a subset of beaches, or a lighter UX than production. |
| **Open** | Not implemented in v3 (or intentionally different); still a gap if parity matters. |
| **N/A** | Not a meaningful comparison (e.g. framework-only detail). |

**Sources:** GitHub `main` under `apps/web/`; local `src/`; [architecture.md](./architecture.md) for current stack and images.

*Last reviewed: 2026-03-28.*

---

## Summary table

| Area | Production / `main` | Local v3 | Status |
|------|---------------------|----------|--------|
| Weather on list cards | Open-Meteo current weather on each card | Open-Meteo + occupancy/tags on cards | **Done** |
| Weather coverage | All beaches with coordinates | AEMET detail when `aemetId`; Open-Meteo for coordinates elsewhere | **Done** (dual source) |
| Beach detail forecast | Multi-day Open-Meteo strip | AEMET widget when `aemetId`; Open-Meteo otherwise | **Partial** (AEMET UX differs from long strip) |
| API caching | Next ISR + `fetch` revalidation | Cloudflare Cache API via `src/lib/edge-cache.ts` (+ in-memory fallback in dev) | **Done** |
| Images | Cloudinary + `next/image` | Static files + `ResponsiveImage` (`<picture>` WebP when `pnpm optimize:images`); no transforming CDN | **Partial** |
| Home / hero | Featured beaches + editorial hero | Featured beaches + hero + path to full list (`/explorar`) | **Done** |
| Navigation | Dropdown: municipalities + characteristics with counts | Dropdown with municipalities and tags + counts | **Done** |
| Footer | Sitemap-style links with counts | Rich footer with municipalities and characteristics | **Done** |
| Data runtime | App-driven from data layer | **Turso** + `src/lib/db-data.ts`; `data/*.json` is migration source | **Done** (different from `main`) |
| Integrated crawler + Chainner upscale | `apps/crawler` on `main` | Separate maintenance scripts only | **Open** (tooling parity) |

---

## Weather and forecasts

**Production / `main`:** [Open-Meteo](https://open-meteo.com/) by latitude/longitude for current conditions and predictions.

**v3:** Official [AEMET](https://opendata.aemet.es/) beach forecasts in `src/lib/aemet.ts` where `aemetId` is set; [Open-Meteo](https://open-meteo.com/) fills gaps for listing cards and for detail when AEMET is unavailable. See [business-rules.md](./business-rules.md#weather-aemet-and-open-meteo).

**Status:** **Done** for breadth on cards and for coordinate-based coverage; **Partial** where AEMET detail UI is shorter than a full multi-day Open-Meteo strip.

---

## Caching

**Production / `main`:** Route ISR and time-based `fetch` revalidation.

**v3:** Durable caching through the Cache API in production (`src/lib/edge-cache.ts`); per-isolate in-memory fallback when the API is unavailable.

**Status:** **Done** for cross-request edge caching of external APIs (AEMET, COPLA / 112).

---

## Images

**Production / `main`:** Cloudinary URLs with transforms and `next/image`.

**v3:** Rasters under `public/pictures/`; optional WebP variants under `public/pictures/optimized/`; `ResponsiveImage` in `src/components/responsive-image.tsx`. No remote transforming CDN.

**Status:** **Partial** — format and size variants exist locally; **Open** for CDN-level transforms, automatic art direction, or `next/image`-class pipelines. Optional directions: [Cloudflare Images](https://developers.cloudflare.com/images/) or [unpic](https://unpic.pics/) if a CDN is adopted (see [architecture.md](./architecture.md#images)).

---

## UX and information architecture

Earlier comparisons with production called out a flat nav, minimal footer, 194 beaches on the home page, and no weather on cards. Those items have been addressed in v3 (featured home, dropdown nav, rich footer, weather on cards). Remaining differences are mostly **forecast presentation** (AEMET vs long Open-Meteo row) and **image delivery** (see above).

#### Home and hero

Featured beaches and editorial hero: `src/routes/index.tsx`.

#### Navigation

Dropdown with municipalities and tag shortcuts: `src/routes/__root.tsx` and related.

#### Footer

Municipalities and characteristics with counts: `src/components/site-footer.tsx`.

---

## Data pipeline / crawler

**`main`:** `apps/crawler` validates resolution and may upscale via Chainner.

**v3:** Scripts such as `scripts/download-playas-nexo-images.ts`, `scripts/score-beach-picture-quality.ts`, `scripts/prune-small-beach-pictures.ts` — not the same integrated pipeline.

**Status:** **Open** if monorepo crawler parity is required.

---

## Features emphasized in v3 (not necessarily on `main`)

- **AEMET** official beach forecasts where `aemetId` exists.
- **Beach status (112 / COPLA)** via `BeachStatusWidget` and `src/lib/beach-status-112.ts`.
- **Database-backed** catalogue (Turso + Drizzle).
- **Thematic collections** (`/colecciones`).

---

## Remaining gaps (optional product work)

1. **Image CDN** — transforming CDN or hosted image service for automatic formats, quality, and global edge delivery (optional; see [architecture.md](./architecture.md#images)).
2. **Dynamic Open Graph images** — per-beach OG generation at the edge (not implemented).
3. **Crawler / upscale pipeline** — only if aligning with `apps/crawler` on `main` matters.
4. **Sitemap vs routes** — ensure `scripts/generate-sitemap.ts` only lists routes that exist in `src/routes/` (may still reference removed paths until updated).
