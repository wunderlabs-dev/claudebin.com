# Thread Page Data Caching Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Cache the expensive thread data query using `use cache` by moving the two personalized values (`isAuthor`, `hasLiked`) to client-side computation/fetching.

**Architecture:** The thread page's Supabase query (thread + author profile join) gets wrapped in a `use cache` function. `isAuthor` is computed client-side from `useAuth()` context + `thread.userId` prop. `hasLiked` is fetched client-side via a server action on mount. Private thread access is still checked dynamically (cheap auth check, only when thread is not public).

**Tech Stack:** Next.js 16 `use cache` / `cacheLife` / `cacheTag`, existing `useAuth()` context, new server action for like status.

---

## Task 1: Enable `cacheComponents` in next.config

**Files:**
- Modify: `app/next.config.js:11-16`

**Context:** The config currently has only `outputFileTracingRoot` and `turbopack.root`. `use cache` requires `cacheComponents: true` per Next.js 16 docs.

**Step 1: Add cacheComponents to nextConfig**

In `app/next.config.js`, find:

```javascript
const nextConfig = {
  outputFileTracingRoot: root,
  turbopack: {
    root: root,
  },
};
```

Replace with:

```javascript
const nextConfig = {
  cacheComponents: true,
  outputFileTracingRoot: root,
  turbopack: {
    root: root,
  },
};
```

**Step 2: Commit**

```bash
git add app/next.config.js
git commit -m "feat: enable cacheComponents for use cache directive"
```

---

## Task 2: Add `getByIdWithProfile` to sessions repo

**Files:**
- Modify: `app/src/server/repos/sessions.ts`

**Context:** The current `getByIdWithAuthor` (lines 134-157) joins `session_likes` to compute `hasLiked`. Since we're moving like status to client-side, we need a leaner query that skips the `session_likes` join — it returns all the same thread data + author profile, minus `hasLiked`. The existing `ThreadWithAuthor` type already has `hasLiked` as optional (`hasLiked?: boolean`), so we can reuse it.

**Step 1: Add the new function**

In `app/src/server/repos/sessions.ts`, add the following function AFTER `getByIdWithAuthor` (after line 157) and BEFORE `getByIdForUser` (line 159):

```typescript
const getByIdWithProfile = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<ThreadWithAuthor | null> => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, profiles(username, avatarUrl, deletedAt)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch session: ${error.message}`);
  if (!data) return null;

  const { profiles, ...session } = data;
  return { ...session, profiles: sanitizeProfile(profiles) };
};
```

**Step 2: Add to exports**

In the `sessions` export object, add `getByIdWithProfile` after `getByIdWithAuthor`:

```typescript
export const sessions = {
  getPublicThreads,
  getFeaturedThreads,
  getByUserId,
  getById,
  getByIdWithAuthor,
  getByIdWithProfile,
  getByIdForUser,
  ...
};
```

**Step 3: Commit**

```bash
git add app/src/server/repos/sessions.ts
git commit -m "feat: add getByIdWithProfile query without session_likes join"
```

**Important notes:**
- This function is identical to `getByIdWithAuthor` but removes: the `session_likes(id)` from the select, the `currentUserId` parameter, and the `hasLiked` computation.
- It uses `sanitizeProfile` (existing helper at line 28) which strips deleted profiles.
- Return type is `ThreadWithAuthor` where `hasLiked` is undefined (optional field).

---

## Task 3: Create `getLikeStatus` server action

**Files:**
- Create: `app/src/server/actions/likeStatus.ts`

**Context:** The like container currently receives `initialLiked` as a server-rendered prop. We need a server action that the client can call on mount to check if the current user has liked a thread. The `sessionLikes.hasLiked` function already exists at `app/src/server/repos/sessionLikes.ts:7-20` — we just need to expose it as a server action.

**Step 1: Create the server action file**

Create `app/src/server/actions/likeStatus.ts` with this exact content:

```typescript
"use server";

