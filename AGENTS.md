---
description:
alwaysApply: true
---

# PlayasMurcia — agent and contributor rules

This file is the single source of truth for how humans and AI coding agents should work in this repository. **Contributor-facing documentation** — everything under `docs/`, everything under `.backlog/` (tasks, learnings, reports) — is in **English**. Public URLs and much of the UI copy are **Spanish**; follow existing patterns when adding user-facing text.

## Spelling and orthography (all languages)

AI agents and contributors must keep **correct spelling, punctuation, and diacritics** (accents, tildes, cedillas, umlauts, etc.) for **every** language in scope—Spanish UI, English docs, metadata, `aria-*` labels, error messages, task files, and editorial fields in `data/*.json` unless a field is explicitly machine-only.

- **Do not** strip diacritics or use ASCII stand-ins (e.g. `año` must not become `ano`; `más` must not become `mas` when it means "more").
- **Spanish**: follow standard orthography; when in doubt, prefer forms consistent with nearby copy and authoritative references for place names and common UI terms.
- **English** (`docs/`, `.backlog/learnings/index.md`, comments where English is used): use standard spelling and typography (hyphens, apostrophes, not “smart punctuation” hacks that break code—only in prose/markdown).
- When changing existing strings, **fix** obvious typos you touch; avoid introducing new ones. Re-read **only the lines you edited** before finishing (or the full visible string if the change is small).

## Documentation map

Project documentation is in `docs/`:

