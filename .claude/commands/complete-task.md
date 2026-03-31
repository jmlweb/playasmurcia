---
argument-hint: [task number]
description: Complete a task, move to done, update INDEX
model: haiku
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

### 2. Verify Completion

Check all acceptance criteria:

```markdown
- [x] Criterion 1  -- OK
- [x] Criterion 2  -- OK
- [ ] Criterion 3  -- NOT CHECKED
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

### 3. Extract Learnings

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

### 4. Update Task File

```markdown
- **Status**: completed
- **Completed**: [today's date]
```

Add final Progress Log entry:
```markdown
- [YYYY-MM-DD HH:MM] Task completed
```

### 5. Move Task File

```bash
mv backlog/pending/XXX-task-name.md backlog/done/XXX-task-name.md
```

### 6. Update INDEX.md

1. **Quick Stats**: Decrement Pending/In Progress, increment Completed
2. **Current Focus**: `> No active task. Next up: Task #YYY`
3. **Backlog Table**: Remove completed task row
4. **Recently Completed**: Add row

### 7. Suggest Next Task

```
Completed task #XXX: [title]
Learnings transferred: N items

## Next Tasks (by priority)
| # | Task | Priority |
|---|------|----------|
| 004 | Next task | P2 - Next |

Use /start-task 004 to begin next task
```
