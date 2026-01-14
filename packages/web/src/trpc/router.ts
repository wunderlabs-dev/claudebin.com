import { router } from "./init";
import { authRouter } from "./routers/auth";
import { sessionsRouter } from "./routers/sessions";

export const appRouter = router({
  auth: authRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;
