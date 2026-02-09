import createClient from "openapi-fetch";
import type { paths, components } from "./api.d.js";
import { getApiBaseUrl } from "./config.js";

// Re-export schema types for consumers
export type AuthStartResponse = components["schemas"]["AuthStartResponse"];
export type AuthPollResponse = components["schemas"]["AuthPollResponse"];
export type AuthRefreshInput = components["schemas"]["AuthRefreshInput"];
export type AuthRefreshResponse = components["schemas"]["AuthRefreshResponse"];
export type AuthValidateResponse = components["schemas"]["AuthValidateResponse"];
export type User = components["schemas"]["User"];
export type SessionsPublishInput = components["schemas"]["SessionsPublishInput"];
export type SessionsPublishResponse = components["schemas"]["SessionsPublishResponse"];
export type SessionsPollResponse = components["schemas"]["SessionsPollResponse"];

export const createApiClient = () => {
  const client = createClient<paths>({ baseUrl: getApiBaseUrl() });

  return {
    auth: {
      start: async () => {
        const { data, error } = await client.POST("/api/auth/start");
        if (error) throw new Error("Failed to start auth");
        return data;
      },
      poll: async (code: string) => {
        const { data, error } = await client.GET("/api/auth/poll", {
          params: { query: { code } },
        });
        if (error) throw new Error("Failed to poll auth");
        return data;
      },
      refresh: async (input: AuthRefreshInput) => {
        const { data, error } = await client.POST("/api/auth/refresh", {
          body: input,
        });
        if (error) throw new Error("Failed to refresh token");
        return data;
      },
      validate: async (token: string) => {
        const { data, error } = await client.GET("/api/auth/validate", {
          params: { query: { token } },
        });
        if (error) throw new Error("Failed to validate token");
        return data;
      },
    },
    sessions: {
      publish: async (input: SessionsPublishInput) => {
        const { data, error } = await client.POST("/api/sessions/publish", {
          body: input,
        });
        if (error) throw new Error("Failed to publish session");
        return data;
      },
      poll: async (id: string) => {
        const { data, error } = await client.GET("/api/sessions/poll", {
          params: { query: { id } },
        });
        if (error) throw new Error("Failed to poll session");
        return data;
      },
    },
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
