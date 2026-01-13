# Claudebin Monorepo Structure

**Date:** 12 December 2025
**Status:** Initial Design

## Overview

Claudebin uses a pnpm workspace monorepo to manage three packages: CLI, web app, and shared code.

## Directory Structure

```
claudebin/
├── packages/
│   ├── cli/                    # CLI tool (npx claudebin)
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   └── publish.ts  # Main publish command
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts     # OAuth flow handling
│   │   │   │   ├── config.ts   # Config file management
│   │   │   │   └── supabase.ts # Supabase client
│   │   │   └── index.ts        # CLI entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                    # Next.js app (claudebin.link)
│   │   ├── app/
│   │   │   ├── @[username]/
│   │   │   │   └── [sessionId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── llms.txt/
│   │   │   │           └── route.ts
│   │   │   ├── cli/
│   │   │   │   └── auth/
│   │   │   │       └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── supabase.ts
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared types and utilities
│       ├── src/
│       │   ├── types/
│       │   │   ├── session.ts  # Session data types
│       │   │   └── user.ts     # User profile types
│       │   └── utils/
│       │       ├── session-parser.ts
│       │       └── markdown-converter.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                       # Architecture documentation
│   ├── 12-12-2025-architecture-overview.md
│   ├── 12-12-2025-database-schema.md
│   ├── 12-12-2025-cli-design.md
│   ├── 12-12-2025-web-app.md
│   ├── 12-12-2025-authentication.md
│   └── 12-12-2025-monorepo-structure.md
│
├── .github/
│   └── workflows/
│       ├── cli-publish.yml     # Publish CLI to npm
│       └── web-deploy.yml      # Deploy web to Vercel
│
├── pnpm-workspace.yaml
├── package.json                # Root package.json
├── .gitignore
└── README.md
```

## Package Configuration

### Root `package.json`

```json
{
  "name": "claudebin-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --recursive build",
    "cli": "pnpm --filter cli dev",
    "type-check": "pnpm --recursive type-check"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

### CLI Package (`packages/cli/package.json`)

```json
{
  "name": "claudebin",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "claudebin": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@clack/prompts": "^0.7.0",
    "@supabase/supabase-js": "^2.39.0",
    "chalk": "^5.3.0",
    "commander": "^11.1.0",
    "nanoid": "^5.0.4",
    "open": "^9.1.0",
    "ora": "^7.0.1",
    "claudebin-shared": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  }
}
```

### Web Package (`packages/web/package.json`)

```json
{
  "name": "claudebin-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/ssr": "^0.0.10",
    "@supabase/supabase-js": "^2.39.0",
    "date-fns": "^2.30.0",
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "shiki": "^0.14.5",
    "claudebin-shared": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0"
  }
}
```

### Shared Package (`packages/shared/package.json`)

```json
{
  "name": "claudebin-shared",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

## Shared Package Contents

### Types

**`packages/shared/src/types/session.ts`:**
```typescript
type ClaudeMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

type ClaudeSession = {
  messages: ClaudeMessage[];
  metadata?: {
    model?: string;
    timestamp?: number;
  };
};

type PublishedSession = {
  id: string;
  user_id: string;
  title: string | null;
  conversation_data: ClaudeSession;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
```

**`packages/shared/src/types/user.ts`:**
```typescript
type UserProfile = {
  id: string;
  username: string;
  github_id: number;
  avatar_url: string | null;
  created_at: string;
};
```

### Utilities

**`packages/shared/src/utils/session-parser.ts`:**
- Parse Claude history JSON
- Extract title from first user message
- Validate session structure

**`packages/shared/src/utils/markdown-converter.ts`:**
- Convert session JSONB to markdown
- Format for `/llms.txt` endpoint
- Handle code blocks, tool calls, etc.

## Workspace Commands

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run web app in development
pnpm dev

# Run CLI in development
pnpm cli

# Type check all packages
pnpm type-check

# Build only CLI
pnpm --filter cli build

# Build only web
pnpm --filter web build
```

## Package Dependencies

```
┌─────────┐     ┌─────────┐
│   CLI   │────▶│ Shared  │
└─────────┘     └─────────┘
                     ▲
                     │
┌─────────┐          │
│   Web   │──────────┘
└─────────┘
```

Both CLI and Web depend on Shared package for types and utilities.

## Build Order

1. **Shared** - Built first (others depend on it)
2. **CLI** - Can build in parallel with Web
3. **Web** - Can build in parallel with CLI

pnpm handles dependency ordering automatically.

## Publishing

### CLI to npm

- Package: `claudebin`
- Built artifacts in `packages/cli/dist/`
- Published via GitHub Actions on version tag
- Users install: `npx claudebin publish`

### Web to Vercel

- Deploy `packages/web/` directory
- Environment variables: Supabase credentials
- Auto-deploy on main branch push
- Custom domain: `claudebin.link`

## Development Workflow

1. Clone repository
2. Run `pnpm install` (installs all packages)
3. Run `pnpm build` (builds shared package)
4. Run `pnpm dev` for web development
5. Run `pnpm cli` for CLI development

## Environment Variables

### CLI
- Stored in `packages/cli/.env` (for development)
- Production: hardcoded Supabase URL (public)
- Anon key: hardcoded (public, RLS enforced)

### Web
- Stored in `packages/web/.env.local`
- Production: Vercel environment variables
- Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side admin operations)

## TypeScript Configuration

All packages share similar tsconfig with slight variations:

- **CLI:** `"module": "ESNext"`, `"target": "ES2022"`
- **Web:** Next.js default config
- **Shared:** `"declaration": true` for type generation

## Git Ignore

```
node_modules/
dist/
.next/
.env
.env.local
.DS_Store
*.log
```

## Future Considerations

- **Turborepo:** Could add for caching if build times become an issue
- **Shared Components:** If CLI gets a TUI, could share UI components
- **Migrations Package:** Database migrations could live in separate package
- **Testing Package:** Shared test utilities and fixtures
