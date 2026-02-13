# Tracking Pixel View Counting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace fire-and-forget SSR view count RPCs with tracking pixel `<img>` tags backed by deduped, bot-filtered RPC so pages can be ISR-cached.

**Architecture:** Each page renders a 1x1 transparent GIF `<img>` that hits an API route. The route returns the GIF immediately, then uses `after()` to hash the visitor (IP+UA), check for bots, and call a single Postgres `track_page_view` RPC that deduplicates by visitor hash within a 24h window. The old `increment_*_view_count` functions and their callsites are removed.

**Tech Stack:** Next.js `after()`, Supabase RPC, `node:crypto` SHA-256, Postgres `ON CONFLICT` for dedup.

---

## Task 1: Database migration — `page_views` table + `track_page_view` RPC

**Files:**
- Create: `supabase/migrations/20250213000001_add_page_views_dedup.sql`

**Context:** The old RPCs live in two migrations:
- `supabase/migrations/20250125000004_add_increment_view_count_rpc.sql` — defines `increment_session_view_count(TEXT)` granted to `authenticated` + `anon`
- `supabase/migrations/20250127000002_add_profile_view_count.sql` — defines `increment_profile_view_count(UUID)` granted to `authenticated` + `anon`

The new migration does NOT drop the old functions (they may still be referenced by cached clients). It creates a new table and a single unified RPC.

**Step 1: Create the migration file**

Create `supabase/migrations/20250213000001_add_page_views_dedup.sql` with this exact content:

```sql
-- ABOUTME: Adds page_views table and track_page_view RPC for bot-proof, deduped view counting
-- ABOUTME: Replaces the old increment_session_view_count and increment_profile_view_count RPCs

CREATE TABLE page_views (
  entity_type TEXT NOT NULL CHECK (entity_type IN ('session', 'profile')),
  entity_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (entity_type, entity_id, visitor_hash)
);

COMMENT ON TABLE page_views IS 'Tracks unique page views for deduplication (24h window)';
COMMENT ON COLUMN page_views.visitor_hash IS 'SHA-256 hash of IP + User-Agent for privacy';

-- ABOUTME: Single RPC handles both session and profile views with dedup
-- INSERT succeeds for new visitors (ROW_COUNT = 1, increment)
-- ON CONFLICT + WHERE filters returning visitors within 24h (no update = ROW_COUNT 0, skip)
-- ON CONFLICT + WHERE matches returning visitors after 24h (update = ROW_COUNT 1, increment)
CREATE OR REPLACE FUNCTION track_page_view(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_visitor_hash TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  row_count INTEGER;
BEGIN
  INSERT INTO page_views (entity_type, entity_id, visitor_hash)
  VALUES (p_entity_type, p_entity_id, p_visitor_hash)
  ON CONFLICT (entity_type, entity_id, visitor_hash)
  DO UPDATE SET viewed_at = NOW()
  WHERE page_views.viewed_at < NOW() - INTERVAL '24 hours';

  GET DIAGNOSTICS row_count = ROW_COUNT;

  IF row_count > 0 THEN
    IF p_entity_type = 'session' THEN
      UPDATE sessions SET "viewCount" = "viewCount" + 1 WHERE id = p_entity_id;
    ELSIF p_entity_type = 'profile' THEN
      UPDATE profiles SET "viewCount" = "viewCount" + 1 WHERE id = p_entity_id::UUID;
    END IF;
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only service role can call this (API routes only, not client code)
GRANT EXECUTE ON FUNCTION track_page_view(TEXT, TEXT, TEXT) TO service_role;

-- Cleanup function for periodic maintenance (call via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views WHERE viewed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION cleanup_old_page_views() TO service_role;
```

**Step 2: Commit**

```bash
git add supabase/migrations/20250213000001_add_page_views_dedup.sql
git commit -m "feat: add page_views table and track_page_view RPC for deduped view counting"
```

**Important notes:**
- The `sessions.id` column is `TEXT` (see `supabase/migrations/20250115000002_create_sessions.sql:7`).
- The `profiles.id` column is `UUID` (see `supabase/migrations/20250115000001_create_profiles.sql:6`), so the RPC casts `p_entity_id::UUID` for profile updates.
- The old `viewCount` columns use camelCase (see `20250116000001_rename_columns_to_camelcase.sql`). The `UPDATE` statements use `"viewCount"` with quotes to match.
- Grant is to `service_role` only — the old RPCs granted to `authenticated`/`anon`, but now only API routes (which use `createServiceClient()`) should call this.

---

## Task 2: Bot detection utility

**Files:**
- Create: `app/src/server/utils/bots.ts`

