import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

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
