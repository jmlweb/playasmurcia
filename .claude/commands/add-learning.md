---
argument-hint: [learning description]
description: Document a learning or insight discovered during development
model: haiku
---

# Add Learning

Document an insight or discovery made during development.

## Usage

- `/add-learning "Turso needs specific libsql driver"` - Quick add
- `/add-learning` - Interactive mode

## Workflow

### 1. Gather Information

If not provided as argument, ask:

1. **What did you learn?** (brief title)
2. **Context**: What were you doing when you discovered this?
3. **Details**: Why is this important? What would you do differently?
4. **Category**: Database & Data / Frontend & UI / Infrastructure & Deploy / SEO & Performance / General

### 2. Link to Active Task

Read `docs/dev/INDEX.md` Current Focus:
- If a task is active, link the learning to it
- Also add to the task's "Learnings" section

### 3. Determine Learning ID

Read `docs/dev/LEARNINGS.md`, find highest LXXX number, increment.

### 4. Add to LEARNINGS.md

Append under the appropriate category:

```markdown
### LXXX: Brief title
**Date**: YYYY-MM-DD | **Task**: #XXX Task title (or "General")
**Context**: What was being attempted
**Learning**: What was discovered
**Action**: How it was applied or should be applied
```

### 5. Add to Task File (if active)

If linked to a task, add to its Learnings section:
```markdown
## Learnings
- LXXX: Brief description (see LEARNINGS.md)
```

### 6. Confirm

```
Added learning LXXX: [title]
Category: [category]
Linked to: Task #XXX (or "No active task")
```
