# Claudebin Architecture Overview

**Date:** 12 December 2025
**Status:** Initial Design

## Purpose

Claudebin is a minimalistic tool for publishing and sharing Claude coding sessions. Users can run `npx claudebin publish` after a session to get a shareable link.

## Core Use Cases

1. **Personal Archive** - Keep a searchable record of Claude sessions for personal reference
2. **Knowledge Sharing** - Share problem-solving sessions with teammates and community

## High-Level Architecture

```
┌─────────────┐
│   CLI Tool  │ (npx claudebin publish)
│  @claudebin   │
└──────┬──────┘
       │
       │ Reads Claude history JSON
       │ Authenticates user
       │ Uploads session
       │
       ▼
┌─────────────────┐
│    Supabase     │
│  - Auth (OAuth) │
│  - Postgres DB  │
└──────┬──────────┘
       │
       │ Fetches session data
       │
       ▼
┌─────────────────┐
│  Next.js Web    │ (claudebin.link)
│  - SSR viewer   │
│  - /llms.txt    │
└─────────────────┘
```

## Tech Stack

- **CLI:** Node.js, Commander.js, @clack/prompts, ora, chalk
- **Web:** Next.js 15 (App Router), Tailwind CSS, Supabase SSR
- **Database:** Supabase (Postgres + Auth)
- **Monorepo:** pnpm workspaces

## Key Design Decisions

1. **Server-Side Rendering** - Next.js fetches JSON on each request, renders server-side. Simple, good SEO, can add caching later if needed.

2. **JSONB Storage** - Claude session JSON stored directly in Postgres JSONB column, not separate storage bucket. Simpler architecture, fewer moving parts.

3. **Public by Default** - Sessions are public unless `--private` flag is used. Supports knowledge sharing primary use case.

4. **GitHub OAuth Only** - Single auth provider keeps it simple. Can add more later if needed.

5. **Minimalist UI** - Clean typography, progressive disclosure, mobile-friendly. No fancy features.

## Project Principles

- **YAGNI** - Build only what's needed for MVP
- **Simplicity** - Fewer moving parts, easier to maintain
- **Fast Publishing** - CLI should be quick and painless
- **Good Enough Performance** - Optimize later if needed
