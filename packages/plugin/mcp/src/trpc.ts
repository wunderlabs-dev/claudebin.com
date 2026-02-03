import type { AppRouter } from "./router.js";
import { createTRPCClient, httpLink } from "@trpc/client";
import { getApiBaseUrl } from "./config.js";

export const createApiClient = (): AppRouter => {
  return createTRPCClient({
    links: [
      httpLink({
        url: `${getApiBaseUrl()}/api/trpc`,
      }),
    ],
  }) as unknown as AppRouter;
};
