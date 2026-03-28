---
description: Full UI review cycle — audit pages, generate backlog tasks, update guidelines
model: sonnet
---

# UI Review

Run a complete UI design review of the site, acting as the agent defined in `.claude/agents/ui-designer.md`.

## Prerequisites

- Dev server running on `http://localhost:3000`
- Read `.claude/agents/ui-designer.md` and adopt its role, personality, and directive format for the entire session

## Phase 0: Verify Server

Fetch `http://localhost:3000` — if the request fails, tell the user to start the dev server (`pnpm dev`) and **stop**. Do not proceed without a running server.

## Phase 1: Discover Pages

Read `src/routes/` to build a page inventory. Select **one representative URL per route type**:

| Route Type | File | Example URL |
|------------|------|-------------|
| Homepage | `src/routes/index.tsx` | `/` |
| Beach detail | `src/routes/playas/$slug.tsx` | Pick a beach with a photo |
| Municipality list | `src/routes/municipios/index.tsx` | `/municipios` |
| Municipality detail | `src/routes/municipios/$slug.tsx` | Pick one with multiple beaches |
| Collection index | `src/routes/colecciones/index.tsx` | `/colecciones` |
| Collection detail | `src/routes/colecciones/$slug.tsx` | Pick one |
| Explorer | `src/routes/explorar/index.tsx` | `/explorar` |

To pick dynamic slugs, query the database or read the data to find good examples (beaches with photos, municipalities with several beaches, etc.).

Present the page list to the user and ask for confirmation before proceeding.

## Phase 2: Audit Each Page

For each page in the list, sequentially:

1. **Read the source** — route file + every component it imports
2. **Read `docs/ui-guidelines.md`** (first iteration only, then reference as needed)
3. **Read `src/styles.css`** for theme tokens (first iteration only)
4. **Fetch the rendered page** from localhost:3000 to see the actual HTML output
5. **Take a screenshot** of the page using the screenshot script for visual reference:
   ```bash
   pnpm tsx scripts/screenshot.ts /path --out /tmp/ui-review-{page-name}.png --full-page
   pnpm tsx scripts/screenshot.ts /path --out /tmp/ui-review-{page-name}-mobile.png --mobile --full-page
   ```
   Read the screenshot images to visually inspect the page.
6. **Produce a Design Directive** following the format in the agent definition (Critical / Important / Refinement / What Works Well)
7. **Write the directive** to `docs/dev/ui-review/{page-name}.md`

### Rules During Audit

- Be granular: exact values, exact ratios, exact measurements
- Be consistent: if you flag something on one page, flag it everywhere
- Track **cross-cutting issues** (problems that appear on multiple pages) in a separate file: `docs/dev/ui-review/cross-cutting.md`
- Do NOT implement any code changes
- Do NOT update guidelines yet (that's Phase 4)

## Phase 3: Generate Backlog Tasks

After all pages are reviewed:

1. **Read all review files** from `docs/dev/ui-review/`
2. **Group findings** into coherent tasks:
   - Cross-cutting issues → one task per theme (e.g., "Fix contrast across all pages", "Standardize card spacing")
   - Page-specific issues → one task per page if enough Critical/Important items, otherwise bundle similar pages
3. **Read `docs/dev/INDEX.md`** to determine next task number
4. **Create task files** in `docs/dev/backlog/` following the project format (see existing tasks for reference):
   - Slice: `Styling`
   - Priority: `P2 - Next` for Critical items, `P3` for Important/Refinement
   - Acceptance criteria: derived directly from the design directives
   - Include a reference to the review file: `See docs/dev/ui-review/{file}.md for full directive`
5. **Update `docs/dev/INDEX.md`** — add tasks to Backlog table, update counts
6. **Present a summary** to the user: tasks created, priority breakdown, estimated scope

## Phase 4: Update Guidelines

1. **Review all directives** for patterns that reveal gaps or outdated rules in `docs/ui-guidelines.md`
2. **Propose updates** to the user — show what you want to add/change and why
3. **After user approval**, update `docs/ui-guidelines.md` with:
   - New tokens or patterns discovered during the audit
   - Corrections to existing rules that contradict best practice
   - New sections if a whole category was missing (e.g., animation standards, interactive states)

## Phase 5: Cleanup

1. Keep the `docs/dev/ui-review/` directory — tasks reference these files
2. Summarize the full review:
   - Total issues found (Critical / Important / Refinement)
   - Tasks created
   - Guidelines updated (yes/no, what changed)
   - Top 3 highest-impact changes recommended

## Output

End with:

```
UI_REVIEW_COMPLETE
Pages reviewed: N
Issues found: X critical, Y important, Z refinement
Tasks created: #NNN, #NNN, ...
Guidelines updated: yes/no
```
