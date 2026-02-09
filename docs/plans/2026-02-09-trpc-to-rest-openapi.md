# tRPC to REST + OpenAPI Migration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace tRPC with plain REST endpoints + OpenAPI spec generation for type-safe plugin development.

**Architecture:** Web exposes REST endpoints with Zod validation, generates OpenAPI spec from schemas using `@asteasolutions/zod-to-openapi`. Plugin generates TypeScript types from the spec using `openapi-typescript`, replacing tRPC client with typed fetch.

**Tech Stack:** Next.js API routes, Zod, @asteasolutions/zod-to-openapi, openapi-typescript

---

## Phase 1: Web - Create Shared API Schemas

### Task 1: Install OpenAPI dependencies

**Files:**
- Modify: `packages/web/package.json`

**Step 1: Add dependencies**

```bash
cd packages/web && bun add @asteasolutions/zod-to-openapi
```

**Step 2: Verify installation**

```bash
bun pm ls | grep zod-to-openapi
```

Expected: `@asteasolutions/zod-to-openapi` listed

**Step 3: Commit**

```bash
git add packages/web/package.json packages/web/bun.lockb
git commit -m "chore(web): add zod-to-openapi dependency"
```

---

### Task 2: Create shared API schemas for auth endpoints

**Files:**
- Create: `packages/web/src/api/schemas/auth.ts`

**Step 1: Create the schemas file**

```typescript
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============ auth.start ============

export const authStartResponseSchema = z
  .object({
    code: z.string(),
    url: z.string().url(),
    expires_at: z.string().datetime(),
  })
  .openapi("AuthStartResponse");

// ============ auth.poll ============

export const authPollInputSchema = z
  .object({
    code: z.string(),
  })
  .openapi("AuthPollInput");

export const PollStatus = {
  PENDING: "pending",
  EXPIRED: "expired",
  SUCCESS: "success",
} as const;

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    avatar_url: z.string().nullable(),
  })
  .openapi("User");

export const authPollResponseSchema = z
  .discriminatedUnion("status", [
    z.object({ status: z.literal(PollStatus.PENDING) }),
    z.object({ status: z.literal(PollStatus.EXPIRED) }),
    z.object({
      status: z.literal(PollStatus.SUCCESS),
      token: z.string(),
      refresh_token: z.string(),
      user: userSchema,
    }),
  ])
  .openapi("AuthPollResponse");

// ============ auth.refresh ============

export const authRefreshInputSchema = z
  .object({
    refresh_token: z.string(),
  })
  .openapi("AuthRefreshInput");

export const authRefreshResponseSchema = z
  .discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number().optional(),
    }),
    z.object({
      success: z.literal(false),
      error: z.string().optional(),
    }),
  ])
  .openapi("AuthRefreshResponse");

// ============ auth.validate ============

export const authValidateInputSchema = z
  .object({
    token: z.string(),
  })
  .openapi("AuthValidateInput");

export const authValidateResponseSchema = z
  .object({
    valid: z.boolean(),
  })
  .openapi("AuthValidateResponse");

// ============ Type exports ============

export type AuthStartResponse = z.infer<typeof authStartResponseSchema>;
export type AuthPollInput = z.infer<typeof authPollInputSchema>;
export type AuthPollResponse = z.infer<typeof authPollResponseSchema>;
export type AuthRefreshInput = z.infer<typeof authRefreshInputSchema>;
export type AuthRefreshResponse = z.infer<typeof authRefreshResponseSchema>;
export type AuthValidateInput = z.infer<typeof authValidateInputSchema>;
export type AuthValidateResponse = z.infer<typeof authValidateResponseSchema>;
export type User = z.infer<typeof userSchema>;
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/api/schemas/auth.ts
git commit -m "feat(web): add OpenAPI schemas for auth endpoints"
```

---

### Task 3: Create shared API schemas for sessions endpoints

**Files:**
- Create: `packages/web/src/api/schemas/sessions.ts`

**Step 1: Create the schemas file**

