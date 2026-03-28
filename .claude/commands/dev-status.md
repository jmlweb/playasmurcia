---
argument-hint:
description: Show current development status from INDEX.md
model: haiku
---

# Dev Status

Display current development status, active task, and backlog overview.

## Usage

- `/dev-status` - Show full status

## Workflow

### 1. Read State

Read `backlog/INDEX.md` and parse all sections.
Also count files in `backlog/pending/` and `backlog/done/`.

### 2. Display Status

```
## PlayasMurcia - Development Status

### Quick Stats
| Metric | Count |
|--------|-------|
| Pending | 5 |
| In Progress | 1 |
| Completed | 3 |
| Blocked | 0 |

### Current Focus
> Task #004: Turso cloud setup
  Status: in_progress | Slice: Infra | Started: 2026-03-20

### Backlog (by priority)
| # | Task | Slice | Priority |
|---|------|-------|----------|
| 004 | Turso cloud setup | Infra | P1 - Active |
| 005 | Beach filters | Frontend | P2 - Next |
| 006 | SEO improvements | SEO | P3 |

### Recent Activity
- [2026-03-20] Started #004
- [2026-03-19] Completed #003

### Quick Actions
- /start-task 005 - Start next task
- /check-task     - Verify active task
- /add-task       - Add new task
```

## Warnings

### Blocked Tasks
```
Blocked Tasks:
- #003: Waiting for API credentials
```

### Stale Tasks (in_progress > 3 days)
```
Stale: Task #004 in_progress since 2026-03-17 (5 days)
Consider: /check-task 004 or /block-task 004
```

### Priority Imbalance (> 3 P2 tasks)
```
Note: 4 tasks marked P2 - consider promoting one to P1
```

## Health Indicators

```
## Project Health
- INDEX.md: valid
- LEARNINGS.md: exists
- Backlog: N tasks
- Completed: M tasks
- Learnings documented: L items
```