**Context:** This is a new file in `app/src/server/utils/`. Existing files there: `logger.ts`, `message-to-markdown.ts`, `openrouter.ts`. All use camelCase filenames per CLAUDE.md.

**Step 1: Create the utility file**

Create `app/src/server/utils/bots.ts` with this exact content:

```typescript
import { createHash } from "node:crypto";

// ABOUTME: Bot patterns covering major crawlers, headless browsers, and SEO tools
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /headlesschrome/i,
  /lighthouse/i,
  /pagespeed/i,
  /prerender/i,
];

export const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
};

export const getVisitorHash = (ip: string | null, userAgent: string | null): string => {
  const fingerprint = `${ip ?? "unknown"}:${userAgent ?? "unknown"}`;
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 16);
};

export const getClientIp = (headers: Headers): string | null => {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  );
};
```

**Step 2: Commit**

```bash
git add app/src/server/utils/bots.ts
git commit -m "feat: add bot detection and visitor hashing utility"
```

**Important notes:**
- `isBot` returns `true` for null UA — no UA = assume bot.
- `getVisitorHash` truncates to 16 hex chars (64 bits). Enough for dedup, keeps DB compact.
- `getClientIp` reads `x-forwarded-for` first (standard for reverse proxies like Vercel), falls back to `x-real-ip`.

---

## Task 3: Add pixel logger entry

**Files:**
- Modify: `app/src/server/utils/logger.ts:13-17` (the `logger` export object)

**Context:** The logger module at `app/src/server/utils/logger.ts` exports a `logger` object with entries for `parser`, `sessions`, `auth`. We need to add `pixel`.

**Step 1: Edit the logger export**

In `app/src/server/utils/logger.ts`, find:

```typescript
export const logger = {
  parser: createLogger("parser"),
  sessions: createLogger("sessions"),
  auth: createLogger("auth"),
};
```

Replace with:

```typescript
export const logger = {
  parser: createLogger("parser"),
  sessions: createLogger("sessions"),
  auth: createLogger("auth"),
  pixel: createLogger("pixel"),
};
```

**Step 2: Commit**

```bash
git add app/src/server/utils/logger.ts
git commit -m "feat: add pixel logger entry"
```

---

## Task 4: Pixel API route for threads (sessions)

**Files:**
- Create: `app/src/app/api/pixel/t/[id]/route.ts`

**Context:** Existing API route patterns in this codebase:
- Import style: `import { NextResponse, type NextRequest } from "next/server"` (see `app/src/app/api/threads/[id]/messages/route.ts:1`)
- `after` is imported separately: `import { after } from "next/server"` (see `app/src/app/api/sessions/publish/route.ts:2`)
- Service client usage: `const supabase = createServiceClient()` — no `await`, it's synchronous (see `app/src/server/supabase/service.ts:5-16`)
- Route params pattern: `type RouteContext = { params: Promise<{ id: string }> }` (see `app/src/app/api/threads/[id]/messages/route.ts:7-9`)
- All functions use arrow function syntax per CLAUDE.md

**Step 1: Create the route file**

Create `app/src/app/api/pixel/t/[id]/route.ts` with this exact content:

```typescript
import { type NextRequest, NextResponse, after } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { getClientIp, getVisitorHash, isBot } from "@/server/utils/botDetection";
import { logger } from "@/server/utils/logger";

// ABOUTME: 1x1 transparent GIF (43 bytes)
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

const PIXEL_HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const headers = request.headers;

  const response = new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: PIXEL_HEADERS,
  });

  after(async () => {
    const userAgent = headers.get("user-agent");

    if (isBot(userAgent)) return;

    const ip = getClientIp(headers);
    const visitorHash = getVisitorHash(ip, userAgent);
    const supabase = createServiceClient();

    const { error } = await supabase.rpc("track_page_view", {
      p_entity_type: "session",
      p_entity_id: id,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      logger.pixel.error("Thread view tracking failed", error);
    }
  });

  return response;
};
```

**Step 2: Commit**

```bash
git add app/src/app/api/pixel/t/\[id\]/route.ts
git commit -m "feat: add tracking pixel API route for thread views"
```

**Important notes:**
- The response is returned BEFORE the `after()` callback runs. This means the GIF is served instantly; the DB work happens asynchronously after response.
- `after()` is a Next.js API from `next/server` that runs code after the response is sent — already used in this codebase at `app/src/app/api/sessions/publish/route.ts:71`.
- `createServiceClient()` is synchronous (returns a client, no promise). See `app/src/server/supabase/service.ts`.
- The `supabase.rpc("track_page_view", ...)` call uses the service role key, which has the `service_role` grant from the migration.