- [Architecture](./docs/architecture.md) — Tech stack and project structure
- [Data Schema](./docs/data-schema.md) — Data files and validation rules
- [Business Rules](./docs/business-rules.md) — Data processing logic
- [Development](./docs/development.md) — Commands and workflow
- [UI Guidelines](./docs/ui-guidelines.md) — Visual design, colors, typography, accessibility
- **Reports & UI reviews** — See [Reports, UI reviews, and audits (mandatory for agents)](#reports-ui-reviews-and-audits-mandatory-for-agents) in this file (`reports/`).

## Project state

- **Branch**: `main` — every push deploys to production (www.playasmurcia.com) through `.github/workflows/ci.yml`
- **Package manager**: **pnpm** only — see [docs/development.md](./docs/development.md) for setup.
- **Data access**: Route loaders use async queries via `src/lib/db-data.ts` against Turso (libSQL). There is **no** runtime JSON loader in `src/lib/`; `data/*.json` is the **editorial source** — edit JSON, then migrate (see `docs/architecture.md` and `docs/development.md`). CI does **not** migrate Turso; run the production migration by hand before pushing.
- **Local DB**: `local.db` is created locally (not committed); use Drizzle push + migration script as documented.
- **Next steps**: [.backlog/tasks/index.md](./.backlog/tasks/index.md) for the backlog; [.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md](./.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md) for product parity vs `main`.

## Task management

Tasks, ideas, reports and learnings live in `.backlog/`, managed by the **flowstate** plugin (`/flowstate:*` skills). Do not hand-edit index files; use the skills or `flowstate index-rebuild`.

- [.backlog/tasks/index.md](./.backlog/tasks/index.md) — Overview, stats, backlog table
- `.backlog/tasks/{pending,active,complete}/` — `TSK-NNN-slug.md` task files
- `.backlog/learnings/` — `LRN-NNN-*` development insights ([index](./.backlog/learnings/index.md))
- `.backlog/ideas/{pending,complete}/` — `PLN-NNN-*` implementation plans
- `.backlog/reports/{pending,complete}/` — `RPT-NNN-*` QA findings, UI reviews and audits (`complete` = triaged)

### Reports, UI reviews, and audits (mandatory for agents)

**AI agents must read and follow this subsection** before creating, moving, or linking any UI review directive, standalone report, or data audit. Traceability is **task files + paths**; there is no JSON registry.

**Required behavior**

1. **`/ui-review`**: Run the workflow in [`.claude/templates/ui-review.md`](./.claude/templates/ui-review.md) under the role in [`.claude/agents/ui-designer.md`](./.claude/agents/ui-designer.md). **Visual audit evidence** must use **Playwright** via `pnpm tsx scripts/screenshot.ts` (desktop + `--mobile`, both `--full-page` per page) — see the template’s _Screenshots: Playwright only_ section. File directives with `/flowstate:report` (they land in `.backlog/reports/pending/`); after creating backlog tasks, triage them (`flowstate report-move RPT-NNN --status triaged --task-id TSK-NNN`) and link each new task to the final path in `.backlog/reports/complete/`.
2. **Other reports** (QA findings, audits): use `/flowstate:report`; when tasks reference the report, triage it and put the repo-relative path in the task body.
3. **Moves/renames**: Search the repo for the old path and update the tasks and docs that linked to it.
4. **Guidelines**: UI work still defers to [`docs/ui-guidelines.md`](./docs/ui-guidelines.md); propose updates per the UI review template Phase 4 when appropriate.

### Slash-style commands

Workflow commands come from the flowstate plugin (usable in any agent tool that loads it):

| Command                      | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `/flowstate:add-task`        | Groom and add a new task to the backlog      |
| `/flowstate:start-task`      | Move a task to active                        |
| `/flowstate:complete-task`   | Verify criteria, move a task to complete     |
| `/flowstate:block-task`      | Block or unblock a task                      |
| `/flowstate:check-task`      | Verify task status matches the code          |
| `/flowstate:next-task`       | Suggest the next priority task               |
| `/flowstate:overview`        | Show backlog stats and health                |
| `/flowstate:log-progress`    | Record session progress on a task            |
| `/flowstate:add-learning`    | Document a development insight               |
| `/flowstate:report`          | File a bug, finding, improvement or security report |
| `/flowstate:idea`            | Plan an implementation before coding         |
| `/flowstate:parallel`        | Run independent tasks in parallel worktrees  |

Project-specific (`.claude/commands/`):

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `/ui-review`        | Full UI review cycle with design audit           |
| `/complete-backlog` | Work through backlog autonomously via Ralph Loop |

## Plan management

Execution plans under `plan/` follow [plan/AGENTS.md](./plan/AGENTS.md) (step files, cleanup rules).

## Runtime constraints

See [docs/development.md](./docs/development.md) for full environment setup, troubleshooting, and workerd limitations. Key rules for agents:

- **No Node built-ins** (`fs`, `path`, `child_process`) — workerd is not Node.js
- **No `file:` database URLs** — use Turso remote or `turso dev` with `http://`

## Code conventions

- **Named exports only** — no default exports (better tree-shaking, clearer imports)
- **Do not edit generated files** — `src/routeTree.gen.ts` is generated by TanStack Router; restart `pnpm dev` to regenerate

## Complexity routing

| Scope                                                | Approach                                |
| ---------------------------------------------------- | --------------------------------------- |
| Single-file, obvious change                          | Implement directly                      |
| 2-5 files, multiple valid approaches                 | Use Plan mode (`EnterPlanMode`)         |
| 6+ files or multi-domain (frontend + backend + data) | Use `/do-task` with agent orchestration |

## Verification before completing any task

All three must pass before a task can be marked complete:

1. `pnpm build` — no build errors
2. `pnpm test` — no regressions
3. `pnpm check` — type-check + lint + format clean

## Testing rules

| Change type                    | Test required                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| New utility/lib function       | Unit test (Vitest)                                                                                                                   |
| New component with logic       | Component test (Testing Library)                                                                                                     |
| Data-only changes (JSON edits) | Run `node scripts/validate-beaches.js`                                                                                               |
| Styling-only changes           | Visual verification — use `pnpm tsx scripts/screenshot.ts <path>` (Playwright Chromium; see `scripts/screenshot.ts`) or manual check |
| Bug fix                        | Regression test if feasible                                                                                                          |

## Agent orchestration

When implementing features (e.g. via a global `/do-task` skill), prefer this workflow:

| Role               | Responsibility                                                 |
| ------------------ | -------------------------------------------------------------- |
| Explore            | Understand codebase structure before implementation            |
| Plan               | Design approach for complex features                           |
| frontend-developer | Implement UI + unit/integration tests for that code            |
| backend-developer  | Implement APIs + unit/integration tests for that code          |
| qa-engineer        | Verify coverage; E2E when infrastructure exists; quality audit |
| code-reviewer      | Final review before merge                                      |

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

- Do not hand-edit generated fields; use the appropriate script. `description` and `access` are hand-edited copy (guidelines in `docs/business-rules.md`).
- Validation rules: [docs/data-schema.md](./docs/data-schema.md).

## Pre-completion checklist

Before marking any task as done, verify each applies and update accordingly:

- [ ] Data schema changed? → update `docs/data-schema.md`
- [ ] New data files (JSON)? → update `docs/data-schema.md` (file table, relationships)
- [ ] Business logic changed? → update `docs/business-rules.md`
- [ ] New scripts? → update `docs/business-rules.md` and `docs/development.md`
- [ ] New dependencies / tech? → update `docs/architecture.md` (tech stack)
- [ ] Project structure changed? → update `docs/architecture.md` (directory tree)
- [ ] New routes/pages? → update `docs/architecture.md` (routing)
- [ ] New commands? → update `docs/development.md`
- [ ] Report / UI review layout changed? → update this file — [Reports, UI reviews, and audits](#reports-ui-reviews-and-audits-mandatory-for-agents)
- [ ] User-facing copy or editorial JSON text changed? → verify diacritics and spelling per [Spelling and orthography](#spelling-and-orthography-all-languages)
