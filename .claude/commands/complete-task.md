---
argument-hint: [task number]
description: Complete a task, move to done, update INDEX
model: sonnet
---

# Complete Task

Mark a task as completed, move to done/, transfer learnings, and update INDEX.

## Usage

- `/complete-task` - Complete current active task
- `/complete-task 003` - Complete specific task

## Workflow

### 1. Identify Task

If no argument: use active task from `backlog/INDEX.md` Current Focus.
If argument: validate task exists in `backlog/pending/`.

### 2. Verify Implementation (auto check-task)

Before checking acceptance criteria, verify the task's implementation matches reality.
This is an automatic `/check-task` step — do NOT skip it.

For each acceptance criterion:

1. Read files listed in "Files to Modify"
2. Search for implementations matching the criterion
3. Verify the code actually does what the criterion describes

Report findings as a quick summary:

```
## Implementation Check
| Criterion | Code Evidence | Status |
|-----------|--------------|--------|
| Query returns filtered data | db-data.ts:45 uses WHERE clause | Verified |
| Route renders results | /playas/$slug.tsx maps data | Verified |
| Tests pass | location-map.test.tsx green | Verified |
```

If any criterion is NOT verifiable in the code:

- Flag it clearly
- Ask user whether to proceed or abort

### 3. Verify Acceptance Criteria Checkboxes

Check all acceptance criteria checkboxes in the task file:

```markdown
- [x] Criterion 1 -- OK
- [x] Criterion 2 -- OK
- [ ] Criterion 3 -- NOT CHECKED
```

If incomplete criteria exist:

```
Task #XXX has unchecked acceptance criteria:
- [ ] Criterion 3

Options:
1. Mark as complete anyway (criteria no longer relevant)
2. Continue working (abort completion)
3. Update criteria (remove/modify items)
```

### 4. Extract Learnings

If task has learnings in its "Learnings" section:

1. Read `backlog/LEARNINGS.md`
2. Determine next learning ID (LXXX)
3. Append to appropriate category section
4. Format:

```markdown
### LXXX: Brief title

**Date**: YYYY-MM-DD | **Task**: #XXX Task title
**Context**: What was being attempted
**Learning**: What was discovered
**Action**: How it was applied
```

### 5. Update Task File

```markdown
- **Status**: completed
- **Completed**: [today's date]
```

Add final Progress Log entry:

```markdown
- [YYYY-MM-DD HH:MM] Task completed
```

### 6. Move Task File

```bash
mv backlog/pending/XXX-task-name.md backlog/done/XXX-task-name.md
```

### 7. Update INDEX.md

1. **Quick Stats**: Decrement Pending/In Progress, increment Completed
2. **Current Focus**: `> No active task. Next up: Task #YYY`
3. **Backlog Table**: Remove completed task row
4. **Recently Completed**: Add row

### 8. Suggest Next Task

```
Completed task #XXX: [title]
Learnings transferred: N items

## Next Tasks (by priority)
| # | Task | Priority |
|---|------|----------|
| 004 | Next task | P2 - Next |

Use /start-task 004 to begin next task
```
