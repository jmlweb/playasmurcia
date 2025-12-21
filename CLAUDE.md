# Project Rules

## Project Structure

Keep this section updated as the project evolves.

```
playasmurcia/
├── data/           # JSON data files (beaches, municipalities, seas)
├── docs/           # Prior documentation with improvement ideas
├── plan/           # Execution plans extracted from docs/
├── scripts/        # Node.js scripts for data processing
├── CLAUDE.md       # Project rules (this file)
└── README.md       # Project overview
```

### Workflow

- `docs/` contains prior documentation with proposed improvements and ideas
- Steps from `docs/` are extracted into `plan/` as actionable execution plans
- See [plan/CLAUDE.md](./plan/CLAUDE.md) for rules on managing execution plans

## Cost Optimization

For long-running processes (Ollama calls, batch operations, API requests), create a script in `scripts/` and return the command to execute instead of running it directly. This saves tokens by avoiding streaming large outputs.

```bash
# Example: instead of running directly, return:
node scripts/generate-descriptions.js
```
