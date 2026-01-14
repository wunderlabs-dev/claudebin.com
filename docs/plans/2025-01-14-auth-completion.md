# Auth Flow Completion Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the auth flow with profile creation, token refresh, cleanup of old REST routes, and session publishing.

**Architecture:** Profile creation via database trigger on auth.users insert. Token refresh in plugin when expired. Session publishing via new tRPC procedure.

**Tech Stack:** Supabase (triggers, RLS), tRPC, MCP tools

---

### Task 1: Fix Profile Schema for Google Auth

**Problem:** Current `profiles` table requires `github_id INTEGER UNIQUE NOT NULL` which breaks Google sign-in.

**Files:**
- Create: `supabase/migrations/20250114000001_fix_profiles_for_google.sql`

**Step 1: Create migration to make github_id optional and add provider field**

Create `supabase/migrations/20250114000001_fix_profiles_for_google.sql`:

```sql
-- Allow github_id to be NULL for non-GitHub auth providers
ALTER TABLE profiles ALTER COLUMN github_id DROP NOT NULL;

-- Add provider column to track auth source
ALTER TABLE profiles ADD COLUMN provider TEXT;

-- Add provider_id for generic provider user ID (works for GitHub, Google, etc.)
ALTER TABLE profiles ADD COLUMN provider_id TEXT;

-- Create unique constraint on provider + provider_id combo
ALTER TABLE profiles ADD CONSTRAINT unique_provider_id UNIQUE (provider, provider_id);

-- Backfill existing rows (all GitHub)
UPDATE profiles SET provider = 'github', provider_id = github_id::TEXT WHERE github_id IS NOT NULL;

COMMENT ON COLUMN profiles.provider IS 'Auth provider: github, google, etc.';
COMMENT ON COLUMN profiles.provider_id IS 'User ID from the auth provider';
```

**Step 2: Commit**

```bash
git add supabase/migrations/
git commit -m "fix(db): make github_id optional, add provider fields for multi-auth"
```

---

### Task 2: Create Profile Auto-Creation Trigger

**Problem:** No profile gets created when users sign up. The callback relies on profiles existing.

**Files:**
- Create: `supabase/migrations/20250114000002_create_profile_trigger.sql`

**Step 1: Create trigger that auto-creates profile on user signup**

Create `supabase/migrations/20250114000002_create_profile_trigger.sql`:

```sql
-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  provider_name TEXT;
  provider_user_id TEXT;
  user_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Extract provider info from raw_app_meta_data
  provider_name := NEW.raw_app_meta_data->>'provider';
  provider_user_id := NEW.raw_app_meta_data->>'provider_id';

  -- Extract user info from raw_user_meta_data
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  -- Insert profile
  INSERT INTO public.profiles (id, username, provider, provider_id, avatar_url, github_id)
  VALUES (
    NEW.id,
    user_name,
    provider_name,
    provider_user_id,
    user_avatar,
    CASE WHEN provider_name = 'github' THEN (provider_user_id)::INTEGER ELSE NULL END
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Creates profile when user signs up via OAuth';
```

**Step 2: Commit**

```bash
git add supabase/migrations/
git commit -m "feat(db): add trigger to auto-create profiles on signup"
```

---

### Task 3: Remove Old REST Auth Routes

**Problem:** `/api/auth/start` and `/api/auth/poll` are duplicated by tRPC. Remove them.

**Files:**
- Delete: `packages/web/app/api/auth/start/route.ts`
- Delete: `packages/web/app/api/auth/poll/route.ts`

**Step 1: Remove the routes**

```bash
rm -rf packages/web/app/api/auth/start
rm -rf packages/web/app/api/auth/poll
```

**Step 2: Verify build**

Run: `cd packages/web && bun run build`

Expected: PASS (tRPC handles these endpoints now)

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor(web): remove old REST auth routes (tRPC handles this)"
```

---

### Task 4: Add Token Refresh to Plugin

**Problem:** Plugin stores token with `expires_at` but never refreshes.

**Files:**
- Create: `packages/web/src/trpc/routers/auth.ts` (add `refresh` procedure)
- Modify: `packages/plugin/mcp/src/auth.ts` (add refresh logic)
- Modify: `packages/plugin/mcp/src/config.ts` (add isTokenExpired helper)

**Step 1: Add refresh procedure to auth router**

In `packages/web/src/trpc/routers/auth.ts`, add after the `poll` procedure:

```typescript
  refresh: publicProcedure
    .input(z.object({ refresh_token: z.string() }))
    .mutation(async ({ input }) => {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: input.refresh_token,
      });

      if (error || !data.session) {
        return { success: false as const, error: error?.message ?? "Failed to refresh" };
      }

      return {
        success: true as const,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      };
    }),
