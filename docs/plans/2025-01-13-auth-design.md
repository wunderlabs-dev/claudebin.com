# Claudebin Authentication Design

**Date:** 13 January 2025
**Status:** Ready for implementation

## Overview

Device Authorization Flow for authenticating the Claude Code plugin with Claudebin. Claudebin.com is the auth provider - sign-in methods (GitHub, Google, etc.) are just connectors to create/access user accounts.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              claudebin.com                       │
│           (the auth provider)                    │
│                                                  │
│  ┌─────────────┐    ┌─────────────────────────┐ │
│  │ User Entity │◄───│ GitHub/Google/Email/etc │ │
│  │ (profiles)  │    │ (sign-in methods)       │ │
│  └──────┬──────┘    └─────────────────────────┘ │
│         │                                        │
│         ▼                                        │
│  ┌─────────────┐                                │
│  │ Auth Tokens │ ◄── issued to plugin/CLI       │
│  └─────────────┘                                │
└─────────────────────────────────────────────────┘
          ▲
          │ authenticate via device flow
          │
    ┌─────┴─────┐
    │  Plugin   │
    │   CLI     │
    └───────────┘
```

**Claudebin.com owns:**
- User identity (profiles table)
- Authentication (issues Claudebin tokens)
- Sessions storage

**Sign-in methods are just connectors:**
- GitHub, Google, email/password, magic link, etc.
- User can add multiple over time
- Plugin doesn't know or care which was used

## Device Authorization Flow

```
1. User: /auth
2. MCP Server: POST /api/auth/start → { code, url }
3. Claude: "Visit this URL: https://claudebin.com/cli/auth?code=abc123"
4. User: Opens URL, signs in (any method)
5. Browser: Shows "✓ Authenticated! Return to terminal"
6. MCP Server: Polls /api/auth/poll?code=abc123 until success
7. MCP Server: Saves Claudebin token to ~/.claudebin/config.json
8. Claude: "You're now authenticated as @username"
```

The plugin receives a **Claudebin token**, not a GitHub/Google token. It has no knowledge of how the user signed in.

## MCP Tools

### authenticate

Initiates and completes the full auth flow.

**Input:** None

**Process:**
1. POST to `/api/auth/start` to get code and URL
2. Return URL to Claude (displayed to user)
3. Poll `/api/auth/poll?code=X` every 2 seconds (max 5 minutes)
4. On success, save token to `~/.claudebin/config.json`
5. Return result

**Output:**
```typescript
{ success: true, username: "vlad" }
// or
{ success: false, error: "Authentication timed out" }
```

### whoami

Check current authentication status.

**Input:** None

**Output:**
```typescript
{ authenticated: true, username: "vlad", avatar_url: "https://..." }
// or
{ authenticated: false }
```

### logout

Clear stored credentials.

**Input:** None

**Output:**
```typescript
{ success: true }
```

## Server Endpoints

### POST /api/auth/start

Generate a one-time authentication code.

**Response:**
```json
{
  "code": "abc123xyz...",
  "url": "https://claudebin.com/cli/auth?code=abc123xyz...",
  "expires_at": "2025-01-13T12:30:00Z"
}
```

### GET /api/auth/poll?code=X

Check if code has been authenticated.

**Response (pending):**
```json
{ "status": "pending" }
```

**Response (success):**
```json
{
  "status": "success",
  "token": "eyJhbG...",
  "user": {
    "id": "uuid",
    "username": "vlad",
    "avatar_url": "https://..."
  }
}
```

**Response (expired):**
```json
{ "status": "expired" }
```

### GET /cli/auth?code=X

Auth page shown to user in browser.

**Before auth:** Sign-in options (whatever claudebin.com supports)
**After auth:** "✓ Authenticated! Return to your terminal"

Completing sign-in associates the code with the user's Claudebin account.

## Slash Commands

### /auth

```markdown
<instructions>
Call the authenticate tool to start the authentication flow.
Display the URL returned and wait for the result.
</instructions>

<output>
If successful: "You're now authenticated as @{username}"
If failed: Display the error message
</output>
```

### /whoami (optional)

```markdown
<instructions>
Call the whoami tool to check authentication status.
</instructions>

<output>
If authenticated: "Signed in as @{username}"
If not: "Not authenticated. Run /auth to sign in."
</output>
```

## Config File

**Location:** `~/.claudebin/config.json`

**Structure:**
```json
{
  "auth": {
    "token": "eyJhbG...",
    "expires_at": 1702345678
  },
  "user": {
    "id": "uuid",
    "username": "vlad",
    "avatar_url": "https://..."
  }
}
```

Shared between CLI and plugin.

## Security

- Codes expire after 10 minutes
- Codes are 21 characters (nanoid) - collision/guess resistant
- Polling rate-limited to 1 request/second
- HTTPS only
- Config file created with 0600 permissions
- Tokens are Claudebin-issued JWTs, not third-party tokens

## Implementation Order

1. **Server-side** (requires web app):
   - Database table for auth codes (cli_auth_sessions exists)
   - POST /api/auth/start endpoint
   - GET /api/auth/poll endpoint
   - GET /cli/auth page with sign-in (uses Supabase Auth)

2. **MCP server** (done):
   - `authenticate` tool
   - `whoami` tool
   - `logout` tool
   - Config file read/write helpers

3. **Slash commands** (done):
   - `/auth` command
   - `/whoami` command
