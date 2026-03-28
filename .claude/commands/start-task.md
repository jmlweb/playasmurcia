---
argument-hint: [task number]
description: Mark a task as in-progress and set as current focus
model: haiku
---

# Start Task

Mark a task as in-progress, update INDEX.md, and prepare for work.

## Usage

- `/start-task 003` - Start task #003
- `/start-task` - Show pending tasks and ask which to start

## Workflow

### 1. Validate

If task number provided:
- Check `docs/dev/backlog/XXX-*.md` exists
- Verify status is `pending` (not in_progress or blocked)

If no task number:
- Read `docs/dev/INDEX.md`
- Show pending tasks with priorities
- Ask user which to start

### 2. Check for Active Task

Read `docs/dev/INDEX.md` Current Focus section:
- If another task is in_progress, warn user
- Ask: "Task #YYY is currently active. Switch to #XXX?"
- Only one task can be in_progress at a time

### 3. Update Task File

In `docs/dev/backlog/XXX-*.md`:

```markdown
## Metadata
- **Status**: in_progress
- **Priority**: P1 - Active
- **Started**: [today's date]
```

Add to Progress Log:
```markdown
## Progress Log
- [YYYY-MM-DD HH:MM] Started task
```

### 4. Update INDEX.md

1. **Quick Stats**: Decrement "Pending", set "In Progress" to 1
2. **Current Focus**: `> Task #XXX: [task title]`
3. **Backlog Table**: Update priority to `P1 - Active`

### 5. Show Task Summary

```
Started task #XXX: [title]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Files to Modify
- src/file1.ts

Remember:
- Update progress in task file as you work
- /add-learning when you discover something important
- /complete-task when all criteria are met
```

## Validation

- Task must exist in `docs/dev/backlog/`
- Task must be pending (not blocked or already active)
- Only one active task at a time
- Blocked tasks cannot start — show blocker info