```typescript
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============ sessions.publish ============

export const sessionsPublishInputSchema = z
  .object({
    title: z.string().optional(),
    conversation_data: z.string(),
    is_public: z.boolean().default(true),
    access_token: z.string(),
  })
  .openapi("SessionsPublishInput");

export const SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

export const sessionsPublishResponseSchema = z
  .object({
    id: z.string(),
    status: z.enum([SessionStatus.PROCESSING, SessionStatus.READY, SessionStatus.FAILED]),
  })
  .openapi("SessionsPublishResponse");

// ============ sessions.poll ============

export const sessionsPollInputSchema = z
  .object({
    id: z.string(),
  })
  .openapi("SessionsPollInput");

export const sessionsPollResponseSchema = z
  .discriminatedUnion("status", [
    z.object({ status: z.literal(SessionStatus.PROCESSING) }),
    z.object({ status: z.literal(SessionStatus.READY), url: z.string().url() }),
    z.object({ status: z.literal(SessionStatus.FAILED), error: z.string() }),
  ])
  .openapi("SessionsPollResponse");

// ============ Type exports ============

export type SessionsPublishInput = z.infer<typeof sessionsPublishInputSchema>;
export type SessionsPublishResponse = z.infer<typeof sessionsPublishResponseSchema>;
export type SessionsPollInput = z.infer<typeof sessionsPollInputSchema>;
export type SessionsPollResponse = z.infer<typeof sessionsPollResponseSchema>;
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/api/schemas/sessions.ts
git commit -m "feat(web): add OpenAPI schemas for sessions endpoints"
```

---

### Task 4: Create schema index file

**Files:**
- Create: `packages/web/src/api/schemas/index.ts`

**Step 1: Create index file**

```typescript
export * from "./auth";
export * from "./sessions";
```

**Step 2: Commit**

```bash
git add packages/web/src/api/schemas/index.ts
git commit -m "feat(web): add schemas index"
```

---

## Phase 2: Web - Create REST API Routes

### Task 5: Create auth/start REST endpoint

**Files:**
- Create: `packages/web/src/app/api/auth/start/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { config } from "@/supabase/config/env";
import { cliAuth } from "@/supabase/repos/cli-auth";
import { createServiceClient } from "@/supabase/service";
import { AUTH_SESSION_TIMEOUT_MS, AUTH_TOKEN_LENGTH } from "@/utils/constants";
import type { AuthStartResponse } from "@/api/schemas/auth";

export const POST = async (): Promise<NextResponse<AuthStartResponse>> => {
  const supabase = createServiceClient();
  const sessionToken = nanoid(AUTH_TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + AUTH_SESSION_TIMEOUT_MS);

  await cliAuth.create(supabase, {
    sessionToken,
    expiresAt: expiresAt.toISOString(),
  });

  return NextResponse.json({
    code: sessionToken,
    url: `${config.appUrl}/cli/auth?code=${sessionToken}`,
    expires_at: expiresAt.toISOString(),
  });
};
```

**Step 2: Verify route works**

```bash
cd packages/web && bun dev &
sleep 3
curl -X POST http://localhost:3000/api/auth/start
```

Expected: JSON with `code`, `url`, `expires_at`

**Step 3: Commit**

```bash
git add packages/web/src/app/api/auth/start/route.ts
git commit -m "feat(web): add REST endpoint for auth/start"
```

---

### Task 6: Create auth/poll REST endpoint

**Files:**
- Create: `packages/web/src/app/api/auth/poll/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse, type NextRequest } from "next/server";

import { cliAuth } from "@/supabase/repos/cli-auth";
import { createServiceClient } from "@/supabase/service";
import { authPollInputSchema, PollStatus, type AuthPollResponse } from "@/api/schemas/auth";

export const GET = async (request: NextRequest): Promise<NextResponse<AuthPollResponse>> => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const parsed = authPollInputSchema.safeParse({ code });
  if (!parsed.success) {
    return NextResponse.json({ status: PollStatus.EXPIRED }, { status: 400 });
  }

  const supabase = createServiceClient();
  const session = await cliAuth.getByToken(supabase, parsed.data.code);

  if (!session) {
    return NextResponse.json({ status: PollStatus.EXPIRED });
  }

  if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ status: PollStatus.EXPIRED });
  }

  if (session.completedAt) {
    if (!session.accessToken || !session.refreshToken || !session.userId) {
      return NextResponse.json({ status: PollStatus.EXPIRED });
    }

    return NextResponse.json({
      status: PollStatus.SUCCESS,
      token: session.accessToken,
      refresh_token: session.refreshToken,
      user: {
        id: session.profile?.id ?? session.userId,
        name: session.profile?.name ?? null,
        email: session.profile?.email ?? null,
        avatar_url: session.profile?.avatarUrl ?? null,
      },
    });
  }

  return NextResponse.json({ status: PollStatus.PENDING });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/app/api/auth/poll/route.ts
git commit -m "feat(web): add REST endpoint for auth/poll"
```

