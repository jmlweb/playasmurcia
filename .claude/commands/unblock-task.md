---
argument-hint: [task number]
description: Unblock a task and optionally start it
model: haiku
---

# Unblock Task

Resolve a blocker on a task, update its status, and optionally start it.

## Usage

- `/unblock-task 003` - Unblock task #003
- `/unblock-task 003 "Turso credentials received"` - Unblock with resolution note
- `/unblock-task` - Show blocked tasks and ask which to unblock

## Workflow

### 1. Identify Task

If task number provided:

- Check `backlog/pending/XXX-*.md` exists
- Verify status is `blocked`

If no task number:

- Read `backlog/INDEX.md`
- List all blocked tasks
- If none: "No blocked tasks found."
- If one: confirm unblocking it
- If multiple: ask user which to unblock

### 2. Get Resolution

If not provided as argument, ask:

```
How was the blocker resolved?
1. Dependency task completed
2. External input received
3. Technical workaround found
4. Requirements clarified
5. Other (describe)
```

### 3. Update Task File

In `backlog/pending/XXX-*.md`:

```markdown
## Metadata

- **Status**: pending
- **Priority**: P2 (or original priority before blocking)
- **Blocked by**: -
```

Add to Progress Log:

```markdown
- [YYYY-MM-DD HH:MM] Unblocked: [resolution description]
```

### 4. Update INDEX.md

1. **Quick Stats**: Decrement "Blocked", increment "Pending"
2. **Backlog Table**: Remove "BLOCKED" marker, restore priority label

### 5. Offer Next Steps

```
Task #XXX is now unblocked: [title]
Resolution: [resolution]

Options:
1. Start working on it now (/start-task XXX)
2. Leave in backlog as pending
```

If user chooses to start, execute `/start-task` logic.

## Validation

- Task must exist in `backlog/pending/`
- Task must be in `blocked` status
- If task is not blocked: "Task #XXX is not blocked (status: [status])"
