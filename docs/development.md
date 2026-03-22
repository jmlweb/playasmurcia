# Development Guide

## Environment Setup

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
```

## Database Commands

```bash
pnpm drizzle-kit push    # Push schema changes to local.db
pnpm drizzle-kit studio  # Open Drizzle Studio (database viewer)
pnpm tsx scripts/migrate-to-database.ts   # Migrate JSON to database
pnpm tsx scripts/validate-migration.ts    # Validate migration
```

### Environment Variables

```bash
# Local development (default)
DATABASE_URL=file:./local.db

# Production (Turso)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

Copy `.env.example` to `.env` and configure for your environment.

## Workflow

### Plan-Based Development

1. `plan/main.md` contains the master plan with all pending steps
2. Each step has its own file: `plan/step-XX-description.md`
3. Before starting: Mark step as "in progress" in `main.md`
4. After completing: Delete the step file and mark as done in `main.md`

### Backlog

`backlog/` contains future ideas not yet integrated into the main plan:
- `step-*.md`: Future enrichment steps
- `service-*.md`: Backend service proposals

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

## Code Style

- TypeScript strict mode
- ESLint with TanStack config
- Prettier with Tailwind plugin
- Functional approach (functions over classes)
- Named exports only (no default exports)

See the project root `CLAUDE.md` for detailed code style guidelines.

## Troubleshooting

### `local.db` not found

The local SQLite database is not committed to git. Create it:

```bash
pnpm drizzle-kit push
pnpm tsx scripts/migrate-to-database.ts
```

### Turso connection errors

Verify credentials in `.env`. For local dev, `DATABASE_URL=file:./local.db` is sufficient — Turso credentials are only needed for production.

### Route type errors after changes

TanStack Router generates `src/routeTree.gen.ts` automatically. If types are stale, restart the dev server (`pnpm dev`) to regenerate.

### Stale data after JSON edits

If you edit JSON files in `data/`, re-run the migration to sync the database:

```bash
pnpm tsx scripts/migrate-to-database.ts
pnpm tsx scripts/validate-migration.ts
```
