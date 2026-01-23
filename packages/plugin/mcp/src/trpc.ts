import type { AppRouter } from "./router.js";
import { createTRPCClient, httpLink } from "@trpc/client";
import { getApiBaseUrl } from "./config.js";

export const createApiClient = (): AppRouter => {
  // Cast to AppRouter since we only use a subset of the actual router
  // and don't want to type-check the entire web package
  return createTRPCClient({
    links: [
      httpLink({
        url: `${getApiBaseUrl()}/api/trpc`,
      }),
    ],
  }) as unknown as AppRouter;
};
