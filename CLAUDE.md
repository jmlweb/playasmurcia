# Project Rules

## Project Structure

Keep this section updated as the project evolves.

```
playasmurcia/
├── src/                    # TanStack Start application source
│   ├── routes/             # File-based routing (TanStack Router)
│   │   ├── __root.tsx      # Root layout component
│   │   └── index.tsx       # Home page (/)
│   ├── router.tsx          # Router configuration
│   ├── styles.css          # Global styles (Tailwind CSS)
│   └── routeTree.gen.ts    # Auto-generated route tree (do not edit)
├── public/                 # Static assets
├── data/                   # JSON data files (beaches, municipalities, seas)
├── docs/                   # Prior documentation with improvement ideas
├── plan/                   # Execution plans extracted from docs/
├── scripts/                # Node.js scripts for data processing
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── prettier.config.js      # Prettier configuration
├── CLAUDE.md               # Project rules (this file)
└── README.md               # Project overview
```

## Tech Stack

- **Framework**: TanStack Start (full-stack React framework)
- **Router**: TanStack Router (file-based routing)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint with TanStack config
- **Formatting**: Prettier with Tailwind plugin
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm

## Development Commands

```bash
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
pnpm test       # Run tests
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
