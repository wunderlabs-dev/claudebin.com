<p align="center">
  <img src=".github/logo.svg" alt="Claudebin" width="360" />
</p>

<p align="center">
  Share your Claude Code sessions with teammates.
</p>

<p align="center">
  <a href="https://claudebin.com">Website</a> &middot;
  <a href="https://github.com/wunderlabs-dev/claudebin">Plugin</a> &middot;
  <a href="#getting-started">Getting Started</a>
</p>

<br />

---

> **Web App** (this repo) &mdash; the Next.js frontend and API at [claudebin.com](https://claudebin.com)
> **Plugin** &mdash; the Claude Code plugin at [github.com/wunderlabs-dev/claudebin](https://github.com/wunderlabs-dev/claudebin)

## Getting Started

```bash
bun install    # Install dependencies
bun dev        # Start dev server
bun build      # Build for production
bun check      # Lint & format
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=             # For title generation
```

### Local Development with the Plugin

1. Start the web app: `bun dev` (runs on port 3000)
2. Build the plugin:
   ```bash
   cd /path/to/claudebin/mcp && bun install && bun run build
   ```
3. Run Claude with the local plugin:
   ```bash
   CLAUDEBIN_API_URL=http://localhost:3000 claude --plugin-dir /path/to/claudebin --dangerously-skip-permissions
   ```

## Architecture

```
claudebin.com/
├── app/                  # Next.js 16 web application
│   └── src/
│       ├── app/          # Pages and API routes
│       ├── components/   # UI components
│       ├── containers/   # Page containers
│       ├── server/       # Backend logic
│       │   ├── actions/  # Server actions (mutations)
│       │   ├── repos/    # Data access (Supabase)
│       │   ├── services/ # Business logic
│       │   └── api/      # OpenAPI schemas
│       └── context/      # React context providers
└── supabase/             # Database migrations
```

### Routes

| Route | Description |
|---|---|
| `/` | Homepage with featured threads |
| `/threads` | Browse public threads |
| `/threads/[id]` | View a session |
| `/threads/[id]/embed` | Embeddable version |
| `/profile/[username]` | User profile |
| `/auth/login` | GitHub OAuth |

### API

OpenAPI spec at `/api/openapi.json`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/start` | `POST` | Start CLI auth flow |
| `/api/auth/poll` | `GET` | Poll for auth completion |
| `/api/auth/refresh` | `POST` | Refresh access token |
| `/api/auth/validate` | `GET` | Validate access token |
| `/api/sessions/publish` | `POST` | Publish a session |
| `/api/sessions/poll` | `GET` | Poll processing status |
| `/api/threads/[id]/messages` | `GET` | Get thread messages |
| `/api/threads/[id]/md` | `GET` | Get thread as markdown |

### Session Processing Pipeline

```
Plugin uploads JSONL ─→ Store in Supabase Storage ─→ Parse into messages ─→ Generate title (LLM) ─→ Ready
```

### Database

PostgreSQL with Row Level Security. Auto-profile creation on signup, denormalized counts via triggers, and full-text search on message content.

| Table | Description |
|---|---|
| `profiles` | User data synced from `auth.users` |
| `sessions` | Published threads with view/like counts |
| `messages` | Parsed conversation messages |
| `session_likes` | User likes |
| `cli_auth_sessions` | Temporary CLI OAuth tokens |

## Tech Stack

|---|---|
| **Framework** | Next.js 16, Turbopack |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth, GitHub OAuth |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Tooling** | Bun, Biome |

## License

MIT
