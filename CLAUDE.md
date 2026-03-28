# Project Rules

## Documentation

Project documentation is in `docs/`:

- [Architecture](./docs/architecture.md) - Tech stack and project structure
- [Data Schema](./docs/data-schema.md) - Data files and validation rules
- [Business Rules](./docs/business-rules.md) - Data processing logic
- [Development](./docs/development.md) - Commands and workflow
- [UI Guidelines](./docs/ui-guidelines.md) - Visual design, colors, typography, accessibility

## Project State

- **Branch**: `v3` (database migration nearly complete)
- **Data access**: Routes use async database queries via `src/lib/db-data.ts`. The old JSON-based `src/lib/data.ts` is kept as fallback. Local DB (`local.db`) is populated.
- **Next steps**: See [docs/dev/INDEX.md](./docs/dev/INDEX.md) for backlog and [github-main-feature-gap-analysis.md](./docs/github-main-feature-gap-analysis.md) for product parity status.

## Task Management

Development tasks are tracked in `docs/dev/`:

- [INDEX.md](./docs/dev/INDEX.md) - Task overview, stats, and backlog
- [LEARNINGS.md](./docs/dev/LEARNINGS.md) - Insights discovered during development
- `docs/dev/backlog/` - Pending task files
- `docs/dev/done/` - Completed task files

### Commands

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

## Plan Management

See [plan/CLAUDE.md](./plan/CLAUDE.md) for rules on managing execution plans.

## Claude-Specific Rules

### Agent Orchestration

When using `/do-task` to implement features, follow this agent workflow:

| Agent | Responsibility |
|-------|----------------|
| `Explore` | Understand codebase structure before implementation |
| `Plan` | Design approach for complex features |
| `frontend-developer` | Implement UI + write unit/integration tests for their code |
| `backend-developer` | Implement APIs + write unit/integration tests for their code |
| `qa-engineer` | Verify test coverage, write E2E tests (when test infrastructure is set up), audit quality |
| `code-reviewer` | Final review before PR |

**Testing responsibilities:**
- **Developers write tests** for their own code (TDD approach)
- **QA verifies** coverage exists and writes E2E tests for user flows
- Never skip QA verification after implementation

### Cost Optimization

For long-running processes (Ollama calls, batch operations, API requests), create a script in `scripts/` and return the command instead of running directly:

```bash
# Return this instead of running directly:
node scripts/add-certifications.js
```

### Script Retention

Only keep scripts in `scripts/` if the data requires periodic revalidation:

- **Keep**: Scripts for data that changes over time (certifications, occupancy, weather)
- **Delete**: One-time data enrichment scripts (initial descriptions, static attributes)

If a script is retained, document it in `docs/development.md` with:
- Purpose and when to run
- Required environment variables or API keys
- Expected frequency (daily, weekly, seasonal)

### Data Editing

- Never manually edit generated fields (`description`, `access`)
- Run the appropriate script to regenerate
- See [data-schema.md](./docs/data-schema.md) for validation rules

### Documentation Maintenance

After any structural or code change, update the corresponding documentation in `docs/`:

| Change Type | Update |
|-------------|--------|
| New/modified data fields | `data-schema.md` - schemas, validation rules |
| New data files (JSON) | `data-schema.md` - file table, relationships |
| New scripts | `business-rules.md` and `development.md` - script tables |
| Business logic changes | `business-rules.md` - relevant section |
| New dependencies/tech | `architecture.md` - tech stack table |
| Project structure changes | `architecture.md` - directory tree |
| New commands | `development.md` - commands section |
| New routes/pages | `architecture.md` - routing section |

**Checklist before completing a task:**

1. Did I add/modify a data schema? → Update `data-schema.md`
2. Did I add/modify business logic? → Update `business-rules.md`
3. Did I add/modify project structure? → Update `architecture.md`
4. Did I add/modify dev workflow? → Update `development.md`
