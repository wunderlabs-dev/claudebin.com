# Claudebin Authentication Flow

**Date:** 12 December 2025
**Status:** Initial Design

## Overview

Claudebin uses GitHub OAuth via Supabase Auth for user authentication. Authentication is required to publish sessions.

## Authentication Methods

### CLI Authentication

**First-Time Flow:**

1. User runs `npx claudebin publish`
2. CLI checks `~/.claudebin/config.json` for existing token
3. If no token found:
   - Generate one-time authentication code
   - Open browser to `claudebin.link/cli/auth?code=xyz123`
   - User sees "Sign in with GitHub" on web page
4. User authenticates with GitHub (handled by Supabase Auth)
5. Web app receives OAuth callback
6. If first-time user:
   - Extract username from GitHub profile
   - Check for username collision
   - If collision, append number: `marius` → `marius2`
   - Create profile record in `profiles` table
7. Generate CLI access token (Supabase JWT)
8. Web page displays: "Authenticated! Return to your terminal."
9. CLI polls Supabase for authentication status using one-time code
10. On success, CLI receives:
    - Access token
    - Refresh token
    - User info (ID, username, avatar)
11. CLI saves to `~/.claudebin/config.json`

**Subsequent Uses:**

1. CLI reads token from config file
2. Checks expiration timestamp
3. If expired, refreshes using refresh token
4. Makes authenticated request to Supabase
5. If refresh fails, restart OAuth flow

### Web Authentication

**Browser Sessions:**

1. User visits claudebin.link and clicks "Sign in with GitHub"
2. Supabase Auth handles GitHub OAuth redirect
3. On callback, create profile if first-time user
4. Set session cookie (managed by Supabase)
5. User can view their own private sessions

## Token Storage

### CLI Config File

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

**Security:**
- File permissions: 600 (readable only by owner)
- Tokens are user-specific, can't be used to impersonate others
- RLS policies prevent unauthorized access

### Web Session

- Standard Supabase session cookies
- HTTP-only, secure flags set
- Auto-refresh handled by Supabase client

## Profile Creation

**GitHub Data Extraction:**
- Username: `github.login`
- GitHub ID: `github.id`
- Avatar URL: `github.avatar_url`

**Username Collision Handling:**
1. Try original GitHub username
2. If taken, append incrementing number
3. Check again until unique found
4. Store in `profiles.username`

**Example:**
- User 1: `marius` → stored as `marius`
- User 2: `marius` → stored as `marius2`
- User 3: `marius` → stored as `marius3`

## Authorization

### Session Publishing (CLI)

- User must be authenticated (valid token)
- Can only create sessions under their own user_id
- RLS policy enforces: `user_id` must match authenticated user

### Session Viewing (Web)

- **Public sessions:** Accessible to everyone (anonymous or authenticated)
- **Private sessions:** Only accessible to owner
  - Server-side check: `is_public = false AND user_id = auth.uid()`
  - Return 404 if unauthorized (don't leak existence)

### Profile Updates

- Users can only update their own profile
- RLS policy: `id = auth.uid()`

## Token Refresh

**CLI:**
- Check `expiresAt` before each request
- If expired, use `refreshToken` to get new access token
- Update config file with new token + expiration
- If refresh fails, trigger re-authentication

**Web:**
- Supabase client handles refresh automatically
- Uses `onAuthStateChange` to detect session changes

## Security Considerations

1. **Token Scope:** Supabase tokens are user-specific, can't access other users' data (enforced by RLS)
2. **HTTPS Only:** All authentication traffic over HTTPS
3. **No Password Storage:** GitHub handles credentials, we only store tokens
4. **Refresh Token Rotation:** Supabase handles rotation automatically
5. **RLS Enforcement:** Database-level security prevents unauthorized access
6. **Config File Permissions:** CLI sets 600 permissions on config file

## Error Scenarios

### Expired Token
- CLI detects via `expiresAt` check
- Attempts refresh with `refreshToken`
- If refresh fails, re-authenticate

### Revoked GitHub Access
- User revokes GitHub OAuth app access
- Next API call returns 401
- CLI/Web prompts re-authentication

### Stolen Token
- Limited damage: token only grants access to user's own data
- User can revoke by signing out (invalidates all tokens)
- Short expiration reduces window of vulnerability

### Username Changes
- GitHub username changes don't affect claudebin username
- claudebin username is set once at account creation
- Could add "change username" feature later if needed
