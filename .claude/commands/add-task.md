---
argument-hint: [task description]
description: Groom and add a new task to the backlog
model: sonnet
---

# Add Task

Interactively groom a new task and add it to the development backlog.

## Usage

- `/add-task` - Interactive mode (asks questions)
- `/add-task "implement beach filters"` - Start with description

## Workflow

### 1. Read Current State

Read `docs/dev/INDEX.md` to understand current task count and priorities.

```bash
ls docs/dev/backlog/ docs/dev/done/ 2>/dev/null | grep -E '^[0-9]+' | sort -n | tail -1
```

### 2. Gather Task Information

Ask the user for:

1. **Task Name** (if not provided as argument)
   - Short, descriptive title
   - Example: "Beach filter sidebar", "Turso cloud setup"

2. **User Story**
   - Format: "As a [role], I want [goal] so that [benefit]"

3. **Acceptance Criteria**
   - Ask iteratively: "What else needs to be true for this to be complete?"
   - Aim for 3-6 specific, testable criteria
   - Each should be a checkbox item

4. **Slice** (suggest based on description)

   | Slice | Description | Typical Files |
   |-------|-------------|---------------|
   | Data | Beach data, JSON, scripts | `data/`, `scripts/` |
   | Database | Schema, queries, migrations | `src/lib/db-*`, `src/db/` |
   | Frontend | UI components, pages | `src/routes/`, `src/components/` |
   | SEO | Metadata, sitemap, structured data | `src/routes/__root.tsx`, `scripts/generate-sitemap.ts` |
   | Infra | Deploy, env, CI/CD | `.env`, `app.config.ts` |
   | Styling | CSS, Tailwind, design | `src/styles/`, component styles |

5. **Dependencies**
   - "Does this task depend on any existing tasks?"
   - Show list of pending tasks for reference

### 3. Suggest Priority

| Priority | Criteria |
|----------|----------|
| P2 - Next | No blockers, small scope, unblocks others |
| P3 | Normal backlog item |
| P4 | Nice-to-have, future consideration |

**Note**: P1 is reserved for the single active task.

### 4. Generate Task File

Create `docs/dev/backlog/XXX-task-name.md`:

```markdown
# Task #XXX: Task Title

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: [detected slice]
- **Created**: [today's date]
- **Started**: -
- **Blocked by**: -

## User Story

[user story]

## Acceptance Criteria

- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion 3]

## Implementation Notes

[relevant notes]

## Files to Modify

- [suggest based on slice]

## Dependencies

[list or "-"]

## Progress Log

(No progress yet)

## Learnings

(None yet)
```

### 5. Update INDEX.md

- Increment "Pending" count in Quick Stats
- Add row to Backlog table in priority order

### 6. Confirm

```
Created task #XXX: [title]
  Priority: P3
  Slice: [slice]
  File: docs/dev/backlog/XXX-task-name.md

Next steps:
- /start-task XXX to begin work
- /dev-status to see updated backlog
```

## Task Naming Convention

- Lowercase, hyphen-separated, descriptive
- Pattern: `XXX-short-description.md`
- Examples: `001-turso-cloud-setup.md`, `002-beach-filters.md`