---

### Task 7: Create auth/refresh REST endpoint

**Files:**
- Create: `packages/web/src/app/api/auth/refresh/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/supabase/service";
import { authRefreshInputSchema, type AuthRefreshResponse } from "@/api/schemas/auth";

export const POST = async (request: NextRequest): Promise<NextResponse<AuthRefreshResponse>> => {
  const body = await request.json();
  const parsed = authRefreshInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
  });

  if (error || !data.session) {
    return NextResponse.json({ success: false, error: error?.message ?? "Failed to refresh" });
  }

  return NextResponse.json({
    success: true,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/app/api/auth/refresh/route.ts
git commit -m "feat(web): add REST endpoint for auth/refresh"
```

---

### Task 8: Create auth/validate REST endpoint

**Files:**
- Create: `packages/web/src/app/api/auth/validate/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/supabase/service";
import { authValidateInputSchema, type AuthValidateResponse } from "@/api/schemas/auth";

export const GET = async (request: NextRequest): Promise<NextResponse<AuthValidateResponse>> => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const parsed = authValidateInputSchema.safeParse({ token });
  if (!parsed.success) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.auth.getUser(parsed.data.token);

  return NextResponse.json({ valid: !error && !!data.user });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/app/api/auth/validate/route.ts
git commit -m "feat(web): add REST endpoint for auth/validate"
```

---

### Task 9: Create sessions/publish REST endpoint

**Files:**
- Create: `packages/web/src/app/api/sessions/publish/route.ts`

**Step 1: Create the route**

```typescript
import { nanoid } from "nanoid";
import { after } from "next/server";
import { NextResponse, type NextRequest } from "next/server";

import { sessions } from "@/supabase/repos/sessions";
import { processSession } from "@/supabase/services/processor";
import { createServiceClient } from "@/supabase/service";
import { SESSION_MAX_SIZE_BYTES, SESSION_ID_LENGTH } from "@/utils/constants";
import {
  sessionsPublishInputSchema,
  SessionStatus,
  type SessionsPublishResponse,
} from "@/api/schemas/sessions";

export const POST = async (request: NextRequest): Promise<NextResponse<SessionsPublishResponse | { error: string }>> => {
  const body = await request.json();
  const parsed = sessionsPublishInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { title, conversation_data, is_public, access_token } = parsed.data;

  const serviceSupabase = createServiceClient();

  // Verify the token and get user
  const {
    data: { user },
    error: authError,
  } = await serviceSupabase.auth.getUser(access_token);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Validate size
  const sizeBytes = new TextEncoder().encode(conversation_data).length;
  if (sizeBytes > SESSION_MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit` },
      { status: 400 }
    );
  }

  // Generate IDs and paths
  const id = nanoid(SESSION_ID_LENGTH);
  const storagePath = `${user.id}/${id}.jsonl`;

  // Upload to Storage
  await sessions.uploadJsonl(serviceSupabase, storagePath, conversation_data);

  // Insert session record with processing status
  try {
    await sessions.create(serviceSupabase, {
      id,
      userId: user.id,
      title,
      isPublic: is_public,
      status: SessionStatus.PROCESSING,
      storagePath,
    });
  } catch (error) {
    // Cleanup uploaded file on failure
    await sessions.deleteFile(serviceSupabase, storagePath);
    throw error;
  }

  after(() => processSession(serviceSupabase, id));

  return NextResponse.json({
    id,
    status: SessionStatus.PROCESSING,
  });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/app/api/sessions/publish/route.ts
