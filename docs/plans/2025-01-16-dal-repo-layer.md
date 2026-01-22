# Data Access Layer (DAL) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a typed repository layer that encapsulates all Supabase queries, providing stable domain types and runtime validation at boundaries.

**Architecture:** Repos own all database access. UI and tRPC consume domain types. Zod validates at edges. Direct `.from()` calls only in repo files.

**Tech Stack:** Supabase, Zod, TypeScript, tRPC

---

## Current State Analysis

**Direct Supabase calls found in:**
- `src/trpc/routers/auth.ts` - cli_auth_sessions insert/select
- `src/trpc/routers/sessions.ts` - profiles upsert, sessions insert/select, storage
- `app/s/[id]/page.tsx` - sessions select, messages select
- `app/dashboard/page.tsx` - profiles select
- `app/api/internal/process-session/route.ts` - sessions/messages CRUD
- `app/cli/auth/page.tsx` - cli_auth_sessions select/update

**Target structure:**
```
packages/web/lib/
├── supabase/
│   ├── database.types.ts    # Generated (exists)
│   ├── client.ts            # Browser client (exists)
│   ├── server.ts            # Server client (exists)
│   └── service.ts           # Service client (exists)
├── repos/
│   ├── sessions.repo.ts     # Session + storage operations
│   ├── messages.repo.ts     # Message operations
│   ├── profiles.repo.ts     # Profile operations
│   └── cli-auth.repo.ts     # CLI auth session operations
└── types/
    ├── message.ts           # ContentBlock types (exists)
    └── domain.ts            # Domain types (new)
```

---

### Task 1: Create Domain Types

**Files:**
- Create: `packages/web/lib/types/domain.ts`

**Step 1: Write domain type definitions**

```typescript
// packages/web/lib/types/domain.ts
import type { ContentBlock } from "./message";

// Session domain type - what UI consumes
export interface Session {
  id: string;
  title: string | null;
  status: "processing" | "ready" | "failed";
  messageCount: number | null;
  errorMessage: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message domain type - with typed content
export interface Message {
  id: number;
  idx: number;
  role: "user" | "assistant" | null;
  model: string | null;
  content: ContentBlock[];
  hasToolCalls: boolean;
  toolNames: string[];
  textPreview: string;
}

// Profile domain type
export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

// CLI Auth Session domain type
export interface CliAuthSession {
  id: string;
  sessionToken: string;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  completedAt: Date | null;
}

// Session with messages for viewer page
export interface SessionWithMessages {
  session: Session;
  messages: Message[];
}
```

**Step 2: Commit**

```bash
git add packages/web/lib/types/domain.ts
git commit -m "feat(types): add domain types for UI consumption"
```

---

### Task 2: Create Profiles Repository

**Files:**
- Create: `packages/web/lib/repos/profiles.repo.ts`

**Step 1: Write profiles repo**

```typescript
// packages/web/lib/repos/profiles.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { Profile } from "@/lib/types/domain";

const mapRowToProfile = (row: {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
}): Profile => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
});

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, avatar_url")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToProfile(data);
};

export const upsertProfile = async (profile: {
  id: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}): Promise<void> => {
  const supabase = createServiceClient();
  await supabase.from("profiles").upsert(
    {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatarUrl,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
};
```

**Step 2: Commit**

```bash
git add packages/web/lib/repos/profiles.repo.ts
git commit -m "feat(repos): add profiles repository"
```

---

### Task 3: Create Sessions Repository

**Files:**
- Create: `packages/web/lib/repos/sessions.repo.ts`

**Step 1: Write sessions repo**

