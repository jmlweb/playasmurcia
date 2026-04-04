---
argument-hint: [task number] [reason]
description: Remove a task from the backlog with documented reason
model: haiku
---

# Remove Task

Remove a task from the backlog entirely. This is for tasks that are no longer relevant, were created by mistake, or have been superseded.

## Usage

- `/remove-task 003 "superseded by #005"` - Remove with reason
- `/remove-task 003` - Remove, ask for reason
- `/remove-task` - Show pending tasks and ask which to remove

## Workflow

### 1. Identify Task

If task number provided:

- Check `backlog/pending/XXX-*.md` exists
- If not in pending, check `backlog/done/` and warn: "Task #XXX is already completed. Are you sure you want to remove it?"

If no task number:

- List pending tasks
- Ask which to remove

### 2. Get Reason

If not provided, ask. Suggest common reasons:

- Superseded by another task
- No longer relevant to project goals
- Created by mistake / duplicate
- Scope absorbed into another task
- Feature direction changed

### 3. Confirm Removal

**Always confirm before removing**:

```
Remove task #XXX: [title]?
Reason: [reason]

This will:
- Delete the task file
- Remove it from INDEX.md backlog table
- Document the removal in INDEX.md "Removed tasks" section

Type "yes" to confirm.
```

### 4. Remove Task File

```bash
rm backlog/pending/XXX-task-name.md
```

Or if removing from done:

```bash
rm backlog/done/XXX-task-name.md
```

### 5. Update INDEX.md

1. **Quick Stats**: Decrement "Pending" (or "Completed" if from done, or "Blocked" if was blocked)
2. **Backlog Table**: Remove the task row
3. **Current Focus**: Clear if this was the active task
4. **Removed tasks** section: Append removal note with reason and date

Format for Removed tasks section:

```markdown
Task #XXX ([title]) removed on YYYY-MM-DD — [reason].
```

### 6. Confirm

```
Removed task #XXX: [title]
Reason: [reason]
Documented in INDEX.md "Removed tasks" section.
```

## Safety

- **Active tasks**: If removing the current in-progress task, warn and require explicit confirmation
- **Tasks with dependencies**: If other tasks depend on this one (check "Blocked by" fields), warn about downstream impact
- **Never auto-remove**: Always require user confirmation
