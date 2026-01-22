# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claudebin is a "pastebin for vibes" - a tool for publishing and sharing Claude Code sessions. Users run `npx claudebin publish` after a coding session to get a shareable link.

## Commands

```bash
# Development
bun cli               # Start CLI in watch mode
bun dev               # Start web app in dev mode
bun plugin            # Start MCP server in watch mode

# Build
bun build             # Build all packages

# Code Quality
bun check             # Biome check (runs on pre-commit)
bun format            # Biome format
bun lint              # Biome lint
bun type-check        # TypeScript check all packages

# Package-specific
bun --filter cli build       # Build CLI only
bun --filter cli type-check  # Type-check CLI only
bun --filter web dev         # Run Next.js dev server

# Plugin (local development)
claude --plugin-dir ./packages/plugin   # Start with plugin loaded
```

## Architecture

**Monorepo Structure (bun workspaces):**
- `packages/cli/` - Publishable npm package (`claudebin`), built with tsup
- `packages/web/` - Next.js 15 web app (App Router)
- `docs/` - Architecture documentation
- `supabase/` - Database migrations

**CLI Package:**
- Entry: `src/index.ts` (Commander.js)
- Commands: `src/commands/` (publish, list, whoami)
- Core logic: `src/lib/` (session discovery, user management, Supabase client)
- Utilities: `src/helpers/` (constants, utils, status codes)

**Web Package (`packages/web/src/`):**
```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
│   └── ui/       # shadcn/ui components
├── sections/     # Page-level section components
├── utils/        # Utilities, constants, helpers
├── copy/         # i18n translations (en-EN.json)
├── i18n/         # i18n config
└── static/       # CSS, fonts
```

**Key Libraries:**
- CLI: Commander.js, chalk, ora, @clack/prompts
- Web: next-intl, shadcn/ui (Base UI), Tailwind CSS
- Data: @supabase/supabase-js, ramda
- Build: tsup (CLI), Next.js (web)

## Code Conventions

### Arrow Functions

**ALWAYS use arrow functions** over function declarations:
```typescript
// GOOD
const myFunction = () => { };
const asyncFunction = async () => { };

// BAD
function myFunction() { }
```

### Biome Configuration

- Double quotes, 2-space indent, semicolons required
- 80-char line width
- Organize imports on save

### Component Structure

Components are single files using kebab-case naming (no directories):

```
components/
├── home-intro.tsx
├── home-tutorials.tsx
├── ui/           # shadcn/ui components
└── icon/         # Icon components
```

### Type Patterns

Use `as const` for variant unions:

```typescript
export const ButtonVariants = ["default", "transparent"] as const;
export type ButtonVariant = (typeof ButtonVariants)[number];
export type ButtonVariantMapping = Record<ButtonVariant, string>;
```

Use discriminated unions when variant affects required props:

```typescript
type ChipDefaultProps = ChipBaseProps & {
  variant?: "default";
  color: ChipColor;
};
type ChipOutlinedProps = ChipBaseProps & { variant: "outlined"; color?: never };
export type ChipProps = ChipDefaultProps | ChipOutlinedProps;
```

### Styling

Use Tailwind with variant mapping objects:

```typescript
const buttonVariantClassNames: ButtonVariantMapping = {
  transparent: "cursor-pointer",
  default: "cursor-pointer rounded-sm px-2 py-1 text-gray-600 hover:bg-blue-500"
};

// Use cn() for class merging
className={cn("base-classes", buttonVariantClassNames[variant])}
```

### Naming Conventions

- **Files**: kebab-case for components (`home-intro.tsx`), camelCase for utils (`helpers.ts`)
- **Types**: `ComponentNameProps`, `ComponentNameVariant`, `ComponentNameVariantMapping`
- **Mapping objects**: `xxxClassNames` (e.g., `buttonVariantClassNames`)
- **Const arrays**: Plural form (`ButtonVariants`)

### Import Order

1. React/Next.js imports
2. External libraries
3. Type imports from `@/`
4. Components/sections from `@/`
5. Utils/helpers from `@/`

Always use `@/*` path alias.

### Exports

Components export directly from their file:

```typescript
// home-intro.tsx
export const HomeIntro = () => { ... };
```

### Props

- Spread native HTML attributes: `& HTMLAttributes<HTMLElement>`
- Set defaults in parameters: `variant = "default"`
- Keep props minimal with sensible defaults

### Comments

Use `// ABOUTME:` prefix for explanation comments on complex patterns.

### Animations

Define animations in `/src/utils/keyframes.ts` and reuse across components.

### i18n

Use `next-intl` with translations in `/src/copy/en-EN.json`.

Rich text renderers are defined inline:

```typescript
{t.rich("error404.doesNotExist", {
  serif: (chunks: ReactNode) => (
    <span className="font-serif italic text-blue-500">{chunks}</span>
  ),
})}
```

Translation strings use XML-like tags matching renderer keys:

```json
{
  "error404.doesNotExist": "The page does <serif>not exist</serif>."
}
```

## Session Discovery

Sessions are read from `~/.claude/projects/[normalized-path]/` where the path is normalized by replacing `/` with `-`. Only sessions modified in the last hour are considered. Agent sessions (prefixed `agent-`) are filtered out.

## Configuration

User config is stored at `~/.claudebin/config.json` containing auth token and user info.

## Plugin Commands

When running with `--plugin-dir ./packages/plugin`:
- `/share` - Publish current session to claudebin.com and get shareable URL
- `/auth` - Authenticate with Claudebin via GitHub
- `/whoami` - Check current authentication status
- `/logout` - Clear saved credentials

## Commit Convention

Follow conventional commits: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`, `perf`
