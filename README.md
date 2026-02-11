# Claudebin

**Pastebin for vibes** - Share your Claude Code sessions with teammates.

## Quick Start

### Option 1: MCP Plugin (Recommended)

Add the plugin to your Claude Code configuration:

```bash
claude mcp add claudebin -- npx -y claudebin-mcp
```

Then during any session, use:

```
/share
```

The plugin will:
1. Authenticate via GitHub (first time only)
2. Extract your current session
3. Upload and return a shareable URL

### Option 2: CLI

```bash
npx claudebin publish
```

## Repository Structure

This repository contains the **web application** only. The MCP plugin and CLI are in a separate repository:

- **Web App** (this repo): [github.com/wunderlabs-dev/claudebin.com](https://github.com/wunderlabs-dev/claudebin.com)
- **Plugin/CLI**: [github.com/wunderlabs-dev/claudebin](https://github.com/wunderlabs-dev/claudebin)

```
claudebin.com/
├── app/              # Next.js 16 web application
│   └── src/
│       ├── app/      # Pages and API routes
│       ├── components/
│       ├── containers/
│       ├── server/   # Backend logic (actions, repos, services)
│       └── context/
└── supabase/         # Database migrations
```

## Architecture

### Web Frontend

Next.js 16 App Router with Turbopack. Key pages:

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured threads |
| `/threads` | Browse all public threads |
| `/threads/[id]` | View a published session |
| `/threads/[id]/embed` | Embeddable version |
| `/profile/[username]` | User profile with their threads |
| `/auth/login` | GitHub OAuth login |
| `/cli/auth` | CLI authentication flow |

### API Endpoints

OpenAPI spec available at `/api/openapi.json`.

**Authentication:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/start` | POST | Start CLI auth flow, returns session token |
| `/api/auth/poll` | GET | Poll for auth completion |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/validate` | GET | Validate access token |

**Sessions:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sessions/publish` | POST | Publish a Claude Code session |
| `/api/sessions/poll` | GET | Poll for processing status |
| `/api/threads/[id]/messages` | GET | Get thread messages |
| `/api/threads/[id]/md` | GET | Get thread as markdown |

### Backend

Server-side logic organized into layers:

- **`server/actions/`** - Server actions for data mutations (likes, visibility, account)
- **`server/repos/`** - Data access layer for Supabase queries
- **`server/services/`** - Business logic (session parsing, processing)
- **`server/api/`** - OpenAPI schemas and spec generation

**Session Processing Pipeline:**
1. CLI/Plugin uploads JSONL conversation data
2. API stores raw file in Supabase Storage
3. Background processor parses JSONL into normalized messages
4. Auto-generates title using LLM (OpenRouter)
5. Updates session status to `ready`

### Database (Supabase)

PostgreSQL with Row Level Security (RLS).

**Tables:**

| Table | Description |
|-------|-------------|
| `profiles` | User data synced from auth.users (id, email, name, avatar_url, username) |
| `sessions` | Published threads (id, user_id, title, is_public, status, view_count, like_count) |
| `messages` | Parsed conversation messages (session_id, idx, role, content, tool_names) |
| `session_likes` | User likes on sessions |
| `cli_auth_sessions` | Temporary tokens for CLI OAuth flow |

**Key Features:**
- Auto-profile creation on signup via trigger
- Denormalized like/view counts with triggers
- Full-text search on message content
- RLS policies for public/private access

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build
bun run build

# Lint & format
bun check
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenRouter (for title generation)
OPENROUTER_API_KEY=
```

## Tech Stack

- **Framework**: Next.js 16, Turbopack
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with GitHub OAuth
- **Styling**: Tailwind CSS, shadcn/ui
- **Tooling**: Bun, Biome