git commit -m "feat(web): add REST endpoint for sessions/publish"
```

---

### Task 10: Create sessions/poll REST endpoint

**Files:**
- Create: `packages/web/src/app/api/sessions/poll/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse, type NextRequest } from "next/server";

import { config } from "@/supabase/config/env";
import { sessions } from "@/supabase/repos/sessions";
import { createServiceClient } from "@/supabase/service";
import { sessionsPollInputSchema, SessionStatus, type SessionsPollResponse } from "@/api/schemas/sessions";

export const GET = async (request: NextRequest): Promise<NextResponse<SessionsPollResponse>> => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const parsed = sessionsPollInputSchema.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ status: SessionStatus.FAILED, error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const session = await sessions.getById(supabase, parsed.data.id);

  if (!session) {
    return NextResponse.json({
      status: SessionStatus.FAILED,
      error: "Session not found",
    });
  }

  if (session.status === SessionStatus.PROCESSING) {
    return NextResponse.json({ status: SessionStatus.PROCESSING });
  }

  if (session.status === SessionStatus.FAILED) {
    return NextResponse.json({
      status: SessionStatus.FAILED,
      error: session.errorMessage || "Processing failed",
    });
  }

  return NextResponse.json({
    status: SessionStatus.READY,
    url: `${config.appUrl}/threads/${parsed.data.id}`,
  });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/app/api/sessions/poll/route.ts
git commit -m "feat(web): add REST endpoint for sessions/poll"
```

---

## Phase 3: Web - Generate OpenAPI Spec

### Task 11: Create OpenAPI spec generator

**Files:**
- Create: `packages/web/src/api/openapi.ts`

**Step 1: Create the generator**

```typescript
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

import {
  authStartResponseSchema,
  authPollInputSchema,
  authPollResponseSchema,
  authRefreshInputSchema,
  authRefreshResponseSchema,
  authValidateInputSchema,
  authValidateResponseSchema,
} from "./schemas/auth";

import {
  sessionsPublishInputSchema,
  sessionsPublishResponseSchema,
  sessionsPollInputSchema,
  sessionsPollResponseSchema,
} from "./schemas/sessions";

