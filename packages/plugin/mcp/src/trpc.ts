import type { AppRouter } from "@claudebin/web/trpc/router";
import { createTRPCClient, httpLink } from "@trpc/client";
import { getApiBaseUrl } from "./config.js";

export const createApiClient = () => {
  return createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url: `${getApiBaseUrl()}/api/trpc`,
      }),
    ],
  });
};
