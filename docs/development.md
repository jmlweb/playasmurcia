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
pnpm lint          # Run ESLint
pnpm lint:fix      # Run ESLint with auto-fix
pnpm format        # Format with Prettier
pnpm type-check    # TypeScript type checking (tsc --noEmit)
pnpm check         # Run type-check + lint + prettier check
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
```

### Dev reports and UI reviews

No registry file or `pnpm reports:status`. **Authoritative workflow and paths:** [AGENTS.md](../AGENTS.md) — *Reports, UI reviews, and audits (mandatory for agents)*. Short layout: [`dev/reports/README.md`](dev/reports/README.md), [`dev/ui-review/README.md`](dev/ui-review/README.md).

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

After modifying `data/*.json`, re-run migration:

```bash
pnpm tsx scripts/migrate-to-database.ts
```

## Workflow

### Task Management

Tasks are tracked in `docs/dev/` using Claude Code slash commands — see [AGENTS.md](../AGENTS.md) for the full command table.

Task files live in `docs/dev/backlog/` (pending) and `docs/dev/done/` (completed).
`docs/dev/INDEX.md` tracks stats and current focus.
`docs/dev/LEARNINGS.md` collects insights from development.

### Plan-Based Development

1. `plan/main.md` contains the master plan with all pending steps
2. Each step has its own file: `plan/step-XX-description.md`
3. Before starting: Mark step as "in progress" in `main.md`
4. After completing: Delete the step file and mark as done in `main.md`

### Backlog

All pending tasks live in `docs/dev/backlog/` — see `docs/dev/INDEX.md` for the full list.

## Scripts

Data processing scripts live in `scripts/`. Run with:

```bash
node scripts/script-name.js
# or for TypeScript scripts:
pnpm tsx scripts/script-name.ts
```

### Available Scripts

| Script | Purpose | Frequency |
|--------|---------|-----------|
| `migrate-to-database.ts` | Migrate JSON data to SQLite/Turso | Once (or after JSON changes) |
| `validate-migration.ts` | Validate database migration | After migration |
| `add-certifications.js` | Update Blue Flag, Q Quality, Ecoplayas | Annual (spring) |
| `add-lifeguard-info.js` | Update COPLA lifeguard data | Seasonal (summer) |
| `validate-beaches.js` | Validate all beach data | Before releases |
| `generate-sitemap.ts` | Generate `public/sitemap.xml` from database | Every build (automatic) |
| `score-beach-picture-quality.ts` | Set `pictureQualityScore` in `beaches.json` from image dimensions | After adding or replacing files in `public/pictures/` |
| `prune-small-beach-pictures.ts` | Remove `pictures` entries with missing/unreadable or short side under 600px; optional file delete | After auditing thumbnails; then re-score + migrate |
| `fix-orthography.js` | Proofread Markdown with local Ollama (`/api/chat`); default scope `docs/**/*.md` | Ad hoc (review diffs before `--write`) |
| `screenshot.ts` | Capture page screenshots via Playwright (desktop/mobile, full-page) | Ad hoc (UI reviews) |

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
pnpm run fix:orthography -- --lang es docs/dev/reports/processed/content-audit.md
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
- ESLint with [`@jmlweb/eslint-config-react`](https://www.npmjs.com/package/@jmlweb/eslint-config-react) (project overrides under `eslint.config.js`)
- Prettier with [`@jmlweb/prettier-config-tailwind`](https://www.npmjs.com/package/@jmlweb/prettier-config-tailwind) (`semi: false` kept in `prettier.config.js`)
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

If you edit JSON files in `data/`, re-run the migration to sync the database:

```bash
pnpm tsx scripts/migrate-to-database.ts
pnpm tsx scripts/validate-migration.ts
```
