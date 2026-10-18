# Architecture

## Tech Stack

| Technology                    | Purpose                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Start**            | Full-stack React framework                                                                                                                   |
| **TanStack Router**           | File-based routing                                                                                                                           |
| **Vite**                      | Build tool                                                                                                                                   |
| **Tailwind CSS v4**           | Styling                                                                                                                                      |
| **TypeScript**                | Language (strict mode)                                                                                                                       |
| **Oxlint**                    | Linting, type-aware ([`@jmlweb/oxlint-config-react`](https://www.npmjs.com/package/@jmlweb/oxlint-config-react))                             |
| **Oxfmt**                     | Formatting + Tailwind class sorting ([`@jmlweb/oxfmt-config-base`](https://www.npmjs.com/package/@jmlweb/oxfmt-config-base))                 |
| **Vitest**                    | Testing (extends [`@jmlweb/vitest-config`](https://www.npmjs.com/package/@jmlweb/vitest-config); coverage thresholds disabled for this repo) |
| **Testing Library**           | Component testing                                                                                                                            |
| **pnpm**                      | Package manager                                                                                                                              |
| **Turso (libSQL)**            | Edge database (runtime data)                                                                                                                 |
| **Drizzle ORM**               | Type-safe SQL                                                                                                                                |
| **Cloudflare Cache API**      | Durable edge caching for external API calls                                                                                                  |
| **Open-Meteo API**            | Coordinate-based weather (cards and detail when AEMET is unavailable)                                                                        |
| **AEMET Open Data**           | Official beach forecasts where `aemetId` is set                                                                                              |
| **112 COPLA (112rmurcia.es)** | Live beach flag color and sea state                                                                                                          |
| **Leaflet + react-leaflet**   | Interactive maps on beach detail and the explorer (lazy-loaded, client-only); `leaflet.markercluster` groups explorer markers               |

## Current State

Development happens on `main`; every push deploys to www.playasmurcia.com. Route loaders use async database access via `src/lib/db-data.ts`.

| Layer                  | Status                                             | File(s)                                                           |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Database schema        | Active                                             | `src/db/schema.ts`                                                |
| Database client        | Active                                             | `src/db/client.ts`                                                |
| Data access (async)    | **Active** — used by routes                        | `src/lib/db-data.ts`                                              |
| JSON source files      | **Source for migration** — edit then migrate to DB | `data/*.json`                                                     |
| Migration / validation | Ready                                              | `scripts/migrate-to-database.ts`, `scripts/validate-migration.ts` |

## Project Structure

```
playasmurcia/
├── src/
│   ├── routes/             # File-based routing
│   │   ├── __root.tsx
│   │   ├── index.tsx       # Home (/)
│   │   ├── explorar/       # Full beach explorer (/explorar)
│   │   ├── playas/$slug.tsx
│   │   ├── municipios/     # Index + $slug
│   │   └── colecciones/
│   ├── components/
│   │   ├── layout/         # Shell chrome (breadcrumb, page-hero, site-footer)
│   │   └── ui/             # Generic UI (icons, responsive-image, empty-state)
│   ├── features/
│   │   ├── beaches/        # Beach domain (cards, detail widgets, gallery, maps)
│   │   └── listing/        # Shared list/explorer (pagination, filters, search)
│   ├── lib/
│   │   ├── db-data.ts      # Async loaders (primary)
│   │   ├── edge-cache.ts
│   │   ├── html-cache.ts        # Rendered-HTML edge cache keyed by deploy version
│   │   ├── markdown-negotiation.ts  # `Accept: text/markdown` negotiation (HTMLRewriter glue)
│   │   ├── html-to-markdown.ts  # Event-driven `<main>` HTML → markdown converter
│   │   ├── aemet.ts
│   │   ├── open-meteo.ts   # Coordinate-based weather
│   │   ├── beach-status-112.ts  # 112 COPLA live flag/sea state
│   │   ├── beach-filters.ts     # Filter/sort pure functions
│   │   ├── canonical.ts    # Canonical URL / og:url helpers
│   │   ├── geo.ts          # Haversine distance
│   │   ├── security-headers.ts  # Response security headers + CSP
│   │   ├── cn.ts           # clsx + tailwind-merge helper
│   │   ├── slugs.ts        # Slug generation
│   │   ├── status-styles.ts     # Badge Tailwind class maps
│   │   ├── images.ts
│   │   ├── schema.ts       # JSON-LD
│   │   └── collections.ts
│   ├── hooks/
│   │   └── use-scroll-reveal.ts  # IntersectionObserver scroll reveal
│   ├── db/
│   ├── types/
│   ├── server.ts           # Worker entry: wraps the Start handler with security headers
│   ├── router.tsx
│   ├── styles.css
│   └── routeTree.gen.ts    # Generated — do not edit
├── data/                   # JSON — migrate to Turso after changes
├── .backlog/               # flowstate: tasks/, ideas/, reports/, learnings/
├── docs/                   # Project documentation (architecture, data-schema, …)
├── scripts/
├── public/                 # Static assets (sitemap.xml, …); pictures/ is local-only, mirrored to R2
├── .github/workflows/      # CI: check, test, build; deploy on push to main
├── drizzle.config.ts
├── vite.config.ts
├── vitest.config.ts
├── .env.example
└── README.md
```

## Frontend Architecture

### Routing

TanStack Router — files under `src/routes/`:

| Route                | File                    | Description                                     |
| -------------------- | ----------------------- | ----------------------------------------------- |
| `/`                  | `index.tsx`             | Home: featured beaches, hero, entry to explorer |
| `/explorar`          | `explorar/index.tsx`    | Full list with search and filters               |
| `/playas/:slug`      | `playas/$slug.tsx`      | Beach detail                                    |
| `/municipios`        | `municipios/index.tsx`  | Municipality index                              |
| `/municipios/:slug`  | `municipios/$slug.tsx`  | Beaches in one municipality                     |
| `/colecciones`       | `colecciones/index.tsx` | Thematic collections index                      |
| `/colecciones/:slug` | `colecciones/$slug.tsx` | One collection                                  |

Root layout in `__root.tsx` provides document shell, meta, and global styles.

Route files stay thin; reusable UI lives under `src/components/` (layout + generic `ui/`) and cross-route features under `src/features/` (`beaches/`, `listing/`).

### SEO

Beach pages inject JSON-LD from `src/lib/schema.ts`. `scripts/generate-sitemap.ts` writes `public/sitemap.xml` from the database (home, section indexes, municipalities, collections, beach URLs). `robots.txt` references the sitemap.

### Styling

Tailwind CSS v4; global tokens and rules in `src/styles.css`.

### Images

Beach photos are **not in git** (`public/.gitignore` ignores `pictures/`). The source of truth is the local `public/pictures/` folder (originals plus `optimized/` WebP/AVIF variants from `pnpm optimize:images`), mirrored to the Cloudflare R2 bucket `playasmurcia-pictures` with `pnpm sync:pictures`. Production serves that bucket from its custom domain `img.playasmurcia.com`, cached by Cloudflare's CDN, so images never count as Worker requests and are not uploaded as Worker assets (`public/.assetsignore`).

Every picture URL goes through `pictureUrl()` (`src/lib/images.ts`). It prefixes `VITE_PICTURES_BASE_URL` when set (production and CI), and falls back to `/pictures` otherwise, which Vite serves from `public/` in local dev.

When `PLAYASMURCIA_OPTIMIZED_IMAGES` is true at build time, `ResponsiveImage` (`src/components/ui/responsive-image.tsx`) and `PageHero` emit `<picture>` with AVIF and WebP sources and the original raster as fallback. Locally the flag is detected from `public/pictures/optimized/`. CI, which has no pictures, sets it explicitly.

## Generated files

- `src/routeTree.gen.ts` — generated by TanStack Router; do not edit by hand.

## Data Architecture

### Data flow

```
data/*.json ──→ scripts/migrate-to-database.ts ──→ Turso (libSQL)
                                                        │
                                                        ▼
                                              src/lib/db-data.ts
                                                        │
                                                        ▼
                                              route loaders → components
                                                        │
                                                        ▼
                                              src/lib/schema.ts (JSON-LD)

External APIs (AEMET, Open-Meteo, 112 COPLA) ──→ src/lib/edge-cache.ts ──→ loaders
  (Cloudflare Cache API in production, in-memory fallback in local dev)

GET document ──→ src/server.ts ──→ src/lib/html-cache.ts ──→ SSR only on a miss
  (Cache API, key = deploy version + path + query, edge TTL 1 h, browsers `no-cache`;
   server-function calls, redirects, 404s and non-HTML responses are never cached)
```

Rendered HTML is static per URL: weather, flags and 112 status load client-side
through server functions after hydration. The cache key includes the Worker
version id (`CF_VERSION_METADATA` binding), so a deploy invalidates every entry
without a purge; data edits become visible after the next deploy or after the
1-hour edge TTL. Local dev (`import.meta.env.DEV`) never caches HTML.

#### Markdown for agents

Requests whose `Accept` header prefers `text/markdown` over `text/html` get the
same page as markdown (the Free zone plan has no Cloudflare Markdown for
Agents). `src/server.ts` renders the page as HTML (through the HTML cache),
streams it through `HTMLRewriter`, and `src/lib/html-to-markdown.ts` converts
the `<main>` element: headings, paragraphs, lists, links and images become
markdown, with the title and meta description as front matter. Navigation,
buttons, SVG and `aria-hidden` content are dropped. The markdown is cached
under its own key variant (`/markdown/<version>/…`), and every HTML or markdown
document carries `Vary: Accept`. Markdown responses also send the
`Content-Signal` header that `public/robots.txt` declares.

HTML responses advertise the markdown copy with an RFC 8288 `Link` header
(`<path>; rel="alternate"; type="text/markdown"`), added outside the HTML cache
so markdown responses never carry it. The homepage also links
`</sitemap.xml>; rel="sitemap"`. There is no `api-catalog`, `service-desc` or
`service-doc` link because the site has no public API.

### Database (Turso / libSQL)

Runtime reads use a network-accessible libSQL URL (`TURSO_DATABASE_URL` / `DATABASE_URL` and `TURSO_AUTH_TOKEN`). See [development.md](./development.md) for local vs production env (including `turso dev` for offline-friendly HTTP).

#### Tables

| Table            | Records | Description            |
| ---------------- | ------- | ---------------------- |
| beaches          | 194     | Main beach data        |
| municipalities   | 9       | Coastal municipalities |
| seas             | 2       | Water bodies           |
| services         | 9       | Available services     |
| activities       | 10      | Beach activities       |
| tags             | 17      | Categorical tags       |
| beach_services   | ~700    | Junction               |
| beach_activities | ~900    | Junction               |
| beach_tags       | ~750    | Junction               |

### JSON files (`data/`)

Authoritative **editorial source** for bulk fields; after edits, run migration so Turso stays in sync. Schemas: [data-schema.md](./data-schema.md).

## Scripts and deployment

Maintenance and data scripts are listed in [development.md](./development.md).

| Component       | Technology                              |
| --------------- | --------------------------------------- |
| **Hosting**     | Cloudflare Workers (`www.playasmurcia.com`, apex redirects to `www`) |
| **Images**      | Cloudflare R2 bucket on `img.playasmurcia.com`                       |
| **Database**    | Turso (libSQL)                                                       |
| **Vite plugin** | `@cloudflare/vite-plugin` (workerd SSR)                              |
| **CI/CD**       | GitHub Actions (`.github/workflows/ci.yml`)                          |

Deployment: every push to `main` runs `pnpm check`, `pnpm test` and `pnpm build`, then `wrangler deploy`. Pull requests run the same checks without deploying. Manual deploys use `pnpm run deploy` (plain `pnpm deploy` is a pnpm built-in) from a machine with `.env` set and `VITE_PICTURES_BASE_URL=https://img.playasmurcia.com` exported. Images are deployed separately with `pnpm sync:pictures`.

The workerd runtime is not Node.js: `@libsql/client` uses the web client and does not support `file:` database URLs. See [development.md](./development.md) for environment setup.
