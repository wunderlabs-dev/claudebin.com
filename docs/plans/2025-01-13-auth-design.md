# Claudebin Authentication Design

**Date:** 13 January 2025
**Status:** Ready for implementation

## Overview

Device Authorization Flow for authenticating the Claude Code plugin with Claudebin. Similar to `gh auth login` - works in terminal environments without browser automation.

## Flow

```
1. User: /auth
2. MCP Server: POST /api/auth/start → { code, url }
3. Claude: "Visit this URL: https://claudebin.com/cli/auth?code=abc123"
4. User: Opens URL, clicks "Sign in with GitHub", completes OAuth
5. Browser: Shows "✓ Authenticated! Return to terminal"
6. MCP Server: Polls /api/auth/poll?code=abc123 until success
7. MCP Server: Saves token to ~/.claudebin/config.json
8. Claude: "You're now authenticated as @username"
```

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

OAuth page shown to user in browser.

**Before auth:** "Sign in with GitHub" button
**After auth:** "✓ Authenticated! Return to your terminal"

Completing OAuth associates the code with the authenticated user.

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

## Implementation Order

1. **Server-side** (requires web app):
   - Database table for auth codes
   - POST /api/auth/start endpoint
   - GET /api/auth/poll endpoint
   - GET /cli/auth page with GitHub OAuth

2. **MCP server**:
   - Add `authenticate` tool
   - Add `whoami` tool
   - Add `logout` tool
   - Config file read/write helpers

3. **Slash commands**:
   - `/auth` command
   - `/whoami` command (optional)
