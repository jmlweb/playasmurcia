# Development Guide

## Environment Setup

This repository uses **pnpm** (version in `package.json` → `packageManager`). With Node 20+, run `corepack enable` once so the correct pnpm is used. Do not commit or rely on `package-lock.json` (npm).

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env
# Edit .env if needed (defaults work for local dev)

# 3. Push database schema to local SQLite
pnpm drizzle-kit push

# 4. Migrate JSON data to local database
pnpm tsx scripts/migrate-to-database.ts

# 5. Start dev server
pnpm dev
```

## Commands

```bash
pnpm dev           # Start dev server at http://localhost:3000
pnpm build         # Generate sitemap + build for production
pnpm generate:sitemap  # Generate sitemap only
pnpm preview       # Preview production build
pnpm lint          # Run Oxlint (type-aware)
pnpm lint:fix      # Run Oxlint with auto-fix
pnpm format        # Oxfmt: `src/**/*.{ts,tsx,css}` and `scripts/**/*.js`
pnpm type-check    # TypeScript type checking (tsc --noEmit)
pnpm check         # Type-check + Oxlint (`src/`) + Oxfmt on the same globs as `format`
pnpm test          # Run tests
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
pnpm score:picture-quality                  # Set beaches.json pictureQualityScore from public/pictures
pnpm run score:picture-quality -- --dry-run # Preview counts without writing JSON
pnpm run score:picture-quality -- --json-out /tmp/picture-quality-report.json
pnpm run prune:small-pictures -- --dry-run  # List picture refs that would be removed (<600px short side)
pnpm run prune:small-pictures               # Remove those refs from beaches.json
pnpm run prune:small-pictures -- --delete-files  # Also delete unreferenced rasters from public/pictures
pnpm optimize:images           # Generate WebP variants + thumbnails in public/pictures/optimized/
pnpm sync:pictures -- --dry-run  # Preview what would be uploaded to / deleted from R2
pnpm sync:pictures             # Mirror public/pictures/ to the R2 bucket (img.playasmurcia.com)
pnpm run deploy                # Build and deploy to Cloudflare Workers from this machine (`pnpm deploy` is a pnpm built-in)
```

### Dev reports and UI reviews

No registry file or `pnpm reports:status`. **Authoritative workflow and paths:** [AGENTS.md](../AGENTS.md) — _Reports, UI reviews, and audits (mandatory for agents)_.

## Database Commands

```bash
pnpm drizzle-kit push    # Push schema to the same DB the app uses (see env priority below)
pnpm drizzle-kit studio  # Open Drizzle Studio (database viewer)
pnpm tsx scripts/migrate-to-database.ts   # Migrate JSON to database
pnpm tsx scripts/validate-migration.ts    # Validate migration
```

### Environment Variables

Connection order matches [`src/db/client.ts`](../src/db/client.ts) and [`drizzle.config.ts`](../drizzle.config.ts): **`DATABASE_URL` wins over `TURSO_DATABASE_URL`**.

```bash
# Both dev and production use Turso remote
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

Copy `.env.example` to `.env` and set real Turso credentials.

#### CI and deployment

`.github/workflows/ci.yml` runs on pull requests (check, test, build) and on pushes to `main` (same, then `wrangler deploy`). It needs these GitHub repository settings:

| Name                     | Kind     | Purpose                                                       |
| ------------------------ | -------- | ------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`   | Secret   | Deploy (Cloudflare "Edit Cloudflare Workers" token template)  |
| `CLOUDFLARE_ACCOUNT_ID`  | Secret   | Deploy                                                        |
| `VITE_MAPBOX_TOKEN`      | Secret   | Inlined into the client bundle at build time                  |
| `TURSO_DATABASE_URL`     | Secret   | The sitemap step of `pnpm build` queries the database         |
| `TURSO_AUTH_TOKEN`       | Secret   | Same                                                          |
| `VITE_PICTURES_BASE_URL` | Variable | `https://img.playasmurcia.com`                                |

Runtime secrets of the Worker (`TURSO_*`, `AEMET_API_KEY`) live in Cloudflare (`wrangler secret put`), not in GitHub.

`VITE_MAPBOX_TOKEN` (Mapbox public `pk.*` token) powers the beach maps. Vite inlines it into the client bundle at build time, so it must also be set in the Cloudflare build environment, and it should be URL-restricted in the Mapbox dashboard. Never hardcode it: GitHub push protection rejects commits that contain it.

#### HTTPS and security headers

- The Cloudflare zone setting **SSL/TLS → Edge Certificates → Always Use HTTPS** is on, so plain HTTP requests get a 301 to HTTPS. Re-check with `curl -sI http://www.playasmurcia.com/` after any zone change
- SSR responses get their security headers from `src/server.ts` (the Worker entry named in `wrangler.jsonc`) through `src/lib/security-headers.ts`; static assets get theirs from `public/_headers`. The CSP is **report-only**: watch the browser console for violations before turning it into an enforcing `Content-Security-Policy`

