# Plan Directory Rules

This directory stores the different stages to execute a plan.

## Structure

- `main.md`: Index file containing the ordered list of steps to execute
- `step-*.md`: Individual step files with details and progress

## Workflow

### Index Management (`main.md`)

The index must contain:
- Ordered list of steps with their filenames
- Current status indicator for each step

Example format:
```markdown
# Plan: [Plan Name]

## Steps

1. [x] ~~step-01-setup.md~~ (completed)
2. [ ] step-02-implementation.md (in progress)
3. [ ] step-03-testing.md (pending)
```

### Step Execution Rules

1. **Before starting a step**: Mark it as "in progress" in `main.md`
2. **While working on a step**: Update the corresponding step file with progress notes
3. **After completing a step**:
   - Delete the step file to save context space
   - Update `main.md` marking the step as completed (strikethrough)
   - Create a descriptive commit following Conventional Commits format

> **Note**: Deleting completed step files is mandatory. This keeps the plan directory clean and reduces context consumption when reading the codebase.

### File Synchronization

- When adding a new step file: Add corresponding entry to `main.md`
- When removing a step file: Update `main.md` accordingly
- Keep `main.md` always in sync with existing step files

### Index Renumbering

When all pending steps in the current plan are completed, renumber `main.md` to eliminate gaps in the sequence. This keeps the index clean and readable for the next planning cycle.

## Backlog

Unprioritized ideas and tasks are stored in `docs/dev/backlog/`. When a task is prioritized, move it to `plan/` and add the `step-XX-` prefix according to its execution order.

## Efficiency Principles

When designing a plan, always choose the most efficient approach:

1. **Minimize data duplication**: If a value depends on another entity (e.g., `jellyfishRisk` depends on `sea`), store it in the parent entity instead of duplicating across all children

2. **Pregenerate static data**: If a value can be calculated once and doesn't change over time, store it in JSON files instead of computing it in a runtime service
   - Good: Store `orientation` in `beaches.json` (calculated once from coordinates)
   - Bad: Calculate orientation on every API request

3. **Optimize storage location**: Place data at the appropriate level
   - Per-sea data → `seas.json`
   - Per-municipality data → `municipalities.json`
   - Per-beach data → `beaches.json`
