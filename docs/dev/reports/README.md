# Dev reports

Standalone reports and data audits used alongside the backlog. **Rules for agents are in [AGENTS.md](../../../AGENTS.md)** — section *Reports, UI reviews, and audits (mandatory for agents)*. This file is a short layout reference only.

## Layout

| Path | Role |
|------|------|
| `docs/dev/reports/{name}.md` | Report in progress, **no** backlog tasks yet. |
| `docs/dev/reports/processed/{name}.md` | Report or audit **referenced by** `docs/dev/backlog/` or `docs/dev/done/` tasks. |

**Examples in this repo:** `processed/v3-vs-production-beach-detail.md` (comparison), `processed/content-audit.md` (data quality snapshot).

## Adding or updating a report

1. Read **AGENTS.md** (subsection above).
2. Place the file in the correct folder; when tasks cite it, move to `processed/` and update every task link and any other doc that pointed at the old path (search the repo).