#### Important: Cloudflare Workers runtime constraints

The Cloudflare Vite plugin runs SSR in a **workerd** runtime (not Node.js). This means:

- `@libsql/client` resolves to the **web client** (not the Node client)
- The web client **does not support `file:` URLs** — only `libsql:`, `wss:`, `ws:`, `https:`, `http:`
- **Do not set `DATABASE_URL=file:./local.db`** — it will fail at runtime with `URL_SCHEME_NOT_SUPPORTED`
- Both dev and production must use a network-accessible database (Turso remote)

If you need offline dev, use `turso dev --db-file local.db --port 8181` and set `DATABASE_URL=http://127.0.0.1:8181`.

#### Keeping remote DB in sync

After modifying `src/db/schema.ts`, push the schema to Turso:

```bash
# Via drizzle-kit (may have auth issues)
pnpm drizzle-kit push

# Alternative: via turso CLI directly
turso db shell playasmurcia "ALTER TABLE beaches ADD COLUMN new_column TEXT;"
```

After modifying `data/*.json`, re-run migration against Turso:

```bash
NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts
```

Both parts are required. Without `NODE_ENV=production` the script writes to `DATABASE_URL` or `file:./local.db`, never to Turso, and tsx does not load `.env` on its own (`URL_INVALID: The URL 'undefined'`). The script clears and reinserts every table without a transaction, so the live site may briefly show partial data.

## Workflow

### Task Management