```typescript
// packages/web/lib/repos/sessions.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { Session } from "@/lib/types/domain";
import type { TablesInsert } from "@/lib/supabase/database.types";

const mapRowToSession = (row: {
  id: string;
  title: string | null;
  status: string;
  message_count: number | null;
  error_message: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}): Session => ({
  id: row.id,
  title: row.title,
  status: row.status as Session["status"],
  messageCount: row.message_count,
  errorMessage: row.error_message,
  isPublic: row.is_public,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const getSessionById = async (id: string): Promise<Session | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, status, message_count, error_message, is_public, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToSession(data);
};

export const getSessionByIdWithStoragePath = async (
  id: string,
): Promise<(Session & { storagePath: string | null }) | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, status, message_count, error_message, is_public, created_at, updated_at, storage_path")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return { ...mapRowToSession(data), storagePath: data.storage_path };
};

export const createSession = async (session: {
  id: string;
  userId: string;
  title?: string;
  isPublic: boolean;
  status: Session["status"];
  storagePath: string;
}): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").insert({
    id: session.id,
    user_id: session.userId,
    title: session.title,
    is_public: session.isPublic,
    status: session.status,
    storage_path: session.storagePath,
  });

  if (error) {
    console.error("Session insert failed:", error);
    throw new Error("Failed to create session. Please try again.");
  }
};

export const updateSessionStatus = async (
  id: string,
  status: Session["status"],
  extra?: { messageCount?: number; errorMessage?: string },
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      status,
      message_count: extra?.messageCount,
      error_message: extra?.errorMessage,
    })
    .eq("id", id);

  if (error) {
    console.error("Session update failed:", error);
    throw new Error("Failed to update session.");
  }
};

// Storage operations
export const uploadSessionJsonl = async (
  storagePath: string,
  content: string,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("sessions")
    .upload(storagePath, content, {
      contentType: "application/jsonl",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload failed:", error);
    throw new Error("Failed to upload session. Please try again.");
  }
};

export const downloadSessionJsonl = async (
  storagePath: string,
): Promise<string> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from("sessions")
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Download failed: ${error?.message}`);
  }

  return data.text();
};

export const deleteSessionFile = async (storagePath: string): Promise<void> => {
  const supabase = createServiceClient();
  await supabase.storage.from("sessions").remove([storagePath]);
};
```

**Step 2: Commit**

```bash
git add packages/web/lib/repos/sessions.repo.ts
git commit -m "feat(repos): add sessions repository with storage operations"
```

---

### Task 4: Create Messages Repository

**Files:**
- Create: `packages/web/lib/repos/messages.repo.ts`

**Step 1: Write messages repo**

```typescript
// packages/web/lib/repos/messages.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { Message } from "@/lib/types/domain";
import type { ContentBlock } from "@/lib/types/message";
import type { TablesInsert, Json } from "@/lib/supabase/database.types";

const mapRowToMessage = (row: {
  id: number;
  idx: number;
  role: string | null;
  model: string | null;
  content: Json;
  has_tool_calls: boolean;
  tool_names: string[];
  text_preview: string;
}): Message => ({
  id: row.id,
  idx: row.idx,
  role: row.role as Message["role"],
  model: row.model,
  content: row.content as unknown as ContentBlock[],
  hasToolCalls: row.has_tool_calls,
  toolNames: row.tool_names,
  textPreview: row.text_preview,
});

export const getMessagesBySessionId = async (
  sessionId: string,
  options?: { excludeMeta?: boolean; excludeSidechain?: boolean },
): Promise<Message[]> => {
  const supabase = createServiceClient();
  let query = supabase
    .from("messages")
    .select("id, idx, role, model, content, has_tool_calls, tool_names, text_preview")
    .eq("session_id", sessionId);

  if (options?.excludeMeta) {
    query = query.eq("is_meta", false);
  }
  if (options?.excludeSidechain) {
    query = query.eq("is_sidechain", false);
  }

  const { data, error } = await query.order("idx", { ascending: true });

  if (error || !data) return [];
  return data.map(mapRowToMessage);
};

export const insertMessagesBatch = async (
  messages: Array<{
    sessionId: string;
    idx: number;
    uuid: string;
    parentUuid: string | null;
    type: string;
    role: string | null;
    model: string | null;
    timestamp: string;
    isMeta: boolean;
    isSidechain: boolean;
    content: ContentBlock[];
    hasToolCalls: boolean;
    toolNames: string[];
    textPreview: string;
    rawMessage: unknown;
  }>,
): Promise<void> => {
  const supabase = createServiceClient();

  const rows = messages.map((m) => ({
    session_id: m.sessionId,
    idx: m.idx,
    uuid: m.uuid,
    parent_uuid: m.parentUuid,
    type: m.type,
    role: m.role,
    model: m.model,
    timestamp: m.timestamp,
    is_meta: m.isMeta,
    is_sidechain: m.isSidechain,
    content: m.content as unknown as Json,
    has_tool_calls: m.hasToolCalls,
    tool_names: m.toolNames,
    text_preview: m.textPreview,
    raw_message: m.rawMessage as Json,
  }));

  const { error } = await supabase
    .from("messages")
    .insert(rows as TablesInsert<"messages">[]);

  if (error) {
    throw new Error(`Message insert failed: ${error.message}`);
  }
};
```

**Step 2: Commit**

```bash
git add packages/web/lib/repos/messages.repo.ts
git commit -m "feat(repos): add messages repository"
```

---

### Task 5: Create CLI Auth Repository

**Files:**
- Create: `packages/web/lib/repos/cli-auth.repo.ts`

**Step 1: Write CLI auth repo**

```typescript
// packages/web/lib/repos/cli-auth.repo.ts
import { createServiceClient } from "@/lib/supabase/service";
import type { CliAuthSession, Profile } from "@/lib/types/domain";