---

## Task 5: Pixel API route for profiles

**Files:**
- Create: `app/src/app/api/pixel/p/[id]/route.ts`

**Context:** Identical structure to Task 4 but with `p_entity_type: "profile"`. The profile page at `app/src/app/(main)/profile/[username]/page.tsx:44` calls `profiles.incrementViewCount(supabase, profile.id)` where `profile.id` is a UUID string. The tracking pixel will receive this same UUID as the `id` route param.

**Step 1: Create the route file**

Create `app/src/app/api/pixel/p/[id]/route.ts` with this exact content:

```typescript
import { type NextRequest, NextResponse, after } from "next/server";

import { createServiceClient } from "@/server/supabase/service";
import { getClientIp, getVisitorHash, isBot } from "@/server/utils/botDetection";
import { logger } from "@/server/utils/logger";

// ABOUTME: 1x1 transparent GIF (43 bytes)
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

const PIXEL_HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const headers = request.headers;

  const response = new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: PIXEL_HEADERS,
  });

  after(async () => {
    const userAgent = headers.get("user-agent");

    if (isBot(userAgent)) return;

    const ip = getClientIp(headers);
    const visitorHash = getVisitorHash(ip, userAgent);
    const supabase = createServiceClient();

    const { error } = await supabase.rpc("track_page_view", {
      p_entity_type: "profile",
      p_entity_id: id,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      logger.pixel.error("Profile view tracking failed", error);
    }
  });

  return response;
};
```

**Step 2: Commit**

```bash
git add app/src/app/api/pixel/p/\[id\]/route.ts
git commit -m "feat: add tracking pixel API route for profile views"
```

**Important notes:**
- The `id` param here will be a UUID string (profile IDs are UUIDs). The `track_page_view` RPC casts it to UUID internally via `p_entity_id::UUID`.

---

## Task 6: Tracking pixel component

**Files:**
- Create: `app/src/components/tracking-pixel.tsx`

**Context:** Components in this codebase are single files in `app/src/components/`, kebab-case named. They use `as const` for variant unions per CLAUDE.md type patterns. The component renders a server-side `<img>` tag (no client interactivity needed — no `"use client"`).

**Step 1: Create the component file**

Create `app/src/components/tracking-pixel.tsx` with this exact content:

```typescript
// ABOUTME: Renders a 1x1 invisible tracking pixel that hits the view counting API route
const TrackingPixelTypes = ["t", "p"] as const;
type TrackingPixelType = (typeof TrackingPixelTypes)[number];

type TrackingPixelProps = {
  type: TrackingPixelType;
  id: string;
};

export const TrackingPixel = ({ type, id }: TrackingPixelProps) => {
  return (
    <img
      src={`/api/pixel/${type}/${id}`}
      alt=""
      width={1}
      height={1}
      className="absolute invisible"
      aria-hidden="true"
    />
  );
};
```

**Step 2: Commit**

```bash
git add app/src/components/tracking-pixel.tsx
git commit -m "feat: add TrackingPixel component"
```

**Important notes:**
- Uses `<img>` (not Next.js `<Image>`) intentionally — this is a tracking pixel, not a content image. Next.js `<Image>` would try to optimize it and break caching headers.
- `alt=""` + `aria-hidden="true"` makes it invisible to screen readers per accessibility best practices.
- `className="absolute invisible"` makes it take no layout space and be visually hidden.
- No `"use client"` directive needed — this is a server component that renders a plain `<img>` tag.

---

## Task 7: Update thread page — replace SSR increment with pixel

**Files:**
- Modify: `app/src/app/(main)/threads/[id]/page.tsx:10,24,75,78`