import { isNil } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessionLikes } from "@/server/repos/sessionLikes";

export const getLikeStatus = async (sessionId: string): Promise<boolean> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) return false;

  return sessionLikes.hasLiked(supabase, sessionId, user.id);
};
```

**Step 2: Commit**

```bash
git add app/src/server/actions/likeStatus.ts
git commit -m "feat: add getLikeStatus server action for client-side like checking"
```

**Important notes:**
- Returns `false` for unauthenticated users (no error, just not liked).
- Reuses existing `sessionLikes.hasLiked` — no new DB logic.
- This is a "use server" action, callable from client components via `useQuery`.

---

## Task 4: Create cached thread data function

**Files:**
- Create: `app/src/server/cache/thread.ts`

**Context:** This is the core caching function. It wraps the thread data fetch in `use cache` so the Supabase query result is cached. Uses `createServiceClient()` (not the cookie-based client) since `use cache` cannot access `cookies()`. Uses `cacheLife("minutes")` for a 15-minute server-side TTL. Uses `cacheTag` for on-demand invalidation when thread data changes (likes, visibility toggles).

**Step 1: Create the cache function file**

Create `app/src/server/cache/thread.ts` with this exact content:

```typescript
"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { createServiceClient } from "@/server/supabase/service";
import { sessions } from "@/server/repos/sessions";

// ABOUTME: Cached thread data fetch — bypasses RLS via service client
// Returns thread + author profile without like status (hasLiked is fetched client-side)
// Private threads are returned too — access control happens in the page component
export const getCachedThread = async (id: string) => {
  cacheLife("minutes");
  cacheTag(`thread:${id}`);

  const supabase = createServiceClient();
  return sessions.getByIdWithProfile(supabase, id);
};
```

**Step 2: Commit**

```bash
git add app/src/server/cache/thread.ts
git commit -m "feat: add cached thread data fetch with use cache"
```

**Important notes:**
- File-level `"use cache"` means all exports are cached.
- `cacheLife("minutes")` uses the built-in profile: 5min stale (client), 15min revalidate (server).
- `cacheTag("thread:${id}")` enables targeted invalidation via `revalidateTag("thread:xyz123")`.
- `createServiceClient()` bypasses RLS — the function returns ALL threads including private ones. Access control is the page's responsibility.
- The cache key is automatically generated from the function ID + serialized arguments (`id` string).

---

## Task 5: Invalidate thread cache on mutations

**Files:**
- Modify: `app/src/server/actions/like.ts`
- Modify: `app/src/server/actions/visibility.ts`

**Context:** When a user likes/unlikes a thread or toggles visibility, the cached thread data should be invalidated so the next request gets fresh data. We use `revalidateTag` to invalidate by thread ID.

**Step 1: Read and update like action**

Read `app/src/server/actions/like.ts`. Currently:

```typescript
"use server";

import { isNil } from "ramda";

import { createClient } from "@/server/supabase/server";
import { sessionLikes } from "@/server/repos/sessionLikes";

export const like = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  return sessionLikes.toggle(supabase, sessionId, user.id);
};
```

Add `revalidateTag` import and call after the toggle. Replace the entire file with:

```typescript
"use server";

import { isNil } from "ramda";
import { revalidateTag } from "next/cache";

import { createClient } from "@/server/supabase/server";
import { sessionLikes } from "@/server/repos/sessionLikes";

