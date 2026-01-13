# tRPC Auth API Design

## Overview

Replace raw fetch calls in the MCP plugin with a type-safe tRPC client. The Next.js web app becomes a tRPC server, and the MCP plugin becomes a client.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   MCP Plugin    │  tRPC   │   Next.js Web   │
│   (client)      │ ──────► │   (server)      │
└─────────────────┘  HTTP   └─────────────────┘
                              │
                              ▼
                         ┌─────────┐
                         │ Supabase │
                         └─────────┘
```

## tRPC Router (web package)

```typescript
// packages/web/src/trpc/routers/auth.ts
export const authRouter = router({
  start: publicProcedure.mutation(async () => {
    // Creates auth session, returns { code, url, expires_at }
  }),

  poll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      // Returns { status: "pending" | "expired" | "success", ... }
    }),
});
```

## API Route

Single tRPC endpoint at `/api/trpc/[trpc]` handles all procedures.

## MCP Client

```typescript
// packages/plugin/mcp/src/trpc.ts
import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "claudebin-web/src/trpc";

export const api = createTRPCClient<AppRouter>({
  links: [httpLink({ url: `${baseUrl}/api/trpc` })],
});
```

## Migration

1. Add tRPC to web package, create router with auth procedures
2. Add tRPC client to MCP plugin
3. Replace fetch calls in `auth.ts` with `api.auth.start()` and `api.auth.poll()`
4. Remove old REST routes (or keep for backwards compat with CLI)

## Dependencies

**Web:**
- `@trpc/server` - Server implementation
- `zod` - Input validation (already implicit via tRPC)

**MCP Plugin:**
- `@trpc/client` - Client implementation
