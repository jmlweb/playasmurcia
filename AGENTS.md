# PlayasMurcia — agent and contributor rules

This file is the single source of truth for how humans and AI coding agents should work in this repository. Technical documentation under `docs/` is in **English**. Public URLs and much of the UI copy are **Spanish**; follow existing patterns when adding user-facing text.

## Documentation map

Project documentation is in `docs/`:

- [Architecture](./docs/architecture.md) — Tech stack and project structure
- [Data Schema](./docs/data-schema.md) — Data files and validation rules
- [Business Rules](./docs/business-rules.md) — Data processing logic
- [Development](./docs/development.md) — Commands and workflow
- [UI Guidelines](./docs/ui-guidelines.md) — Visual design, colors, typography, accessibility
- **Dev reports & UI review layout** — Not a separate doc: see [Reports, UI reviews, and audits (mandatory for agents)](#reports-ui-reviews-and-audits-mandatory-for-agents) in this file (`docs/dev/ui-review/`, `docs/dev/reports/`).

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
- **Reports, UI reviews, and audits** — [Reports, UI reviews, and audits (mandatory for agents)](#reports-ui-reviews-and-audits-mandatory-for-agents); short pointers: [docs/dev/ui-review/README.md](./docs/dev/ui-review/README.md), [docs/dev/reports/README.md](./docs/dev/reports/README.md)

### Reports, UI reviews, and audits (mandatory for agents)

**AI agents must read and follow this subsection** before creating, moving, or linking any UI review directive, standalone report, or data audit markdown. There is **no** central JSON registry and **no** `pnpm reports:status` command — traceability is **task files + paths**.

| Location | Use |
|----------|-----|
| `docs/dev/ui-review/{name}.md` | **Active** UI directives while a review is in progress (before backlog tasks exist). |
| `docs/dev/ui-review/processed/{name}.md` | Directives **after** backlog tasks reference them. Split files if only part of a directive was task-backed. |
| `docs/dev/reports/{name}.md` | **Active** standalone reports (e.g. v3 vs production draft) before tasks cite them. |
| `docs/dev/reports/processed/{name}.md` | Standalone reports **and** data/content audits used as reference artifacts for tasks (e.g. `v3-vs-production-beach-detail.md`, `content-audit.md`). |
| `docs/github-main-feature-gap-analysis.md` | Product parity vs `main` — stays at `docs/` root; link from tasks when relevant. |

**Required behavior**

1. **`/ui-review`**: Run the workflow in [`.claude/templates/ui-review.md`](./.claude/templates/ui-review.md) under the role in [`.claude/agents/ui-designer.md`](./.claude/agents/ui-designer.md). Write directives under `docs/dev/ui-review/` during the audit; after creating backlog tasks, **move** covered files to `docs/dev/ui-review/processed/` and ensure every new task links to the **final** path (`docs/dev/ui-review/processed/…`).
2. **Other reports**: Add markdown under `docs/dev/reports/` first if no tasks yet; when tasks reference the report, **move** it to `docs/dev/reports/processed/` and put the repo-relative path in the task body (see existing tasks for tone).
3. **Moves/renames**: Search the repo for the old path and update `docs/dev/backlog/`, `docs/dev/done/`, and any doc that linked to it.
4. **Guidelines**: UI work still defers to [`docs/ui-guidelines.md`](./docs/ui-guidelines.md); propose updates per the UI review template Phase 4 when appropriate.

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
| New or moved UI directives / dev reports | This file — [Reports, UI reviews, and audits](#reports-ui-reviews-and-audits-mandatory-for-agents); folder READMEs under `docs/dev/ui-review/` and `docs/dev/reports/` |

**Checklist before completing a task**

1. Data schema changed? → `data-schema.md`
2. Business logic changed? → `business-rules.md`
3. Structure or stack changed? → `architecture.md`
4. Workflow or commands changed? → `development.md`
5. Report / UI review layout or rules changed? → this file (`AGENTS.md`) and the README under `docs/dev/reports/` or `docs/dev/ui-review/` if the folder contract changed