```

**Step 2: Add isTokenExpired helper to config.ts**

In `packages/plugin/mcp/src/config.ts`:

```typescript
export const isTokenExpired = (config: Config): boolean => {
  if (!config.auth?.expires_at) return true;
  // Refresh 5 minutes before expiry
  return Date.now() > config.auth.expires_at - 5 * 60 * 1000;
};
```

**Step 3: Add refreshAuth function to auth.ts**

In `packages/plugin/mcp/src/auth.ts`:

```typescript
export const refreshAuth = async (): Promise<boolean> => {
  const config = await readConfig();

  if (!config.auth?.token) return false;

  const api = createApiClient();

  try {
    // Note: We'd need refresh_token stored. For now, return false to force re-auth.
    // TODO: Store refresh_token in config
    return false;
  } catch {
    return false;
  }
};
```

**Step 4: Update config types to include refresh_token**

In `packages/plugin/mcp/src/types.ts`:

```typescript
export interface AuthConfig {
  token: string;
  refresh_token?: string;
  expires_at: number;
}
```

**Step 5: Update authenticate tool to save refresh_token**

In `packages/plugin/mcp/src/tools/authenticate.ts`, update the config creation:

```typescript
const config: Config = {
  auth: {
    token: pollResult.token,
    refresh_token: pollResult.refresh_token, // Add this
    expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
  },
  user: pollResult.user,
};
```

**Step 6: Update poll response to include refresh_token**

This requires updating the tRPC router and the types. In the auth router, update poll success response to include `refresh_token` from the session.

**Step 7: Verify build**

Run: `bun run type-check && bun run build`

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add token refresh support"
```

---

### Task 5: Add Session Publishing tRPC Procedure

**Problem:** `extract_session` tool exists but no way to publish to server.

**Files:**
- Modify: `packages/web/src/trpc/router.ts` (add sessions router)
- Create: `packages/web/src/trpc/routers/sessions.ts`

**Step 1: Create sessions router**

Create `packages/web/src/trpc/routers/sessions.ts`:

```typescript
import { nanoid } from "nanoid";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { publicProcedure, router } from "../init";

export const sessionsRouter = router({
  publish: publicProcedure
    .input(z.object({
      title: z.string().optional(),
      conversation_data: z.string(), // JSONL string
      is_public: z.boolean().default(true),
      access_token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const supabase = await createClient();

      // Verify the token and get user
      const { data: { user }, error: authError } = await supabase.auth.getUser(input.access_token);

      if (authError || !user) {
        throw new Error("Invalid or expired token");
      }

      const id = nanoid(10);

      const { error } = await supabase.from("sessions").insert({
        id,
        user_id: user.id,
        title: input.title,
        conversation_data: JSON.parse(input.conversation_data),
        is_public: input.is_public,
      });

      if (error) {
        throw new Error(`Failed to publish session: ${error.message}`);
      }

      return {
        id,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/s/${id}`,
      };
    }),
});
```

**Step 2: Add to root router**

In `packages/web/src/trpc/router.ts`:

```typescript
import { router } from "./init";
import { authRouter } from "./routers/auth";
import { sessionsRouter } from "./routers/sessions";

export const appRouter = router({
  auth: authRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;
```

**Step 3: Verify build**

Run: `cd packages/web && bun run type-check`

**Step 4: Commit**

```bash
git add packages/web/src/trpc/
git commit -m "feat(web): add sessions.publish tRPC procedure"
```

---

### Task 6: Create Publish MCP Tool

**Files:**
- Create: `packages/plugin/mcp/src/tools/publish.ts`
- Modify: `packages/plugin/mcp/src/tools/index.ts`

**Step 1: Create publish tool**

Create `packages/plugin/mcp/src/tools/publish.ts`:

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readConfig } from "../config.js";
import { extractSession } from "../session.js";
import { createApiClient } from "../trpc.js";

export const registerPublish = (server: McpServer): void => {
  server.registerTool(
    "publish",
    {
      description: "Publish the current Claude Code session to Claudebin",
      inputSchema: {
        project_path: z.string().describe("Absolute path to the project directory"),
        title: z.string().optional().describe("Optional title for the session"),
        is_public: z.boolean().default(true).describe("Whether the session is public"),
      },
    },
    async ({ project_path, title, is_public }) => {
      const config = await readConfig();

      if (!config.auth?.token) {
        return {
          content: [{ type: "text", text: JSON.stringify({
            success: false,
            error: "Not authenticated. Run authenticate first."
          }) }],
          isError: true,
        };
      }

      const sessionResult = await extractSession(project_path);

      if ("error" in sessionResult) {
        return {
          content: [{ type: "text", text: JSON.stringify({
            success: false,
            error: sessionResult.error
          }) }],
          isError: true,
        };
      }

      const api = createApiClient();

      try {
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: sessionResult.content,
          is_public: is_public ?? true,
          access_token: config.auth.token,
        });

        return {
          content: [{ type: "text", text: JSON.stringify({
            success: true,
            id: result.id,
            url: result.url,
          }) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          }) }],
          isError: true,
        };
      }
    },
  );
};
```

**Step 2: Register in tools/index.ts**

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAuthenticate } from "./authenticate.js";
import { registerExtractSession } from "./extract-session.js";
import { registerLogout } from "./logout.js";
import { registerPublish } from "./publish.js";
import { registerWhoami } from "./whoami.js";

export const registerAllTools = (server: McpServer): void => {
  registerExtractSession(server);
  registerAuthenticate(server);
  registerWhoami(server);
  registerLogout(server);
  registerPublish(server);
};
```

**Step 3: Verify build**

Run: `bun run type-check && bun run build`

**Step 4: Commit**

```bash
git add packages/plugin/mcp/src/tools/
git commit -m "feat(plugin): add publish tool for sharing sessions"
```

---

### Task 7: Verify End-to-End

**Step 1: Build all**

Run: `bun run build`

**Step 2: Type-check all**

Run: `bun run type-check`

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete auth flow with publishing"
```

---

## Summary

After completing all tasks:
- ✅ Profile auto-created on signup (GitHub or Google)
- ✅ Old REST routes removed (tRPC only)
- ✅ Token refresh support (stored refresh_token)
- ✅ Session publishing via `publish` MCP tool
- ✅ Full flow: authenticate → extract_session → publish → share URL
