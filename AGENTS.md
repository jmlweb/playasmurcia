# PlayasMurcia — agent and contributor rules

This file is the single source of truth for how humans and AI coding agents should work in this repository. Technical documentation under `docs/` is in **English**. Public URLs and much of the UI copy are **Spanish**; follow existing patterns when adding user-facing text.

## Documentation map

Project documentation is in `docs/`:

- [Architecture](./docs/architecture.md) — Tech stack and project structure
- [Data Schema](./docs/data-schema.md) — Data files and validation rules
- [Business Rules](./docs/business-rules.md) — Data processing logic
- [Development](./docs/development.md) — Commands and workflow
- [UI Guidelines](./docs/ui-guidelines.md) — Visual design, colors, typography, accessibility

## Project state

- **Branch**: `v3`
- **Package manager**: **pnpm** only (`package.json` → `packageManager`). Enable with `corepack enable` (Node 20+). Do not use `npm install` in this repo — `package-lock.json` is gitignored.
- **Data access**: Route loaders use async queries via `src/lib/db-data.ts` against Turso (libSQL). There is **no** runtime JSON loader in `src/lib/`; `data/*.json` is the **editorial source** — edit JSON, then migrate (see `docs/architecture.md` and `docs/development.md`).
- **Local DB**: `local.db` is created locally (not committed); use Drizzle push + migration script as documented.
- **Next steps**: [docs/dev/INDEX.md](./docs/dev/INDEX.md) for the backlog; [docs/github-main-feature-gap-analysis.md](./docs/github-main-feature-gap-analysis.md) for product parity vs `main`.

## Task management

Tasks live under `docs/dev/`:

- [INDEX.md](./docs/dev/INDEX.md) — Overview, stats, backlog table
- [LEARNINGS.md](./docs/dev/LEARNINGS.md) — Development insights
- `docs/dev/backlog/` — Pending task files
- `docs/dev/done/` — Completed task files

### Slash-style commands (Claude Code / similar)

| Command | Description |
|---------|-------------|
| `/add-task` | Groom and add a new task to backlog |
| `/start-task` | Mark a task as in-progress |
| `/complete-task` | Complete a task, move to done |
| `/block-task` | Mark a task as blocked |
| `/check-task` | Verify task status matches reality |
| `/next-task` | Suggest next priority task |
| `/dev-status` | Show development status overview |
| `/parallel-tasks` | Execute independent tasks in parallel |
| `/add-learning` | Document a development insight |
| `/ui-review` | Full UI review cycle with design audit |
| `/complete-backlog` | Work through backlog autonomously via Ralph Loop |

Command definitions: `.claude/commands/`.

## Plan management

Execution plans under `plan/` follow [plan/AGENTS.md](./plan/AGENTS.md) (step files, `main.md`, cleanup rules).

## Runtime constraints

- **Cloudflare Workers (workerd)**: no `file:` URLs, no Node.js built-ins (`fs`, `path`, `child_process`), no native binaries
- **Database**: Turso remote only (`libsql` web client) — `file:` URLs will fail at runtime
- **See** `docs/development.md` for full environment setup and troubleshooting

## Complexity routing

| Scope | Approach |
|-------|----------|
| Single-file, obvious change | Implement directly |
| 2-5 files, multiple valid approaches | Use Plan mode (`EnterPlanMode`) |
| 6+ files or multi-domain (frontend + backend + data) | Use `/do-task` with agent orchestration |

## Verification before completing any task

All three must pass before a task can be marked complete:

1. `pnpm build` — no build errors
2. `pnpm test` — no regressions
3. `pnpm check` — type-check + lint + format clean

## Testing rules

| Change type | Test required |
|-------------|---------------|
| New utility/lib function | Unit test (Vitest) |
| New component with logic | Component test (Testing Library) |
| Data-only changes (JSON edits) | Run `node scripts/validate-beaches.js` |
| Styling-only changes | Visual verification (screenshot or manual) |
| Bug fix | Regression test if feasible |

## Agent orchestration

When implementing features (e.g. via a global `/do-task` skill), prefer this workflow:

| Role | Responsibility |
|------|----------------|
| Explore | Understand codebase structure before implementation |
| Plan | Design approach for complex features |
| frontend-developer | Implement UI + unit/integration tests for that code |
| backend-developer | Implement APIs + unit/integration tests for that code |
| qa-engineer | Verify coverage; E2E when infrastructure exists; quality audit |
| code-reviewer | Final review before merge |

**Testing**

- Developers write tests for their own changes (TDD when practical).
- QA verifies coverage and user-flow tests where applicable.
- Do not skip verification after implementation.

## Cost optimization

For long-running work (LLM batches, heavy API usage, large downloads), add a script under `scripts/` and document the command in `docs/development.md` instead of hiding one-off logic only in chat.

Example:

```bash
node scripts/example-batch-job.js
```

## Script retention

Keep scripts in `scripts/` only when data must be revalidated over time (certifications, occupancy, weather, etc.). Remove one-off enrichment scripts after use.

Retained scripts must be documented in `docs/development.md` with purpose, when to run, env vars or keys, and expected frequency.

## Data editing

- Do not hand-edit generated fields (e.g. `description`, `access` where generated); use the appropriate script.
- Validation rules: [docs/data-schema.md](./docs/data-schema.md).

## Documentation maintenance

After structural or behavioral changes, update the matching doc:

| Change type | Update |
|-------------|--------|
| New/modified data fields | `docs/data-schema.md` |
| New data files (JSON) | `docs/data-schema.md` — file table, relationships |
| New scripts | `docs/business-rules.md` and `docs/development.md` |
| Business logic | `docs/business-rules.md` |
| New dependencies / tech | `docs/architecture.md` — tech stack |
| Project structure | `docs/architecture.md` — directory tree |
| New commands | `docs/development.md` |
| New routes/pages | `docs/architecture.md` — routing |

**Checklist before completing a task**

1. Data schema changed? → `data-schema.md`
2. Business logic changed? → `business-rules.md`
3. Structure or stack changed? → `architecture.md`
4. Workflow or commands changed? → `development.md`
