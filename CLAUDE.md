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

**Key Libraries:**
- CLI: Commander.js, chalk, ora, @clack/prompts
- Data: @supabase/supabase-js, ramda
- Build: tsup (CLI), Next.js (web)

## Code Style

**ALWAYS use arrow functions** over function declarations:
```typescript
// GOOD
const myFunction = () => { };
const asyncFunction = async () => { };

// BAD
function myFunction() { }
```

**Biome Configuration:**
- Double quotes, 2-space indent, semicolons required
- 80-char line width
- Organize imports on save

## Session Discovery

Sessions are read from `~/.claude/projects/[normalized-path]/` where the path is normalized by replacing `/` with `-`. Only sessions modified in the last hour are considered. Agent sessions (prefixed `agent-`) are filtered out.

## Configuration

User config is stored at `~/.claudebin/config.json` containing auth token and user info.