export const like = async (sessionId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isNil(user)) {
    throw new Error("Unauthorized");
  }

  const result = await sessionLikes.toggle(supabase, sessionId, user.id);
  revalidateTag(`thread:${sessionId}`);
  return result;
};
```

**Step 2: Read and update visibility action**

Read `app/src/server/actions/visibility.ts`. Add the same `revalidateTag` call after toggling visibility. Add:

```typescript
import { revalidateTag } from "next/cache";
```

And after the visibility toggle result, add:

```typescript
revalidateTag(`thread:${sessionId}`);
```

(The exact edit depends on the file's current structure — read it first to determine the right insertion point. The pattern is the same: import `revalidateTag` from `next/cache`, call it with `thread:${sessionId}` after the mutation succeeds.)

**Step 3: Commit**

```bash
git add app/src/server/actions/like.ts app/src/server/actions/visibility.ts
git commit -m "feat: invalidate thread cache on like and visibility mutations"
```

---

## Task 6: Update thread page to use cached data

**Files:**
- Modify: `app/src/app/(main)/threads/[id]/page.tsx`

**Context:** Currently the page calls `createClient()` → `getUser()` → `getByIdWithAuthor(supabase, id, user?.id)` on every request. We replace the data fetch with the cached function, keep `getUser()` only for private thread access control, and remove `isAuthor`/`initialLiked` from the sidebar props (replaced with `userId`).

Current state of the page (key lines):

```typescript
// Line 11: import { createClient } from "@/server/supabase/server";
// Line 60-74: const supabase = await createClient(); ... getUser() ... getByIdWithAuthor
// Lines 105-117: <ThreadPageSidebarContainer isAuthor={...} initialLiked={...} ... />
```

**Step 1: Update imports**

Find:

```typescript
import { sessions } from "@/server/repos/sessions";
import { createClient } from "@/server/supabase/server";
```

Replace with:

```typescript
import { createClient } from "@/server/supabase/server";
import { getCachedThread } from "@/server/cache/thread";
```

Note: `sessions` import is removed — no longer directly called from the page. `createClient` is kept for private thread auth check.

**Step 2: Update the data fetching**

Find the body of `ThreadPage` (lines 60-75):

```typescript
const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { id } = await params;

  const t = await getTranslations();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const thread = await sessions.getByIdWithAuthor(supabase, id, user?.id);

  if (isNil(thread)) {
    notFound();
  }
```

Replace with:

```typescript
const ThreadPage = async ({ params }: ThreadPageProps) => {
  const { id } = await params;

  const t = await getTranslations();
  const thread = await getCachedThread(id);

  if (isNil(thread)) {
    notFound();
  }

  // Private threads require auth — dynamic path (cheap cookie read)
  if (!thread.isPublic) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id !== thread.userId) {
      notFound();
    }
  }
```

**Step 3: Update sidebar props**

Find:

```tsx
        <ThreadPageSidebarContainer
          id={thread.id}
          isPublic={thread.isPublic}
          initialLiked={thread.hasLiked}
          isAuthor={user?.id === thread?.userId}
          createdAt={format(thread.createdAt, "MM/dd/yyyy")}
          workingDir={getProjectName(thread.workingDir)}
          modelName={thread.modelName}
          fileCount={thread.fileCount}
          viewCount={thread.viewCount}
          likeCount={thread.likeCount}
          messageCount={thread.messageCount}
        />
```

Replace with:

```tsx
        <ThreadPageSidebarContainer
          id={thread.id}
          isPublic={thread.isPublic}
          userId={thread.userId}
          createdAt={format(thread.createdAt, "MM/dd/yyyy")}
          workingDir={getProjectName(thread.workingDir)}
          modelName={thread.modelName}
          fileCount={thread.fileCount}
          viewCount={thread.viewCount}
          likeCount={thread.likeCount}
          messageCount={thread.messageCount}
        />
```

Changes: `initialLiked={thread.hasLiked}` removed, `isAuthor={user?.id === thread?.userId}` replaced with `userId={thread.userId}`.

**Step 4: Update generateMetadata**

The `generateMetadata` function (lines 30-57) currently uses `sessions.getByIdWithAuthor`. Since we removed the `sessions` import, update it to use the cached function too.

Find:

```typescript
  const supabase = await createClient();
  const thread = await sessions.getByIdWithAuthor(supabase, id);
```

Replace with:

```typescript
  const thread = await getCachedThread(id);
