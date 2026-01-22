import { router } from "@/trpc/init";
import { authRouter } from "@/trpc/routers/auth";
import { sessionsRouter } from "@/trpc/routers/sessions";

export const appRouter = router({
  auth: authRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;