const mapRowToCliAuthSession = (row: {
  id: string;
  session_token: string;
  user_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  completed_at: string | null;
}): CliAuthSession => ({
  id: row.id,
  sessionToken: row.session_token,
  userId: row.user_id,
  accessToken: row.access_token,
  refreshToken: row.refresh_token,
  expiresAt: row.expires_at ? new Date(row.expires_at) : null,
  completedAt: row.completed_at ? new Date(row.completed_at) : null,
});

export const createCliAuthSession = async (
  sessionToken: string,
  expiresAt: Date,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase.from("cli_auth_sessions").insert({
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create auth session:", error);
    throw new Error("Failed to create auth session");
  }
};

export const getCliAuthSessionByToken = async (
  sessionToken: string,
): Promise<(CliAuthSession & { profile: Profile | null }) | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("session_token", sessionToken)
    .single();

  if (error || !data) return null;

  const profile = data.profiles as {
    id: string;
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  } | null;

  return {
    ...mapRowToCliAuthSession(data),
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatar_url,
        }
      : null,
  };
};

export const completeCliAuthSession = async (
  sessionToken: string,
  userId: string,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("cli_auth_sessions")
    .update({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      completed_at: new Date().toISOString(),
    })
    .eq("session_token", sessionToken);

  if (error) {
    console.error("Failed to complete auth session:", error);
    throw new Error("Failed to complete auth session");
  }
};
```

**Step 2: Commit**

```bash
git add packages/web/lib/repos/cli-auth.repo.ts
git commit -m "feat(repos): add CLI auth repository"
```

---

### Task 6: Create Repo Index File

**Files:**
- Create: `packages/web/lib/repos/index.ts`

**Step 1: Write index file**

```typescript
// packages/web/lib/repos/index.ts
export * from "./profiles.repo";
export * from "./sessions.repo";
export * from "./messages.repo";
export * from "./cli-auth.repo";
```

**Step 2: Commit**

```bash
git add packages/web/lib/repos/index.ts
git commit -m "feat(repos): add repo index file"
```

---

### Task 7: Refactor Session Viewer Page

**Files:**
- Modify: `packages/web/app/s/[id]/page.tsx`

**Step 1: Update imports and use repos**

Replace direct Supabase calls with repo calls:

```typescript
// Before
const supabase = createServiceClient();
const { data: session } = await supabase.from("sessions").select(...)
const { data: messages } = await supabase.from("messages").select(...)

// After
import { getSessionById } from "@/lib/repos/sessions.repo";
import { getMessagesBySessionId } from "@/lib/repos/messages.repo";

const session = await getSessionById(id);
const messages = await getMessagesBySessionId(id, { excludeMeta: true, excludeSidechain: true });
```

**Step 2: Remove DbMessage interface**

The page should use `Message` from domain types, not a local interface.

**Step 3: Run type-check**

```bash
bun type-check
```

**Step 4: Commit**

```bash
git add packages/web/app/s/[id]/page.tsx
git commit -m "refactor(page): use repos instead of direct Supabase calls"
```

---

### Task 8: Refactor tRPC Sessions Router

**Files:**
- Modify: `packages/web/src/trpc/routers/sessions.ts`

**Step 1: Update imports and use repos**

```typescript
// Before
await serviceSupabase.from("profiles").upsert(...)
await serviceSupabase.from("sessions").insert(...)
await serviceSupabase.storage.from("sessions").upload(...)

// After
import { upsertProfile } from "@/lib/repos/profiles.repo";
import { createSession, uploadSessionJsonl, deleteSessionFile, getSessionById } from "@/lib/repos/sessions.repo";