export const createOpenApiSpec = () => {
  const registry = new OpenAPIRegistry();

  // Auth endpoints
  registry.registerPath({
    method: "post",
    path: "/api/auth/start",
    summary: "Start CLI authentication flow",
    responses: {
      200: {
        description: "Authentication session created",
        content: { "application/json": { schema: authStartResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/auth/poll",
    summary: "Poll for authentication completion",
    request: { query: authPollInputSchema },
    responses: {
      200: {
        description: "Poll status",
        content: { "application/json": { schema: authPollResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/auth/refresh",
    summary: "Refresh access token",
    request: {
      body: { content: { "application/json": { schema: authRefreshInputSchema } } },
    },
    responses: {
      200: {
        description: "Token refresh result",
        content: { "application/json": { schema: authRefreshResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/auth/validate",
    summary: "Validate access token",
    request: { query: authValidateInputSchema },
    responses: {
      200: {
        description: "Validation result",
        content: { "application/json": { schema: authValidateResponseSchema } },
      },
    },
  });

  // Sessions endpoints
  registry.registerPath({
    method: "post",
    path: "/api/sessions/publish",
    summary: "Publish a Claude Code session",
    request: {
      body: { content: { "application/json": { schema: sessionsPublishInputSchema } } },
    },
    responses: {
      200: {
        description: "Session published",
        content: { "application/json": { schema: sessionsPublishResponseSchema } },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/sessions/poll",
    summary: "Poll for session processing status",
    request: { query: sessionsPollInputSchema },
    responses: {
      200: {
        description: "Processing status",
        content: { "application/json": { schema: sessionsPollResponseSchema } },
      },
    },
  });

  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Claudebin API",
      version: "1.0.0",
      description: "API for publishing and sharing Claude Code sessions",
    },
    servers: [
      { url: "https://claudebin.com", description: "Production" },
      { url: "http://localhost:3000", description: "Development" },
    ],
  });
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/web && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/src/api/openapi.ts
git commit -m "feat(web): add OpenAPI spec generator"
```

---

### Task 12: Create OpenAPI spec endpoint

**Files:**
- Create: `packages/web/src/app/api/openapi.json/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse } from "next/server";

import { createOpenApiSpec } from "@/api/openapi";

export const GET = () => {
  const spec = createOpenApiSpec();
  return NextResponse.json(spec);
};
```

**Step 2: Test the endpoint**

```bash
cd packages/web && bun dev &
sleep 3
curl http://localhost:3000/api/openapi.json | head -50
```

Expected: OpenAPI spec JSON

**Step 3: Commit**

```bash
git add packages/web/src/app/api/openapi.json/route.ts
git commit -m "feat(web): add OpenAPI spec endpoint"
```

---

## Phase 4: Web - Remove tRPC

### Task 13: Remove tRPC routes and dependencies

**Files:**
- Delete: `packages/web/src/app/api/trpc/[...trpc]/route.ts`
- Delete: `packages/web/src/trpc/init.ts`
- Delete: `packages/web/src/trpc/router.ts`
- Delete: `packages/web/src/trpc/routers/auth.ts`
- Delete: `packages/web/src/trpc/routers/sessions.ts`
- Modify: `packages/web/package.json`

**Step 1: Remove tRPC files**

```bash
rm -rf packages/web/src/app/api/trpc
rm -rf packages/web/src/trpc
```

**Step 2: Remove tRPC dependency**

```bash
cd packages/web && bun remove @trpc/server
```

**Step 3: Verify build still works**

```bash
cd packages/web && bun type-check && bun build
```

Expected: No errors

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor(web): remove tRPC in favor of REST + OpenAPI"
```

---

## Phase 5: Plugin - Generate Types from OpenAPI

### Task 14: Install openapi-typescript in plugin

**Files:**
- Modify: `packages/plugin/mcp/package.json`

**Step 1: Add dependency**

```bash
cd packages/plugin/mcp && bun add -D openapi-typescript
```

**Step 2: Add generate script to package.json**

Edit `packages/plugin/mcp/package.json` to add:

```json
{
  "scripts": {
    "generate-types": "openapi-typescript http://localhost:3000/api/openapi.json -o src/api.d.ts",
    "generate-types:prod": "openapi-typescript https://claudebin.com/api/openapi.json -o src/api.d.ts"
  }
}
```

**Step 3: Commit**

```bash
git add packages/plugin/mcp/package.json packages/plugin/mcp/bun.lockb
git commit -m "chore(plugin): add openapi-typescript for type generation"
```

---

### Task 15: Generate TypeScript types from OpenAPI

**Files:**
- Create: `packages/plugin/mcp/src/api.d.ts` (generated)

**Step 1: Start web dev server**

```bash
cd packages/web && bun dev &
sleep 3
```

**Step 2: Generate types**

```bash
cd packages/plugin/mcp && bun run generate-types
```

**Step 3: Verify file was created**

```bash
cat packages/plugin/mcp/src/api.d.ts | head -50
```

Expected: TypeScript type definitions

**Step 4: Commit generated types**

```bash
git add packages/plugin/mcp/src/api.d.ts
git commit -m "feat(plugin): generate API types from OpenAPI spec"
```

---

### Task 16: Create typed fetch client

**Files:**
- Create: `packages/plugin/mcp/src/api-client.ts`
- Delete: `packages/plugin/mcp/src/trpc.ts`
- Delete: `packages/plugin/mcp/src/router.d.ts`

**Step 1: Create the API client**

```typescript
import type { paths } from "./api.js";
import { getApiBaseUrl } from "./config.js";

type AuthStartResponse = paths["/api/auth/start"]["post"]["responses"]["200"]["content"]["application/json"];
type AuthPollResponse = paths["/api/auth/poll"]["get"]["responses"]["200"]["content"]["application/json"];
type AuthRefreshInput = paths["/api/auth/refresh"]["post"]["requestBody"]["content"]["application/json"];
type AuthRefreshResponse = paths["/api/auth/refresh"]["post"]["responses"]["200"]["content"]["application/json"];
type AuthValidateResponse = paths["/api/auth/validate"]["get"]["responses"]["200"]["content"]["application/json"];
type SessionsPublishInput = paths["/api/sessions/publish"]["post"]["requestBody"]["content"]["application/json"];
type SessionsPublishResponse = paths["/api/sessions/publish"]["post"]["responses"]["200"]["content"]["application/json"];
type SessionsPollResponse = paths["/api/sessions/poll"]["get"]["responses"]["200"]["content"]["application/json"];

export const createApiClient = () => {
  const baseUrl = getApiBaseUrl();

  return {
    auth: {
      start: async (): Promise<AuthStartResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/start`, { method: "POST" });
        return res.json();
      },
      poll: async (code: string): Promise<AuthPollResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/poll?code=${encodeURIComponent(code)}`);
        return res.json();
      },
      refresh: async (input: AuthRefreshInput): Promise<AuthRefreshResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        return res.json();
      },
      validate: async (token: string): Promise<AuthValidateResponse> => {
        const res = await fetch(`${baseUrl}/api/auth/validate?token=${encodeURIComponent(token)}`);
        return res.json();
      },
    },
    sessions: {
      publish: async (input: SessionsPublishInput): Promise<SessionsPublishResponse> => {
        const res = await fetch(`${baseUrl}/api/sessions/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        return res.json();
      },
      poll: async (id: string): Promise<SessionsPollResponse> => {
        const res = await fetch(`${baseUrl}/api/sessions/poll?id=${encodeURIComponent(id)}`);
        return res.json();
      },
    },
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
```

**Step 2: Delete old tRPC files**

```bash
rm packages/plugin/mcp/src/trpc.ts
rm packages/plugin/mcp/src/router.d.ts
```

**Step 3: Verify TypeScript compiles**

```bash
cd packages/plugin/mcp && bun type-check
```

Expected: Errors in files still importing from trpc.ts (will fix in next tasks)

**Step 4: Commit**

```bash
git add packages/plugin/mcp/src/api-client.ts
git rm packages/plugin/mcp/src/trpc.ts packages/plugin/mcp/src/router.d.ts
git commit -m "feat(plugin): replace tRPC client with typed fetch client"
```

---

### Task 17: Update auth.ts to use new API client

**Files:**
- Modify: `packages/plugin/mcp/src/auth.ts`

**Step 1: Update imports and implementation**

Replace the entire file with:

```typescript
import { createApiClient } from "./api-client.js";
import { getApiBaseUrl, readConfig, writeConfig } from "./config.js";
import {
  AUTH_POLL_TIMEOUT_MS,
  AUTH_TOKEN_TTL_MS,
  DEFAULT_TOKEN_TTL_MS,
  POLL_INTERVAL_MS,
  PollStatus,
  TOKEN_REFRESH_BUFFER_MS,
} from "./constants.js";
import type { Config, UserConfig } from "./types.js";
import { poll, safeOpenUrl } from "./utils.js";

interface AuthPollData {
  status: string;
  token?: string;
  refresh_token?: string;
  user?: UserConfig;
}

const pollForAuthCompletion = async (
  code: string,
  timeoutMs = AUTH_POLL_TIMEOUT_MS,
): Promise<{ token: string; refresh_token: string; user: UserConfig }> => {
  const api = createApiClient();

  const result = await poll<AuthPollData>({
    fn: async () => {
      const data = await api.auth.poll(code);
      return data as AuthPollData;
    },
    isSuccess: (data) =>
      data.status === PollStatus.SUCCESS &&
      data.token !== undefined &&
      data.refresh_token !== undefined &&
      data.user !== undefined,
    isFailure: (data) => data.status === "expired",
    getFailureError: () => "Authentication code expired",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Authentication timed out",
  });

  const { token, refresh_token, user } = result;

  if (!token || !refresh_token || !user) {
    throw new Error("Invalid authentication response");
  }

  return { token, refresh_token, user };
};

const start = async (): Promise<{ code: string; url: string }> => {
  const api = createApiClient();

  try {
    const data = await api.auth.start();
    return { code: data.code, url: data.url };
  } catch (error) {
    throw new Error(
      `Failed to connect to Claudebin: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const run = async (): Promise<string> => {
  const { code, url } = await start();
  safeOpenUrl(url);

  const { token, refresh_token, user } = await pollForAuthCompletion(code);

  const config: Config = {
    auth: {
      token,
      refresh_token,
      expires_at: Date.now() + AUTH_TOKEN_TTL_MS,
    },
    user,
  };
  await writeConfig(config);

  return token;
};

const refresh = async (): Promise<boolean> => {
  const config = await readConfig();

  if (!config.auth?.refresh_token) return false;

  const api = createApiClient();

  try {
    const result = await api.auth.refresh({
      refresh_token: config.auth.refresh_token,
    });

    if (!result.success) {
      return false;
    }

    await writeConfig({
      ...config,
      auth: {
        token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at
          ? result.expires_at * 1_000
          : Date.now() + DEFAULT_TOKEN_TTL_MS,
      },
    });

    return true;
  } catch {
    return false;
  }
};

const getLocalToken = async (): Promise<string | null> => {
  const config = await readConfig();

  if (!config.auth?.token) {
    return null;
  }

  if (!config.auth.expires_at || Date.now() > config.auth.expires_at - TOKEN_REFRESH_BUFFER_MS) {
    const refreshed = await refresh();
    if (!refreshed) {
      return null;
    }
    const refreshedConfig = await readConfig();
    return refreshedConfig.auth?.token ?? null;
  }

  return config.auth.token;
};

const validate = async (token: string): Promise<boolean> => {
  const api = createApiClient();

  try {
    const result = await api.auth.validate(token);
    return result.valid;
  } catch {
    return false;
  }
};

const getToken = async (): Promise<string> => {
  const localToken = await getLocalToken();

  if (localToken) {
    const isValid = await validate(localToken);
    if (isValid) {
      return localToken;
    }
  }

  return run();
};

export const auth = { run, validate, getToken, refresh };
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/plugin/mcp && bun type-check
```

Expected: No errors in auth.ts

**Step 3: Commit**

```bash
git add packages/plugin/mcp/src/auth.ts
git commit -m "refactor(plugin): update auth to use REST API client"
```

---

### Task 18: Update share.ts to use new API client

**Files:**
- Modify: `packages/plugin/mcp/src/tools/share.ts`

**Step 1: Update imports and implementation**

Replace the entire file with:

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createApiClient } from "../api-client.js";
import { auth } from "../auth.js";
import { getApiBaseUrl } from "../config.js";
import {
  MAX_SESSION_SIZE_BYTES,
  POLL_INTERVAL_MS,
  SESSION_POLL_TIMEOUT_MS,
  SessionStatus,
} from "../constants.js";
import { session } from "../session.js";
import { poll, safeOpenUrl } from "../utils.js";

interface SessionPollData {
  status: string;
  url?: string;
  error?: string;
}

const pollForProcessing = async (
  sessionId: string,
  timeoutMs = SESSION_POLL_TIMEOUT_MS,
): Promise<string> => {
  const api = createApiClient();

  const result = await poll<SessionPollData>({
    fn: async () => {
      const data = await api.sessions.poll(sessionId);
      return data as SessionPollData;
    },
    isSuccess: (data) => data.status === SessionStatus.READY && data.url !== undefined,
    isFailure: (data) => data.status === SessionStatus.FAILED,
    getFailureError: (data) => data.error || "Processing failed",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Processing timed out after 2 minutes",
  });

  if (!result.url) {
    throw new Error("Invalid session response");
  }

  return result.url;
};

export const registerShare = (server: McpServer): void => {
  server.registerTool(
    "share",
    {
      description:
        "Share the current Claude Code session to Claudebin. Authenticates automatically if needed.",
      inputSchema: {
        project_path: z.string().describe("Absolute path to the project directory"),
        title: z.string().optional().describe("Optional title for the session"),
        is_public: z
          .boolean()
          .default(true)
          .describe(
            "Whether the session appears in public listings (false = unlisted, accessible via link)",
          ),
      },
    },
    async ({ project_path, title, is_public }) => {
      try {
        const token = await auth.getToken();
        const content = await session.extract(project_path);

        const sizeBytes = new TextEncoder().encode(content).length;
        if (sizeBytes > MAX_SESSION_SIZE_BYTES) {
          throw new Error(
            `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`,
          );
        }

        const api = createApiClient();

        const result = await api.sessions.publish({
          title,
          conversation_data: content,
          is_public,
          access_token: token,
        });

        const url = await pollForProcessing(result.id);
        safeOpenUrl(url);

        return {
          content: [{ type: "text" as const, text: url }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: error instanceof Error ? error.message : String(error),
            },
          ],
          isError: true,
        };
      }
    },
  );
};
```

**Step 2: Verify TypeScript compiles**

```bash
cd packages/plugin/mcp && bun type-check
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/plugin/mcp/src/tools/share.ts
git commit -m "refactor(plugin): update share tool to use REST API client"
```

---

### Task 19: Remove tRPC dependency from plugin

**Files:**
- Modify: `packages/plugin/mcp/package.json`

**Step 1: Remove tRPC dependency**

```bash
cd packages/plugin/mcp && bun remove @trpc/client
```

**Step 2: Verify build works**

```bash
cd packages/plugin/mcp && bun type-check && bun build
```

Expected: No errors

**Step 3: Commit**

```bash
git add packages/plugin/mcp/package.json packages/plugin/mcp/bun.lockb
git commit -m "chore(plugin): remove tRPC dependency"
```

---

## Phase 6: Plugin Distribution Setup

### Task 20: Allow plugin dist to be committed

**Files:**
- Modify: `/.gitignore`

**Step 1: Update root .gitignore**

Add exception for plugin dist:

```gitignore
dist/
!packages/plugin/mcp/dist/
```

**Step 2: Build the MCP server**

```bash
cd packages/plugin/mcp && bun build
```

**Step 3: Verify dist exists**

```bash
ls -la packages/plugin/mcp/dist/
```

Expected: `index.js` file present

**Step 4: Add dist to git**

```bash
git add -f packages/plugin/mcp/dist/
```

**Step 5: Commit**

```bash
git add .gitignore packages/plugin/mcp/dist/
git commit -m "chore(plugin): commit built MCP server for distribution"
```

**Note:** After any changes to `packages/plugin/mcp/src/`, you must rebuild and commit the dist. Consider adding a CI check to verify dist is up to date with source.

---

## Phase 7: Final Verification

### Task 21: End-to-end test

**Step 1: Start web server**

```bash
cd packages/web && bun dev &
sleep 3
```

**Step 2: Test OpenAPI spec endpoint**

```bash
curl http://localhost:3000/api/openapi.json | jq '.paths | keys'
```

Expected: List of API paths

**Step 3: Test auth/start endpoint**

```bash
curl -X POST http://localhost:3000/api/auth/start | jq
```

Expected: JSON with code, url, expires_at

**Step 4: Test plugin MCP server starts**

```bash
cd packages/plugin && bun run mcp/dist/index.js
```

Expected: MCP server starts without errors (Ctrl+C to stop)

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete tRPC to REST + OpenAPI migration"
```

---

## Summary

**21 tasks across 7 phases**

**Web changes:**
- New: `src/api/schemas/` - Zod schemas with OpenAPI extensions
- New: `src/api/openapi.ts` - OpenAPI spec generator
- New: `src/app/api/auth/*` - REST auth endpoints
- New: `src/app/api/sessions/*` - REST sessions endpoints
- New: `src/app/api/openapi.json/` - OpenAPI spec endpoint
- Removed: `src/trpc/` - tRPC router and config
- Removed: `src/app/api/trpc/` - tRPC handler
- Removed: `@trpc/server` dependency

**Plugin changes:**
- New: `src/api.d.ts` - Generated types from OpenAPI
- New: `src/api-client.ts` - Typed fetch client
- Removed: `src/trpc.ts` - tRPC client
- Removed: `src/router.d.ts` - Manual type definitions
- Removed: `@trpc/client` dependency
- Added: `openapi-typescript` dev dependency
- Committed: `mcp/dist/` - Built MCP server for distribution

**Root changes:**
- Modified: `.gitignore` - Exception for plugin dist