```

Remove the `createClient` call from `generateMetadata` (it's only used for the thread fetch there). The `createClient` import is still needed for the private thread auth check in the page body.

**Step 5: Clean up unused imports**

After all changes, verify which imports are still needed:
- `createClient` — still needed for private thread auth check
- `sessions` — REMOVED (no longer used)
- `getProjectName` — still needed
- `isNil` — still needed
- `format` — still needed

Also, the `getProjectName` import can stay. Remove `sessions` import if not already done in Step 1.

**Step 6: Commit**

```bash
git add app/src/app/\(main\)/threads/\[id\]/page.tsx
git commit -m "feat: use cached thread data fetch, move personalization to client"
```

**Important notes:**
- For PUBLIC threads: `getCachedThread(id)` returns cached data, no cookies read in page, fast.
- For PRIVATE threads: `getCachedThread(id)` returns cached data (service client bypasses RLS), then `createClient()` + `getUser()` checks ownership. Private thread data stays on the server — it's never rendered to unauthorized users.
- The `user` variable is now scoped inside the `if (!thread.isPublic)` block — it doesn't leak to the rest of the component.

---

## Task 7: Update `ThreadPageSidebarContainer` — replace `isAuthor` with `userId`

**Files:**
- Modify: `app/src/containers/thread-page-sidebar-container.tsx`

**Context:** Currently receives `isAuthor: boolean` and `initialLiked?: boolean` as props from the page. We replace `isAuthor` with `userId` and compute `isAuthor` locally from `useAuth()`. We remove `initialLiked` entirely (like status moves to the LikeContainer).

**Step 1: Add `useAuth` import**

Find:

```typescript
import { useThreadEmbed } from "@/context/thread-embed";
```

Add after it:

```typescript
import { useAuth } from "@/context/auth";
```

**Step 2: Update type definition**

Find:

```typescript
type ThreadPageSidebarContainerProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  isPublic: boolean;
  isAuthor: boolean;
  initialLiked?: boolean;
};
```

Replace with:

```typescript
type ThreadPageSidebarContainerProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  isPublic: boolean;
  userId: string;
};
```

**Step 3: Update destructured props and add auth computation**

Find:

```typescript
const ThreadPageSidebarContainer = ({
  id,
  isPublic,
  isAuthor,
  initialLiked,
  createdAt,
  workingDir,
  modelName,
  viewCount,
  fileCount,
  likeCount,
  messageCount,
}: ThreadPageSidebarContainerProps) => {
  const t = useTranslations();
```

Replace with:

```typescript
const ThreadPageSidebarContainer = ({
  id,
  isPublic,
  userId,
  createdAt,
  workingDir,
  modelName,
  viewCount,
  fileCount,
  likeCount,
  messageCount,
}: ThreadPageSidebarContainerProps) => {
  const t = useTranslations();
  const { user } = useAuth();
  const isAuthor = user?.id === userId;
```

**Step 4: Remove `initialLiked` from ThreadMeta render**

Find:

```tsx
            <ThreadPageThreadMeta
              id={id}
              isPublic={isPublic}
              isAuthor={isAuthor}
              createdAt={createdAt}
              fileCount={fileCount}
              viewCount={viewCount}
              likeCount={likeCount}
              workingDir={workingDir}
              modelName={modelName}
              messageCount={messageCount}
              initialLiked={initialLiked}
            />
```

Replace with:

```tsx
            <ThreadPageThreadMeta
              id={id}
              isPublic={isPublic}
              isAuthor={isAuthor}
              createdAt={createdAt}
              fileCount={fileCount}
              viewCount={viewCount}
              likeCount={likeCount}
              workingDir={workingDir}
              modelName={modelName}
              messageCount={messageCount}
            />
```

**Step 5: Commit**

```bash
git add app/src/containers/thread-page-sidebar-container.tsx
git commit -m "refactor: compute isAuthor client-side, remove initialLiked prop"
```

---

## Task 8: Update `ThreadPageThreadMeta` — remove `initialLiked` prop

**Files:**
- Modify: `app/src/components/thread-page-thread-meta.tsx`

**Context:** This component passes `initialLiked` down to `ThreadPageSidebarLikeContainer`. Since the like container will fetch its own status, remove the prop from this component's type and from the LikeContainer render.

**Step 1: Update type definition**

Find:

```typescript
type ThreadPageThreadMetaProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  initialLiked?: boolean;
  isPublic?: boolean;
  isAuthor?: boolean;
  className?: string;
};
```

Replace with (remove `initialLiked`):

```typescript
type ThreadPageThreadMetaProps = {
  id: string;
  createdAt: string;
  fileCount: number;
  viewCount: number;
  likeCount: number;
  workingDir?: string | null;
  modelName?: string | null;
  messageCount?: number | null;
  isPublic?: boolean;
  isAuthor?: boolean;
  className?: string;
};
```

**Step 2: Remove from destructured props**

Find:

```typescript
const ThreadPageThreadMeta = ({
  id,
  createdAt,
  fileCount,
  viewCount,
  likeCount,
  workingDir,
  modelName,
  messageCount,
  initialLiked,
  isPublic,
  isAuthor,
  className,
}: ThreadPageThreadMetaProps) => {
```

Replace with (remove `initialLiked`):

```typescript
const ThreadPageThreadMeta = ({
  id,
  createdAt,
  fileCount,
  viewCount,
  likeCount,
  workingDir,
  modelName,
  messageCount,
  isPublic,
  isAuthor,
  className,
}: ThreadPageThreadMetaProps) => {
```

**Step 3: Remove `initialLiked` from LikeContainer render**

Find:

```tsx
        <ThreadPageSidebarLikeContainer id={id} initialLiked={initialLiked} likeCount={likeCount} />
```

Replace with:

```tsx
        <ThreadPageSidebarLikeContainer id={id} likeCount={likeCount} />
```

**Step 4: Commit**

```bash
git add app/src/components/thread-page-thread-meta.tsx
git commit -m "refactor: remove initialLiked prop from ThreadPageThreadMeta"
```

---

## Task 9: Update `ThreadPageSidebarLikeContainer` — fetch like status client-side

**Files:**
- Modify: `app/src/containers/thread-page-sidebar-like-container.tsx`

**Context:** Currently receives `initialLiked?: boolean` as a server-rendered prop. We replace this with a client-side fetch using `useQuery` + the `getLikeStatus` server action from Task 3. The like button starts in a neutral (unliked) state and updates once the fetch completes. For anonymous users, the fetch is skipped entirely.

**Step 1: Add imports**

Find:

```typescript
import { useMutation } from "@tanstack/react-query";
```

Replace with:

```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
```

Add after `import { like } from "@/server/actions/like";`:

```typescript
import { getLikeStatus } from "@/server/actions/likeStatus";
```

**Step 2: Update type definition**

Find:

```typescript
type ThreadPageSidebarLikeContainerProps = {
  id: string;
  initialLiked?: boolean;
  likeCount: number;
};
```

Replace with:

```typescript
type ThreadPageSidebarLikeContainerProps = {
  id: string;
  likeCount: number;
};
```

**Step 3: Update component body**

Find:

```typescript
const ThreadPageSidebarLikeContainer = ({
  id,
  initialLiked,
  likeCount,
}: ThreadPageSidebarLikeContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { user } = useAuth();

  const [count, setCount] = useState(likeCount);
  const [liked, setLiked] = useState(initialLiked);
```

Replace with:

```typescript
const ThreadPageSidebarLikeContainer = ({
  id,
  likeCount,
}: ThreadPageSidebarLikeContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { user } = useAuth();

  const { data: initialLiked } = useQuery({
    queryKey: ["like-status", id],
    queryFn: () => getLikeStatus(id),
    enabled: !!user,
  });

  const [count, setCount] = useState(likeCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (initialLiked !== undefined) {
      setLiked(initialLiked);
    }
  }, [initialLiked]);
```

**Step 4: Add `useEffect` import**

Find:

```typescript
import { useState } from "react";
```

Replace with:

```typescript
import { useEffect, useState } from "react";
```

**Step 5: Commit**

```bash
git add app/src/containers/thread-page-sidebar-like-container.tsx
git commit -m "refactor: fetch like status client-side instead of server prop"
```

**Important notes:**
- `enabled: !!user` — the query only runs for authenticated users. Anonymous users never fetch (heart stays gray).
- `useEffect` syncs the `liked` state when the query resolves. This avoids the stale closure issue where `useState(initialLiked)` would capture the initial `undefined`.
- For authenticated users who have liked: brief gray→red flash on mount. Acceptable tradeoff for cached data.
- The optimistic update logic in `useMutation` is unchanged — it still works the same way.

---

## Task 10: Verify everything works

**Step 1: Run type check**

```bash
cd app && bun type-check
```

Expected: Only pre-existing errors (`@sindresorhus/string-hash`, `bun:test`). No new errors.

**Step 2: Run Biome check**

```bash
bun check
```

Expected: Clean.

**Step 3: Run dev server and test**

```bash
cd app && bun dev
```

Test matrix:

| Scenario | Expected |
|---|---|
| Visit public thread (anonymous) | Page renders, heart gray, no flash |
| Visit public thread (logged in, NOT liked) | Page renders, heart gray, no flash |
| Visit public thread (logged in, HAS liked) | Page renders, heart gray → red after fetch |
| Visit private thread (anonymous) | 404 |
| Visit private thread (owner) | Page renders |
| Visit private thread (non-owner) | 404 |
| Like a thread → refresh | Like count updated, heart persists red |
| Toggle visibility → refresh | Visibility badge updated |

**Step 4: Verify caching works**

Enable debug logging:

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 bun dev
```

Visit a public thread. Check logs for cache HIT/MISS. First visit = MISS (populates cache). Second visit within 15 minutes = HIT.

**Step 5: Commit**

No code changes — just verification.

---

## Files Summary

| # | File | Action | Task |
|---|------|--------|------|
| 1 | `app/next.config.js` | Edit (add `cacheComponents: true`) | 1 |
| 2 | `app/src/server/repos/sessions.ts` | Edit (add `getByIdWithProfile`) | 2 |
| 3 | `app/src/server/actions/likeStatus.ts` | Create | 3 |
| 4 | `app/src/server/cache/thread.ts` | Create | 4 |
| 5 | `app/src/server/actions/like.ts` | Edit (add `revalidateTag`) | 5 |
| 6 | `app/src/server/actions/visibility.ts` | Edit (add `revalidateTag`) | 5 |
| 7 | `app/src/app/(main)/threads/[id]/page.tsx` | Edit (use cached fetch, remove personalized props) | 6 |
| 8 | `app/src/containers/thread-page-sidebar-container.tsx` | Edit (compute `isAuthor` client-side) | 7 |
| 9 | `app/src/components/thread-page-thread-meta.tsx` | Edit (remove `initialLiked` prop) | 8 |
| 10 | `app/src/containers/thread-page-sidebar-like-container.tsx` | Edit (fetch like status client-side) | 9 |

## Dependency Order

```
Task 1 (config)          — independent
Task 2 (sessions repo)   — independent
Task 3 (likeStatus action) — independent
Task 4 (cache function)  — depends on Task 1 (cacheComponents) + Task 2 (getByIdWithProfile)
Task 5 (cache invalidation) — depends on Task 4 (cacheTag name)
Task 6 (thread page)     — depends on Task 4 (getCachedThread)
Task 7 (sidebar container) — depends on Task 6 (prop changes)
Task 8 (thread meta)     — depends on Task 7 (prop changes)
Task 9 (like container)  — depends on Task 3 (getLikeStatus) + Task 8 (prop removal)
Task 10 (verify)         — depends on all
```

Parallelizable: Tasks 1, 2, 3 can all run in parallel. Tasks 7, 8, 9 are sequential (prop chain).