**Context:** Current state at `app/src/app/(main)/threads/[id]/page.tsx`:
- Line 10: `import { sessions } from "@/server/repos/sessions";`
- Line 24: `import { ThreadEmbedProvider } from "@/context/thread-embed";`
- Line 75: `sessions.incrementViewCount(supabase, id);` — fire-and-forget SSR call (THIS IS WHAT WE'RE REMOVING)
- Line 78: `<ThreadEmbedProvider>` — opening tag of the return JSX

The `sessions` import on line 10 is STILL NEEDED — it's used on lines 36 and 69 (`sessions.getByIdWithAuthor`). Do NOT remove it.

**Step 1: Add the TrackingPixel import**

After line 24 (`import { ThreadEmbedProvider } from "@/context/thread-embed";`), add:

```typescript
import { TrackingPixel } from "@/components/tracking-pixel";
```

**Step 2: Delete the incrementViewCount call**

Delete line 75 entirely:

```typescript
  sessions.incrementViewCount(supabase, id);
```

Also delete the blank line after it if one exists, to keep spacing clean.

**Step 3: Add the TrackingPixel to the JSX**

Find:

```tsx
    <ThreadEmbedProvider>
      <Container size="lg" spacing="none" className="grid grid-cols-1 lg:grid-cols-12">
```

Replace with:

```tsx
    <ThreadEmbedProvider>
      <TrackingPixel type="t" id={id} />
      <Container size="lg" spacing="none" className="grid grid-cols-1 lg:grid-cols-12">
```

**Step 4: Commit**

```bash
git add app/src/app/\(main\)/threads/\[id\]/page.tsx
git commit -m "feat: replace SSR view count increment with tracking pixel on thread page"
```

**Expected final state of key lines:**

```typescript
// Line ~25 (new import)
import { TrackingPixel } from "@/components/tracking-pixel";

// Line ~75 is GONE (sessions.incrementViewCount removed)

// Line ~77-79 (pixel added before Container)
    <ThreadEmbedProvider>
      <TrackingPixel type="t" id={id} />
      <Container size="lg" spacing="none" className="grid grid-cols-1 lg:grid-cols-12">
```

---

## Task 8: Update profile page — replace SSR increment with pixel

**Files:**
- Modify: `app/src/app/(main)/profile/[username]/page.tsx:6,42-44,46-90`

**Context:** Current state at `app/src/app/(main)/profile/[username]/page.tsx`:
- Line 6: `import { profiles } from "@/server/repos/profiles";` — STILL NEEDED for `profiles.getByUsername` on line 30
- Lines 42-44: The comment + `profiles.incrementViewCount(supabase, profile.id);` — THIS IS WHAT WE'RE REMOVING
- Lines 46-91: The `return (<Container ...>...</Container>)` — we need to wrap this in a fragment to add the pixel

**Step 1: Add the TrackingPixel import**

After line 6 (`import { profiles } from "@/server/repos/profiles";`), add:

```typescript
import { TrackingPixel } from "@/components/tracking-pixel";
```

**Step 2: Delete the incrementViewCount call and its comment**

Delete lines 42-44 entirely:

```typescript
  // Analytics for profile views
  // Fire-and-forget increment, no await needed as it doesn't affect page render
  profiles.incrementViewCount(supabase, profile.id);
```

**Step 3: Wrap return JSX in fragment with pixel**

Find:

```tsx
  return (
    <Container
      spacing="md"
      className="grid grid-cols-1 items-start lg:grid-cols-12 gap-12 xl:gap-18"
    >
```

Replace with:

```tsx
  return (
    <>
      <TrackingPixel type="p" id={profile.id} />
      <Container
        spacing="md"
        className="grid grid-cols-1 items-start lg:grid-cols-12 gap-12 xl:gap-18"
      >
```

And find the closing:

```tsx
    </Container>
  );
```

Replace with:

```tsx
      </Container>
    </>
  );
```

**Step 4: Commit**

```bash
git add app/src/app/\(main\)/profile/\[username\]/page.tsx
git commit -m "feat: replace SSR view count increment with tracking pixel on profile page"
```

---

## Task 9: Remove `incrementViewCount` from sessions repo

**Files:**
- Modify: `app/src/server/repos/sessions.ts:243-254,278`

**Context:** Current state:
- Lines 243-254: The `incrementViewCount` function definition
- Line 278: `incrementViewCount,` in the exports object

After this change, nothing references `increment_session_view_count` RPC from the app code. The old RPC still exists in the DB (migration `20250125000004`) but is unused — we do NOT create a new migration to drop it (that's a separate cleanup task).

**Step 1: Delete the `incrementViewCount` function**

Delete lines 243-254 (the entire function):

```typescript
const incrementViewCount = async (
  supabase: SupabaseClient<Database>,
  sessionId: string,
): Promise<void> => {
  const { error } = await supabase.rpc("increment_session_view_count", {
    session_id: sessionId,
  });

  if (error) {
    logger.sessions.error("View count increment failed", error);
  }
};
```

**Step 2: Remove from exports object**

In the exports object (currently lines 265-279), find and delete:

```typescript
  incrementViewCount,
```

The exports object should go from:

```typescript
export const sessions = {
  getPublicThreads,
  getFeaturedThreads,
  getByUserId,
  getById,
  getByIdWithAuthor,
  getByIdForUser,
  create,
  update,
  delete: deleteSession,
  uploadJsonl,
  downloadJsonl,
  deleteFile,
  incrementViewCount,
};
```

To:

```typescript
export const sessions = {
  getPublicThreads,
  getFeaturedThreads,
  getByUserId,
  getById,
  getByIdWithAuthor,
  getByIdForUser,
  create,
  update,
  delete: deleteSession,
  uploadJsonl,
  downloadJsonl,
  deleteFile,
};
```

**Step 3: Commit**

```bash
git add app/src/server/repos/sessions.ts
git commit -m "refactor: remove incrementViewCount from sessions repo"
```

---

## Task 10: Remove `incrementViewCount` from profiles repo

**Files:**
- Modify: `app/src/server/repos/profiles.ts:53-58,60`

**Context:** Current state:
- Lines 53-58: The `incrementViewCount` function definition
- Line 60: `export const profiles = { getById, getByUsername, upsert, incrementViewCount };`

**Step 1: Delete the `incrementViewCount` function**

Delete lines 53-58 (the entire function):

```typescript
const incrementViewCount = async (
  supabase: SupabaseClient<Database>,
  profileId: string,
): Promise<void> => {
  await supabase.rpc("increment_profile_view_count", { profile_id: profileId });
};
```

**Step 2: Remove from exports object**

Change line 60 from:

```typescript
export const profiles = { getById, getByUsername, upsert, incrementViewCount };
```

To:

```typescript
export const profiles = { getById, getByUsername, upsert };
```

**Step 3: Commit**

```bash
git add app/src/server/repos/profiles.ts
git commit -m "refactor: remove incrementViewCount from profiles repo"
```

---

## Task 11: Verify everything works

**Step 1: Run type check**

```bash
cd app && bun type-check
```

Expected: Clean output, no errors. If there are errors, they'll likely be one of:
- Unused import of `logger` in `sessions.ts` — check if anything else uses it (it does: line 185, 199, 215, 239)
- Missing `after` type — `after` is available in `next/server` since Next.js 15

**Step 2: Run Biome check**

```bash
cd app && bun check
```

Expected: Clean output. If there are Biome errors, fix formatting/lint issues.

**Step 3: Run dev server and manually verify**

```bash
cd app && bun dev
```

Then:
1. Open a thread page in the browser
2. Open DevTools → Network tab
3. Verify you see a request to `/api/pixel/t/{id}` returning `200` with `Content-Type: image/gif`
4. Verify the response has `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
5. Open a profile page and verify `/api/pixel/p/{uuid}` similarly
6. View page source — confirm the `<img>` tag is present in the HTML

**Step 4: Verify bot filtering**

```bash
curl -A "Googlebot/2.1" http://localhost:3000/api/pixel/t/test123 -v 2>&1 | grep "Content-Type"
```

Expected: Still returns `image/gif` (GIF is always served), but no `page_views` row should be inserted.

**Step 5: Verify deduplication**

After loading a thread page once, reload it. Check the DB:

```sql
SELECT * FROM page_views ORDER BY viewed_at DESC LIMIT 5;
```

The view count on the `sessions` table should NOT have incremented a second time.

---

## Files Summary

| # | File | Action | Task |
|---|------|--------|------|
| 1 | `supabase/migrations/20250213000001_add_page_views_dedup.sql` | Create | 1 |
| 2 | `app/src/server/utils/bots.ts` | Create | 2 |
| 3 | `app/src/server/utils/logger.ts` | Edit line 17 | 3 |
| 4 | `app/src/app/api/pixel/t/[id]/route.ts` | Create | 4 |
| 5 | `app/src/app/api/pixel/p/[id]/route.ts` | Create | 5 |
| 6 | `app/src/components/tracking-pixel.tsx` | Create | 6 |
| 7 | `app/src/app/(main)/threads/[id]/page.tsx` | Edit lines 25, 75, 78 | 7 |
| 8 | `app/src/app/(main)/profile/[username]/page.tsx` | Edit lines 7, 42-44, 46, 90-91 | 8 |
| 9 | `app/src/server/repos/sessions.ts` | Delete lines 243-254, 278 | 9 |
| 10 | `app/src/server/repos/profiles.ts` | Delete lines 53-58, edit line 60 | 10 |

## Dependency Order

Tasks 1-6 are independent of each other and can be executed in any order (or in parallel).

Tasks 7-8 depend on Task 6 (the `TrackingPixel` component must exist).

Task 9 depends on Task 7 (the old callsite in thread page must be removed first, so we can safely delete the function — though TypeScript would catch this regardless).

Task 10 depends on Task 8 (same reasoning for profile page).

Task 11 depends on all previous tasks.

```
Tasks 1-6 (parallel/any order)
    └── Tasks 7-8 (depend on 6)
        └── Tasks 9-10 (depend on 7, 8 respectively)
            └── Task 11 (verification)
```
