---
description: Full UI review cycle — audit pages, generate backlog tasks, update guidelines
model: sonnet
---

# UI Review

Run a complete UI design review of the site.

## Steps

1. Read `AGENTS.md` — section **Reports, UI reviews, and audits (mandatory for agents)** — and follow it for all paths and moves.

2. Read `.claude/agents/ui-designer.md` and adopt its role for the entire session.

3. Read `.claude/templates/ui-review.md` and execute the workflow described there (Phases 0-5).

**Screenshots:** Use Playwright through the repo script only — `pnpm tsx scripts/screenshot.ts <path> --full-page` and the same with `--mobile --full-page` per page (`scripts/screenshot.ts` wraps `playwright` Chromium). Read the PNGs; do not treat `curl` or HTML alone as the visual audit.
