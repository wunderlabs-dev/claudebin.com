# Auth Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the device authorization flow so users can authenticate the Claude Code plugin with Claudebin.

**Architecture:** Plugin calls `/api/auth/start` to get a code, user visits `/cli/auth?code=X` and signs in via Supabase Auth, plugin polls `/api/auth/poll` until success, receives Claudebin token.

**Tech Stack:** Next.js 15, Supabase Auth, @supabase/ssr, nanoid

---

## Prerequisites

- Supabase project created with `cli_auth_sessions` table (migration exists)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Task 1: Create Supabase Client Utilities

**Files:**
- Create: `packages/web/lib/supabase/server.ts`
- Create: `packages/web/lib/supabase/client.ts`

**Step 1: Create server-side Supabase client**

```typescript
// packages/web/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
};
```

**Step 2: Create client-side Supabase client**

```typescript
// packages/web/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
```

**Step 3: Verify files exist**

Run: `ls packages/web/lib/supabase/`
Expected: `server.ts  client.ts`

**Step 4: Commit**

```bash
git add packages/web/lib/
git commit -m "feat: add Supabase client utilities for web app"
```

---

### Task 2: Implement POST /api/auth/start

**Files:**
- Modify: `packages/web/app/api/auth/start/route.ts`

**Step 1: Update the route to create real codes**

```typescript
// packages/web/app/api/auth/start/route.ts
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return "http://localhost:3000";
};

export const POST = async () => {
  const supabase = await createClient();
  const code = nanoid(21);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error } = await supabase.from("cli_auth_sessions").insert({
    code,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Failed to create auth session:", error);
    return NextResponse.json(
      { error: "Failed to create auth session" },
      { status: 500 },
    );
  }

  const baseUrl = getBaseUrl();

  return NextResponse.json({
    code,
    url: `${baseUrl}/cli/auth?code=${code}`,
    expires_at: expiresAt.toISOString(),
  });
};
```

**Step 2: Add nanoid dependency**

Run: `bun add nanoid --filter claudebin-web`

**Step 3: Verify type-check passes**

Run: `bun --filter claudebin-web type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/web/
git commit -m "feat: implement /api/auth/start with real code generation"
```

---

### Task 3: Implement GET /api/auth/poll

**Files:**
- Modify: `packages/web/app/api/auth/poll/route.ts`

**Step 1: Update the route to check database**

```typescript
// packages/web/app/api/auth/poll/route.ts
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("cli_auth_sessions")
    .select("*, profiles(*)")
    .eq("code", code)
    .single();

  if (error || !session) {
    return NextResponse.json({ status: "expired" });
  }

  // Check if code expired
  if (new Date(session.expires_at) < new Date()) {
    return NextResponse.json({ status: "expired" });
  }

  // Check if auth completed
  if (session.completed_at && session.user_id && session.access_token) {
    return NextResponse.json({
      status: "success",
      token: session.access_token,
      user: {
        id: session.profiles.id,
        username: session.profiles.username,
        avatar_url: session.profiles.avatar_url,
      },
    });
  }

  return NextResponse.json({ status: "pending" });
};
```

**Step 2: Verify type-check passes**

Run: `bun --filter claudebin-web type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/app/api/auth/poll/
git commit -m "feat: implement /api/auth/poll with database lookup"
```

---

### Task 4: Create Auth Callback Route

**Files:**
- Create: `packages/web/app/auth/callback/route.ts`

**Step 1: Create OAuth callback handler**

This handles the redirect from Supabase Auth after user signs in.

