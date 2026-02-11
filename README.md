# Claudebin

Share your Claude Code sessions with teammates.

## Repository Structure

This repository contains the **web application** (claudebin.com). The plugin is in a separate repository:

- **Web App** (this repo): [github.com/wunderlabs-dev/claudebin.com](https://github.com/wunderlabs-dev/claudebin.com)
- **Plugin**: [github.com/wunderlabs-dev/claudebin](https://github.com/wunderlabs-dev/claudebin)

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
1. Plugin uploads JSONL conversation data
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

### Running with the Plugin Locally

To test the full flow with a local plugin:

1. Start the web app: `bun dev` (runs on port 3000)
2. In the [plugin repo](https://github.com/wunderlabs-dev/claudebin), build the MCP server:
   ```bash
   cd mcp
   bun install
   bun run build
   ```
3. Run Claude with the local plugin pointing to local API:
   ```bash
   CLAUDEBIN_API_URL=http://localhost:3000 claude --plugin-dir /path/to/claudebin --dangerously-skip-permissions
   ```

## Tech Stack

- **Framework**: Next.js 16, Turbopack
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with GitHub OAuth
- **Styling**: Tailwind CSS, shadcn/ui
- **Tooling**: Bun, Biome

## License

MIT
