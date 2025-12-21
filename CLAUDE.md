# Project Rules

## Documentation

Project documentation is in `docs/`:

- [Architecture](./docs/architecture.md) - Tech stack and project structure
- [Data Schema](./docs/data-schema.md) - Data files and validation rules
- [Business Rules](./docs/business-rules.md) - Data processing logic
- [Development](./docs/development.md) - Commands and workflow

## Plan Management

See [plan/CLAUDE.md](./plan/CLAUDE.md) for rules on managing execution plans.

## Claude-Specific Rules

### Cost Optimization

For long-running processes (Ollama calls, batch operations, API requests), create a script in `scripts/` and return the command instead of running directly:

```bash
# Return this instead of running directly:
node scripts/generate-descriptions.js
```

### Data Editing

- Never manually edit generated fields (`description`, `accessInfo`)
- Run the appropriate script to regenerate
- See [data-schema.md](./docs/data-schema.md) for validation rules