```typescript
// packages/web/app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const cliCode = requestUrl.searchParams.get("cli_code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/cli/auth?error=auth_failed`,
      );
    }

    // If this was a CLI auth flow, associate the code with the user
    if (cliCode && data.session) {
      const { error: updateError } = await supabase
        .from("cli_auth_sessions")
        .update({
          user_id: data.session.user.id,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          completed_at: new Date().toISOString(),
        })
        .eq("code", cliCode)
        .is("completed_at", null);

      if (updateError) {
        console.error("Failed to update CLI auth session:", updateError);
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/cli/auth?code=${cliCode}&success=true`,
      );
    }

    return NextResponse.redirect(requestUrl.origin);
  }

  return NextResponse.redirect(requestUrl.origin);
};
```

**Step 2: Verify type-check passes**

Run: `bun --filter claudebin-web type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/app/auth/
git commit -m "feat: add auth callback route for Supabase OAuth"
```

---

### Task 5: Update CLI Auth Page with Supabase Auth

**Files:**
- Modify: `packages/web/app/cli/auth/page.tsx`

**Step 1: Replace stub with working auth UI**

```typescript
// packages/web/app/cli/auth/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const AuthContent = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  if (!code) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-400">Invalid Link</h1>
        <p className="text-neutral-400">
          This authentication link is missing the required code parameter.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h1 className="mb-2 text-2xl font-bold text-green-400">
          Authenticated!
        </h1>
        <p className="text-neutral-400">
          You can close this window and return to your terminal.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-400">
          Authentication Failed
        </h1>
        <p className="text-neutral-400">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  const handleSignIn = async (provider: "github" | "google") => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?cli_code=${code}`,
      },
    });

    if (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold">Sign in to Claudebin</h1>
      <p className="mb-8 text-neutral-400">
        Sign in to link your account with the CLI.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSignIn("github")}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-neutral-800 px-6 py-3 font-medium transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          <GitHubIcon />
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={() => handleSignIn("google")}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-neutral-800 px-6 py-3 font-medium transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Code: <code className="text-neutral-400">{code.slice(0, 8)}...</code>
      </p>
    </div>
  );
};

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AuthPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <Suspense
          fallback={
            <div className="text-center text-neutral-400">Loading...</div>
          }
        >
          <AuthContent />
        </Suspense>
      </div>
    </main>
  );
};

export default AuthPage;
```

**Step 2: Verify type-check passes**

Run: `bun --filter claudebin-web type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/web/app/cli/auth/
git commit -m "feat: implement CLI auth page with GitHub/Google sign-in"
```

---

### Task 6: Create Environment Variables Template

**Files:**
- Create: `packages/web/.env.example`

**Step 1: Create env template**

```bash
# packages/web/.env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 2: Add to gitignore if not already**

Verify `.env.local` is in `.gitignore` (Next.js default)

**Step 3: Commit**

```bash
git add packages/web/.env.example
git commit -m "docs: add environment variables template for web app"
```

---

### Task 7: Test Full Flow Locally

**Prerequisites:**
- Copy `packages/web/.env.example` to `packages/web/.env.local`
- Fill in real Supabase credentials
- Enable GitHub and Google OAuth in Supabase dashboard

**Step 1: Start the dev server**

Run: `bun dev`

**Step 2: Test /api/auth/start**

Run: `curl -X POST http://localhost:3000/api/auth/start`
Expected: `{"code":"<21-char-code>","url":"http://localhost:3000/cli/auth?code=...","expires_at":"..."}`

**Step 3: Visit the auth URL in browser**

Open the URL from step 2, sign in with GitHub or Google.
Expected: Redirects to success page "✓ Authenticated!"

**Step 4: Test /api/auth/poll**

Run: `curl "http://localhost:3000/api/auth/poll?code=<code-from-step-2>"`
Expected: `{"status":"success","token":"...","user":{...}}`

**Step 5: Test with plugin**

Build MCP server: `bun --filter claudebin-mcp build`
Start Claude with plugin: `claude --plugin-dir ./packages/plugin`
Run: `/auth`
Expected: Shows URL, after visiting and signing in, shows "You're now authenticated as @username"

**Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during auth flow testing"
```

---

### Task 8: Update CLAUDE.md with Auth Commands

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add plugin commands to documentation**

Add under Commands section:

```markdown
# Plugin (local development)
claude --plugin-dir ./packages/plugin   # Start with plugin loaded
```

Add new section:

```markdown
## Plugin Commands

When running with `--plugin-dir ./packages/plugin`:
- `/share` - Extract current session as JSONL
- `/auth` - Authenticate with Claudebin
- `/whoami` - Check current authentication status
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add plugin commands to CLAUDE.md"
```

---

## Summary

After completing all tasks, the auth flow will work as follows:

1. User runs `/auth` in Claude Code
2. Plugin calls `POST /api/auth/start`, creates code in database
3. User visits URL, signs in via GitHub or Google
4. Auth callback updates `cli_auth_sessions` with user info and token
5. Plugin polls `GET /api/auth/poll`, receives success with token
6. Plugin saves token to `~/.claudebin/config.json`
7. User is authenticated and can use `/share` to upload sessions
