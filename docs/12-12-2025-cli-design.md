# Claudebin CLI Design

**Date:** 12 December 2025
**Status:** Initial Design

## Command Interface

```bash
npx claudebin publish [options]

Options:
  --public        Make session publicly accessible (default)
  --private       Make session private (only visible to you)
  --title <text>  Set custom session title
```

## Workflow

### First-Time Publish

1. **Locate Claude History**
   - Find Claude history JSON file (latest session)
   - Default location: `~/.claude/history/`
   - User can specify path if needed

2. **Check Authentication**
   - Read `~/.claudebin/config.json` for stored token
   - If not found or expired, initiate OAuth flow

3. **OAuth Flow** (if needed)
   - Generate one-time code
   - Open browser to `claudebin.link/cli/auth?code=xyz123`
   - User signs in with GitHub
   - CLI polls for completion or user pastes token
   - Save token to `~/.claudebin/config.json`

4. **Read & Parse Session**
   - Read Claude history JSON
   - Parse and validate structure
   - Extract title from first user message (or use --title flag)

5. **Generate Session ID**
   - Use nanoid to generate short ID (8-12 chars)
   - URL-safe characters only

6. **Upload to Supabase**
   - Insert into `sessions` table with:
     - Generated ID
     - User ID from config
     - Parsed conversation_data (JSONB)
     - Visibility flag (from --public/--private)
     - Title

7. **Return URL**
   - Print success message with shareable URL
   - Format: `claudebin.link/@username/session-id`

### Subsequent Publishes

Same workflow, but skip OAuth (token already stored).

## UI/UX

### Loading States

```bash
? Authenticate with GitHub? (opens browser) [Enter]
⠋ Publishing session...
✔ Published! https://claudebin.link/@marius/abc123xy
```

Uses:
- **@clack/prompts** for interactive prompts
- **ora** for spinners during upload
- **chalk** for colored output (green success, red errors)

### Error Messages

**Can't find Claude history:**
```
✖ Could not locate Claude history file
  Tried: ~/.claude/history/

  Specify path manually:
  npx claudebin publish --file /path/to/session.json
```

**Auth token expired:**
```
✖ Authentication expired
  Opening browser to re-authenticate...
```

**Network failure:**
```
✖ Failed to publish session
  Network error: Could not reach claudebin.link

  Retrying in 3 seconds... (attempt 2/3)
```

**Invalid JSON:**
```
✖ Failed to parse session file
  Invalid JSON at line 42

  Please check the file and try again.
```

## Configuration Storage

**Location:** `~/.claudebin/config.json`

**Structure:**
```json
{
  "auth": {
    "token": "eyJhbGc...",
    "refreshToken": "...",
    "expiresAt": 1702345678
  },
  "user": {
    "id": "uuid-here",
    "username": "marius",
    "avatarUrl": "https://github.com/..."
  }
}
```

**Usage:**
- `auth.token` - Sent with every Supabase request
- `auth.refreshToken` - Used to renew expired tokens
- `auth.expiresAt` - Unix timestamp, check before requests
- `user.*` - Displayed in CLI output, used for session creation

## Dependencies

- **commander** - CLI argument parsing
- **@clack/prompts** - Interactive prompts
- **ora** - Spinners and loading states
- **chalk** - Terminal colors
- **@supabase/supabase-js** - Database client
- **nanoid** - Session ID generation
- **open** - Open browser for OAuth

## Package.json

```json
{
  "name": "claudebin",
  "version": "0.1.0",
  "bin": {
    "claudebin": "./dist/index.js"
  },
  "type": "module"
}
```

Published to npm as `claudebin`, runnable via `npx claudebin`.

## Error Handling Priorities

1. **Clear messaging** - Tell user exactly what went wrong and how to fix it
2. **Retry logic** - Auto-retry transient network errors (with backoff)
3. **Graceful degradation** - Don't leave user in broken state
4. **No data loss** - Never delete local session file, even on upload failure
