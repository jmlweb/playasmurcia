---
argument-hint: [task number] [reason]
description: Mark a task as blocked with reason
model: haiku
---

# Block Task

Mark a task as blocked, document the reason, and suggest alternatives.

## Usage

- `/block-task 003 "waiting for Turso setup"` - Block with reason
- `/block-task 003` - Block, ask for reason
- `/block-task` - Block active task, ask for reason

## Workflow

### 1. Identify Task

If no task number: use current active task from INDEX.md.
If no active task: show error.

### 2. Get Block Reason

If not provided, ask. Suggest common reasons:
- Waiting for dependency task #XXX
- Waiting for external input / API access
- Technical blocker discovered
- Need clarification on requirements

### 3. Categorize Blocker

| Type | Example | Action |
|------|---------|--------|
| Task dependency | "needs #002 first" | Link to blocking task |
| External | "waiting for Turso credentials" | Document in notes |
| Technical | "memory limit issue" | May need learning |
| Clarification | "unclear requirements" | Tag for user input |

### 4. Update Task File

```markdown
- **Status**: blocked
- **Priority**: P3  (demote from P1 if was active)
- **Blocked by**: #002 | "external: description" | "clarification needed"
```

Add to Progress Log:
```markdown
- [YYYY-MM-DD HH:MM] Blocked: [reason]
```

### 5. Update INDEX.md

1. Adjust Quick Stats (In Progress → 0 if was active, increment Blocked)
2. Clear Current Focus if was active
3. Mark as BLOCKED in Backlog table

### 6. Suggest Alternatives

```
Task #XXX is now blocked
Reason: [reason]

## Available Tasks (unblocked)
| # | Task | Priority |
|---|------|----------|
| 004 | Alternative task | P2 |

Use /start-task 004 to work on an alternative
```

### 7. If Technical Blocker

Prompt:
```
This appears to be a technical blocker. Would you like to:
1. Add a learning about this issue (/add-learning)
2. Create a new task to resolve the blocker
3. Continue without documenting
```

## Unblocking

When a blocker is resolved:
1. Change status back to `pending`
2. Update "Blocked by" field
3. Add Progress Log entry: "Unblocked: [resolution]"
4. Use `/start-task` to resume