await upsertProfile({ id: user.id, email: user.email, ... });
await uploadSessionJsonl(storagePath, input.conversation_data);
await createSession({ id, userId: user.id, ... });
```

**Step 2: Run type-check**

```bash
bun type-check
```

**Step 3: Commit**

```bash
git add packages/web/src/trpc/routers/sessions.ts
git commit -m "refactor(trpc): use repos in sessions router"
```

---

### Task 9: Refactor tRPC Auth Router

**Files:**
- Modify: `packages/web/src/trpc/routers/auth.ts`

**Step 1: Update to use CLI auth repo**

```typescript
// Before
const { error } = await supabase.from("cli_auth_sessions").insert(...)
const { data: session } = await supabase.from("cli_auth_sessions").select(...)

// After
import { createCliAuthSession, getCliAuthSessionByToken } from "@/lib/repos/cli-auth.repo";

await createCliAuthSession(sessionToken, expiresAt);
const session = await getCliAuthSessionByToken(input.code);
```

**Step 2: Run type-check**

```bash
bun type-check
```

**Step 3: Commit**

```bash
git add packages/web/src/trpc/routers/auth.ts
git commit -m "refactor(trpc): use repos in auth router"
```

---

### Task 10: Refactor Process Session Route

**Files:**
- Modify: `packages/web/app/api/internal/process-session/route.ts`

**Step 1: Update to use repos**

```typescript
// Before
await supabase.from("sessions").select(...)
await supabase.storage.from("sessions").download(...)
await supabase.from("messages").insert(...)
await supabase.from("sessions").update(...)

// After
import { getSessionByIdWithStoragePath, downloadSessionJsonl, updateSessionStatus } from "@/lib/repos/sessions.repo";
import { insertMessagesBatch } from "@/lib/repos/messages.repo";

const session = await getSessionByIdWithStoragePath(session_id);
const jsonlContent = await downloadSessionJsonl(session.storagePath);
await insertMessagesBatch(messages);
await updateSessionStatus(session_id, "ready", { messageCount: messages.length });
```

**Step 2: Run type-check**

```bash
bun type-check
```

**Step 3: Commit**

```bash
git add packages/web/app/api/internal/process-session/route.ts
git commit -m "refactor(api): use repos in process-session route"
```

---

### Task 11: Refactor CLI Auth Page

**Files:**
- Modify: `packages/web/app/cli/auth/page.tsx`

**Step 1: Update to use repos**

```typescript
// Before
await supabase.from("cli_auth_sessions").select(...)
await supabase.from("cli_auth_sessions").update(...)

// After
import { getCliAuthSessionByToken, completeCliAuthSession } from "@/lib/repos/cli-auth.repo";

const authSession = await getCliAuthSessionByToken(code);
await completeCliAuthSession(code, session.user.id, session.access_token, session.refresh_token);
```

**Step 2: Run type-check**

```bash
bun type-check
```

**Step 3: Commit**

```bash
git add packages/web/app/cli/auth/page.tsx
git commit -m "refactor(page): use repos in CLI auth page"
```

---

### Task 12: Refactor Dashboard Page

**Files:**
- Modify: `packages/web/app/dashboard/page.tsx`

**Step 1: Update to use repos**

```typescript
// Before
await supabase.from("profiles").select(...)

// After
import { getProfileById } from "@/lib/repos/profiles.repo";

const profile = await getProfileById(user.id);
```

**Step 2: Run type-check**

```bash
bun type-check
```

**Step 3: Commit**

```bash
git add packages/web/app/dashboard/page.tsx
git commit -m "refactor(page): use repos in dashboard page"
```

---

### Task 13: Final Type-Check and Test

**Step 1: Run full type-check**

```bash
bun type-check
```

**Step 2: Run biome check**

```bash
bun check
```

**Step 3: Test manually**

- Run `bun dev`
- Test `/share` command
- View a session at `/s/[id]`

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: clean up after DAL refactor"
```

---

## Verification Checklist

1. [ ] No `.from()` calls outside `lib/repos/`
2. [ ] All pages/routes use domain types from `lib/types/domain.ts`
3. [ ] Type-check passes
4. [ ] `/share` command works end-to-end
5. [ ] Session viewer renders correctly
6. [ ] CLI auth flow works

## Future Improvements

1. **Add Zod validation** - Parse repo outputs for critical paths (auth, permissions)
2. **Add lint rules** - Enforce that only `lib/repos/` can import Supabase client
3. **Add server client typing** - Type browser/server clients with Database too
