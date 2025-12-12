# Vibebin Database Schema

**Date:** 12 December 2025
**Status:** Initial Design

## Overview

Vibebin uses Supabase (Postgres) with two main tables: `profiles` and `sessions`.

## Tables

### Profiles Table

Extends Supabase's built-in `auth.users` with public profile information.

**Fields:**
- `id` (UUID, primary key) - References `auth.users.id`, cascading delete
- `username` (TEXT, unique, not null) - Used in URLs (`@username`)
- `github_id` (INTEGER, unique, not null) - GitHub user ID
- `avatar_url` (TEXT, nullable) - GitHub avatar URL
- `created_at` (TIMESTAMPTZ) - Account creation timestamp

**Indexes:**
- `idx_profiles_username` on `username` - Fast lookups for `@username` URLs

**Access Patterns:**
- Lookup by username: `SELECT * FROM profiles WHERE username = 'marius'`
- User can update only their own profile

### Sessions Table

Stores published Claude coding sessions.

**Fields:**
- `id` (TEXT, primary key) - Short URL-friendly ID (8-12 chars, e.g., 'abc123xy')
- `user_id` (UUID, not null) - References `profiles.id`, cascading delete
- `title` (TEXT, nullable) - Session title (extracted from first message or user-provided)
- `conversation_data` (JSONB, not null) - Raw Claude history JSON
- `is_public` (BOOLEAN, default true) - Visibility flag
- `created_at` (TIMESTAMPTZ) - Publication timestamp
- `updated_at` (TIMESTAMPTZ) - Last modification timestamp

**Indexes:**
- `idx_sessions_user_id` on `user_id` - Fast user session lookups
- `idx_sessions_public` on `is_public` WHERE `is_public = true` - Partial index for public sessions

**Access Patterns:**
- Fetch session: `SELECT * FROM sessions WHERE id = 'abc123' AND user_id = (SELECT id FROM profiles WHERE username = 'marius')`
- List user's sessions: `SELECT * FROM sessions WHERE user_id = 'uuid' ORDER BY created_at DESC`
- List user's public sessions: `SELECT * FROM sessions WHERE user_id = 'uuid' AND is_public = true`

## Row Level Security (RLS)

### Profiles
- **Read:** Public can read all profiles
- **Write:** Users can only update their own profile

### Sessions
- **Read:** Public can read if `is_public = true`, users can always read their own
- **Write:** Users have full CRUD on their own sessions only

## Username Conflicts

When creating a profile from GitHub OAuth:
- Extract username from GitHub profile
- If collision occurs, append incrementing number: `marius` → `marius2` → `marius3`
- Store original `github_id` for uniqueness

## Session ID Generation

- Use nanoid or similar for short, URL-safe IDs
- 8-12 characters: balance between collision resistance and URL brevity
- Check for collisions before insert (extremely rare but possible)

## Data Retention

- No automatic deletion for MVP
- Users can delete their own sessions (cascades to all session data)
- Deleting account deletes all sessions (cascade from profiles → sessions)
