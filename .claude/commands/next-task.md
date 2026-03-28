---
argument-hint:
description: Suggest and optionally start the next priority task
model: haiku
---

# Next Task

Analyze backlog and suggest the best next task to work on.

## Usage

- `/next-task` - Analyze and suggest

## Workflow

### 1. Check Current State

Read `docs/dev/INDEX.md`:
- Is there an active task?
- What are the pending tasks?
- What are the blocked tasks?

### 2. If Active Task Exists

```
Active Task: #004 in progress.

Options:
1. Continue with #004 (/check-task 004)
2. Complete #004 first (/complete-task)
3. Block #004 and switch (/block-task 004)
```

### 3. Score Candidates

For each pending (non-blocked) task:

| Factor | Weight | Criteria |
|--------|--------|----------|
| Priority | High | P2 > P3 > P4 |
| Dependencies | High | No blockers > has blockers |
| Unblocks others | Medium | Enables more tasks |
| Slice continuity | Low | Same slice as last completed |

### 4. Present Recommendation

```
## Next Task Recommendation

### Top Pick: Task #005
**Beach filter sidebar** (Frontend, P2)

Why: Highest priority, no blockers, unblocks #007

### Alternatives
| # | Task | Priority | Notes |
|---|------|----------|-------|
| 006 | SEO improvements | P3 | Quick win |

Start task #005? (yes/no/other)
```

### 5. Handle Response

- **yes**: Execute `/start-task` logic
- **no**: "OK, use /start-task XXX when ready"
- **number**: Start that task instead

## Edge Cases

### All Tasks Blocked
Show blockers, suggest resolving or adding new unblocked tasks.

### No Pending Tasks
Suggest `/add-task` to create new work.

### Many P2 Tasks
Recommend picking ONE as P1 - Active.
