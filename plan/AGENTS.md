# Plan Directory Rules

General repository rules: [AGENTS.md](../AGENTS.md). For reports and UI directives, see _Reports, UI reviews, and audits_ in that file.

## Structure

- `main.md`: Index with ordered steps and status
- `step-*.md`: Individual step files

## Workflow

1. **Before starting a step**: Mark as "in progress" in `main.md`
2. **While working**: Update the step file with progress
3. **After completing**: Delete the step file, mark as done in `main.md`, commit

> Deleting completed step files is mandatory — keeps context clean.

## Rules

- Keep `main.md` in sync with existing step files
- When all steps complete, renumber `main.md` to eliminate gaps
- Unprioritized ideas live in `backlog/pending/`; prioritized work gets `step-XX-` prefix
