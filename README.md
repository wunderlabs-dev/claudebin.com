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

## Features

- **One-command sharing** - Share sessions without leaving Claude Code
- **GitHub authentication** - Secure OAuth flow
- **Auto-refresh tokens** - Stay authenticated across sessions
- **Session processing** - Conversations are parsed and formatted for readability

## Architecture

```
app/              # Next.js 16 web app (claudebin.com)
docs/             # Documentation
supabase/         # Database migrations
```

The MCP plugin and CLI are published separately at [claudebin](https://github.com/wunderlabs-dev/claudebin).

## Development

```bash
# Install dependencies
bun install

# Start web app
bun dev

# Build
bun run build

# Lint & format
bun check
```

## Tech Stack

- **Web**: Next.js 16, Turbopack, Supabase
- **Tooling**: Bun, Biome
