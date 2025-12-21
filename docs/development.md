# Development Guide

## Commands

```bash
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
pnpm test       # Run tests
```

## Workflow

### Plan-Based Development

1. `plan/main.md` contains the master plan with all pending steps
2. Each step has its own file: `plan/step-XX-description.md`
3. Before starting: Mark step as "in progress" in `main.md`
4. After completing: Delete the step file and mark as done in `main.md`

### Backlog

`backlog/` contains future ideas not yet integrated into the main plan:
- `step-*.md`: Future enrichment steps
- `service-*.md`: Backend service proposals

## Scripts

Data processing scripts live in `scripts/`. Run with:

```bash
node scripts/script-name.js
```

### Available Scripts

| Script | Purpose | Frequency |
|--------|---------|-----------|
| `add-certifications.js` | Update Blue Flag, Q Quality, Ecoplayas | Annual |
| `add-dog-friendly.js` | Update dog-friendly beaches list | Seasonal |
| `add-lifeguard-info.js` | Update COPLA lifeguard data | Seasonal |
| `add-occupancy-level.js` | Infer crowd levels from tags/certifications | As needed |
| `validate-beaches.js` | Validate all beach data | As needed |

## Cost Optimization

### Ollama for AI Tasks

Use Ollama instead of paid APIs for:
- Text generation
- Description writing
- Data extraction

Available models:
- `gemma3:4b`: General text tasks
- `llama3.2:latest`: Chat and general tasks
- `nomic-embed-text:latest`: Embeddings

### Script Output

For long-running scripts, return the command instead of running directly:

```bash
# Instead of streaming large outputs, suggest:
node scripts/add-certifications.js
```

This saves tokens by avoiding large output streams in the conversation.

## Testing

- **Unit tests**: Pure functions with Vitest
- **Component tests**: React components with Testing Library
- **E2E tests**: Critical flows with Playwright

Run tests:
```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report
```

## Code Style

- TypeScript strict mode
- ESLint with TanStack config
- Prettier with Tailwind plugin
- Functional approach (functions over classes)
- Named exports only (no default exports)

See the global `~/.claude/CLAUDE.md` for detailed code style guidelines.