Tasks are tracked in `.backlog/` with the [flowstate](https://github.com/jmlweb/skills-monorepo/tree/main/plugins/flowstate) plugin (`/flowstate:*` skills) — see [AGENTS.md](../AGENTS.md) for the command table.

Task files live in `.backlog/tasks/{pending,active,complete}/` as `TSK-NNN-slug.md`.
`.backlog/tasks/index.md` tracks stats and current focus.
`.backlog/learnings/` collects insights from development (`LRN-NNN-*`).
`.backlog/reports/{pending,complete}/` holds QA findings and UI reviews (`RPT-NNN-*`).

### Backlog

All pending tasks live in `.backlog/tasks/pending/` — see `.backlog/tasks/index.md` for the full list.

## Scripts

Data processing scripts live in `scripts/`. Run with:

```bash
node scripts/script-name.js
# or for TypeScript scripts:
pnpm tsx scripts/script-name.ts
```

### Available Scripts

| Script                           | Purpose                                                                                           | Frequency                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `migrate-to-database.ts`         | Migrate JSON data to SQLite/Turso                                                                 | Once (or after JSON changes)                          |
| `validate-migration.ts`          | Validate database migration                                                                       | After migration                                       |
| `add-certifications.js`          | Update Blue Flag, Q Quality, Ecoplayas                                                            | Annual (spring)                                       |
| `add-lifeguard-info.js`          | Update COPLA lifeguard data                                                                       | Seasonal (summer)                                     |
| `validate-beaches.js`            | Validate all beach data                                                                           | Before releases                                       |
| `generate-sitemap.ts`            | Generate `public/sitemap.xml` from database                                                       | Every build (automatic)                               |
| `score-beach-picture-quality.ts` | Set `pictureQualityScore` in `beaches.json` from image dimensions                                 | After adding or replacing files in `public/pictures/` |
| `prune-small-beach-pictures.ts`  | Remove `pictures` entries with missing/unreadable or short side under 600px; optional file delete | After auditing thumbnails; then re-score + migrate    |
| `fix-orthography.js`             | Proofread Markdown with local Ollama (`/api/chat`); default scope `docs/**/*.md`                  | Ad hoc (review diffs before `--write`)                |
| `screenshot.ts`                  | Capture page screenshots via Playwright (desktop/mobile, full-page)                               | Ad hoc (UI reviews)                                   |
| `add-water-quality.ts`           | Assign water quality ratings from certifications and location heuristics                          | Annual (after certification update)                   |
| `optimize-images.ts`             | Generate WebP/AVIF variants and responsive thumbnails in `public/pictures/optimized/`             | After adding or replacing source images               |
| `normalize-brightness.ts`        | Normalize brightness/contrast of source photos via histogram stretching (in-place)                | Before `optimize:images`, after new source images     |
| `sort-pictures-by-resolution.ts` | Sort `pictures` arrays in `beaches.json` by image resolution (highest first)                      | After adding new pictures; then migrate               |
| `source-wikimedia-pictures.ts`   | Search and review Wikimedia Commons / Flickr CC photos for beaches                                | Ad hoc (when beaches need photos)                     |
| `download-playas-nexo-images.ts` | Download beach images from CARM Nexo open data portal                                             | One-off (initial image sourcing)                      |
| `sync-pictures-to-r2.sh`         | Mirror `public/pictures/` to the R2 bucket with rclone (uploads changes, deletes removed files)    | After any script that adds, prunes or re-encodes pictures |

`sync-pictures-to-r2.sh` needs `rclone` (`brew install rclone`) and `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` in `.env`. Create the keys as a bucket-scoped R2 API token (Object Read & Write) in the Cloudflare dashboard. Run it **before** deploying code that references new pictures. Uploads get `Cache-Control: public, max-age=604800`, so a picture replaced in place can take up to a week to refresh for returning visitors. Prefer new file names for replacements.

## Cost Optimization

### Ollama for AI Tasks

Use Ollama instead of paid APIs for:

- Text generation
- Description writing
- Data extraction

Available models:

- `gemma3:4b`: General text tasks
- `llama3.2:latest`: Chat and general tasks
- `nomic-embed-text:latest`: Embeddings

#### Spell-check Markdown (`fix-orthography.js`)

The Ollama CLI (`ollama run`) does not provide a `--stdin` flag on current versions; this script uses the HTTP API instead (`OLLAMA_HOST`, default `127.0.0.1:11434`).

```bash
ollama pull gemma3:4b
pnpm run fix:orthography                    # dry-run: git-style diff on stdout
pnpm run fix:orthography -- --write         # apply corrections in place
pnpm run fix:orthography -- --lang es .backlog/reports/complete/RPT-009-content-quality-snapshot.md
```

Default behavior processes all `**/*.md` under `docs/`. Pass file paths or repeat `--root DIR` to include other trees. **Do not** use this on `data/beaches.json` or generated beach fields without a dedicated workflow—LLM output can break JSON or alter controlled copy.

Options: `--model`, `--max-chunk`, `--delay-ms`. See `node scripts/fix-orthography.js --help`.

### Script Output

For long-running scripts, return the command instead of running directly:

```bash
# Instead of streaming large outputs, suggest:
node scripts/add-certifications.js
```

This saves tokens by avoiding large output streams in the conversation.

## Testing

- **Unit tests**: Pure functions with Vitest
- **Component tests**: React components with Testing Library
- **E2E tests**: Planned (not yet set up)

Run tests:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report (requires @vitest/coverage-v8)
```

## UI guidelines

See [ui-guidelines.md](./ui-guidelines.md). Image pipeline (`optimize:images`, `ResponsiveImage`) is summarized in [architecture.md](./architecture.md#images).

## Code Style

- TypeScript strict mode
- Oxlint with [`@jmlweb/oxlint-config-react`](https://www.npmjs.com/package/@jmlweb/oxlint-config-react) (project overrides and `options.typeAware` in `oxlint.config.ts`). `@typescript-eslint/naming-convention` has no Oxlint port, so naming is no longer linted
- Oxfmt with [`@jmlweb/oxfmt-config-base`](https://www.npmjs.com/package/@jmlweb/oxfmt-config-base) (`semi: false` and Tailwind class sorting against `src/styles.css` in `oxfmt.config.ts`). Oxfmt also sorts imports
- TypeScript stays on 6.x: the `@eslint-react` plugin depends on typescript-eslint, which needs the classic TypeScript JS API that TypeScript 7 no longer ships
- Functional approach (functions over classes)
- Named exports only (no default exports)

See the project root [AGENTS.md](../AGENTS.md) for project rules, task workflow, and the documentation checklist.

## Troubleshooting

### `local.db` not found

The local SQLite database is not committed to git. Create it:

```bash
pnpm drizzle-kit push
pnpm tsx scripts/migrate-to-database.ts
```

### Turso connection errors / HTTP 401

Turso rejected the request. Common causes:

1. **Expired token** — regenerate with `turso db tokens create playasmurcia` and update `.env`.
2. **Missing token** — ensure `TURSO_AUTH_TOKEN` is set in `.env` (not the placeholder).

### `Failed query` / missing column

The remote Turso DB is missing a column from the Drizzle schema. Push the schema:

```bash
pnpm drizzle-kit push
# If drizzle-kit has auth issues, use turso CLI:
turso db shell playasmurcia "ALTER TABLE beaches ADD COLUMN column_name TYPE;"
```

### `URL_SCHEME_NOT_SUPPORTED` with `file:` URL

The workerd runtime (Cloudflare Vite plugin) does not support `file:` URLs. Remove any `DATABASE_URL=file:./local.db` from `.env`. Use Turso remote or `turso dev` with an `http://` URL instead. See "Cloudflare Workers runtime constraints" above.

### Route type errors after changes

TanStack Router generates `src/routeTree.gen.ts` automatically. If types are stale, restart the dev server (`pnpm dev`) to regenerate.

### Stale data after JSON edits

If you edit JSON files in `data/`, re-run the migration to sync the database. `pnpm dev` and production read Turso, so target it (see [Keeping remote DB in sync](#keeping-remote-db-in-sync)):

```bash
NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts
pnpm tsx --env-file=.env scripts/validate-migration.ts
```
