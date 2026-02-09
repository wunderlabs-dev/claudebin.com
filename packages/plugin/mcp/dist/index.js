#!/usr/bin/env node

// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// src/tools/share.ts
import { z } from "zod";

// src/config.ts
import fs from "fs/promises";
import os from "os";
import path from "path";
var CONFIG_DIR = path.join(os.homedir(), ".claudebin");
var CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
var getApiBaseUrl = () => {
  return process.env.CLAUDEBIN_API_URL || "http://localhost:3000";
};
var readConfig = async () => {
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
};
var writeConfig = async (config) => {
  await fs.mkdir(CONFIG_DIR, { recursive: true, mode: 448 });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), {
    mode: 384
  });
};

// src/constants.ts
var TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1e3;
var DEFAULT_TOKEN_TTL_MS = 60 * 60 * 1e3;
var AUTH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var POLL_INTERVAL_MS = 2e3;
var AUTH_POLL_TIMEOUT_MS = 5 * 6e4;
var SESSION_POLL_TIMEOUT_MS = 12e4;
var MAX_SESSION_SIZE_BYTES = 50 * 1024 * 1024;
var PollStatus = {
  SUCCESS: "success",
  EXPIRED: "expired"
};
var SessionStatus = {
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed"
};

// src/trpc.ts
import { createTRPCClient, httpLink } from "@trpc/client";
var createApiClient = () => {
  return createTRPCClient({
    links: [
      httpLink({
        url: `${getApiBaseUrl()}/api/trpc`
      })
    ]
  });
};

// src/utils.ts
import { exec } from "child_process";
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var poll = async (options) => {
  const { fn, isSuccess, isFailure, getFailureError, intervalMs, timeoutMs, timeoutError } = options;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const result = await fn();
      if (result !== null) {
        if (isSuccess(result)) {
          return result;
        }
        if (isFailure?.(result)) {
          throw new Error(getFailureError?.(result) ?? "Polling failed");
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "Polling failed") {
      } else {
        throw error;
      }
    }
    await sleep(intervalMs);
  }
  throw new Error(timeoutError);
};
var safeOpenUrl = (url) => {
  const platform = process.platform;
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (platform === "darwin") {
    exec(`open "${url.replace(/"/g, '\\"')}"`);
  } else if (platform === "win32") {
    exec(`start "" "${url.replace(/"/g, '\\"')}"`);
  } else {
    exec(`xdg-open "${url.replace(/"/g, '\\"')}"`);
  }
};

// src/auth.ts
var fetchAuthPollData = async (code, apiUrl) => {
  const url = `${apiUrl}/api/trpc/auth.poll?input=${encodeURIComponent(JSON.stringify({ code }))}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.result?.data ?? null;
};
var pollForAuthCompletion = async (code, apiUrl, timeoutMs = AUTH_POLL_TIMEOUT_MS) => {
  const result = await poll({
    fn: () => fetchAuthPollData(code, apiUrl),
    isSuccess: (data) => data.status === PollStatus.SUCCESS && data.token !== void 0 && data.refresh_token !== void 0 && data.user !== void 0,
    isFailure: (data) => data.status === PollStatus.EXPIRED,
    getFailureError: () => "Authentication code expired",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Authentication timed out"
  });
  const { token, refresh_token, user } = result;
  if (!token || !refresh_token || !user) {
    throw new Error("Invalid authentication response");
  }
  return { token, refresh_token, user };
};
var start = async () => {
  const api = createApiClient();
  try {
    const data = await api.auth.start.mutate();
    return { code: data.code, url: data.url };
  } catch (error) {
    throw new Error(
      `Failed to connect to Claudebin: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
var run = async () => {
  const apiUrl = getApiBaseUrl();
  const { code, url } = await start();
  safeOpenUrl(url);
  const { token, refresh_token, user } = await pollForAuthCompletion(code, apiUrl);
  const config = {
    auth: {
      token,
      refresh_token,
      expires_at: Date.now() + AUTH_TOKEN_TTL_MS
    },
    user
  };
  await writeConfig(config);
  return token;
};
var refresh = async () => {
  const config = await readConfig();
  if (!config.auth?.refresh_token) return false;
  const api = createApiClient();
  try {
    const result = await api.auth.refresh.mutate({
      refresh_token: config.auth.refresh_token
    });
    if (!result.success) {
      return false;
    }
    await writeConfig({
      ...config,
      auth: {
        token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at ? result.expires_at * 1e3 : Date.now() + DEFAULT_TOKEN_TTL_MS
      }
    });
    return true;
  } catch {
    return false;
  }
};
var getLocalToken = async () => {
  const config = await readConfig();
  if (!config.auth?.token) {
    return null;
  }
  if (!config.auth.expires_at || Date.now() > config.auth.expires_at - TOKEN_REFRESH_BUFFER_MS) {
    const refreshed = await refresh();
    if (!refreshed) {
      return null;
    }
    const refreshedConfig = await readConfig();
    return refreshedConfig.auth?.token ?? null;
  }
  return config.auth.token;
};
var validate = async (token) => {
  const api = createApiClient();
  try {
    const result = await api.auth.validate.query({ token });
    return result.valid;
  } catch {
    return false;
  }
};
var getToken = async () => {
  const localToken = await getLocalToken();
  if (localToken) {
    const isValid = await validate(localToken);
    if (isValid) {
      return localToken;
    }
  }
  return run();
};
var auth = { run, validate, getToken, refresh };

// src/session.ts
import fs2 from "fs/promises";
import os2 from "os";
import path2 from "path";
var NON_ALPHANUMERIC_PATTERN = /[^a-zA-Z0-9]/g;
var normalizeProjectPath = (projectPath) => {
  return projectPath.replace(NON_ALPHANUMERIC_PATTERN, "-");
};
var getClaudeProjectPath = (normalizedPath) => {
  return path2.join(os2.homedir(), ".claude", "projects", normalizedPath);
};
var getFilesWithStats = async (files, directoryPath) => {
  return Promise.all(
    files.map(async (file) => {
      const filePath = path2.join(directoryPath, file);
      const stats = await fs2.stat(filePath);
      return { file, mtime: stats.mtime };
    })
  );
};
var findMostRecentSession = (files) => {
  const sessions = files.filter((entry) => entry.file.endsWith(".jsonl")).filter((entry) => !entry.file.startsWith("agent-")).sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return sessions.length > 0 ? sessions[0].file : null;
};
var extract = async (projectPath) => {
  const normalizedPath = normalizeProjectPath(projectPath);
  const claudeProjectPath = getClaudeProjectPath(normalizedPath);
  try {
    await fs2.access(claudeProjectPath);
  } catch {
    throw new Error(`No Claude sessions found for project path: ${projectPath}`);
  }
  const files = await fs2.readdir(claudeProjectPath);
  if (files.length === 0) {
    throw new Error(`No session files found in: ${claudeProjectPath}`);
  }
  const filesWithStats = await getFilesWithStats(files, claudeProjectPath);
  const mostRecentSession = findMostRecentSession(filesWithStats);
  if (!mostRecentSession) {
    throw new Error(
      `No valid session files found (excluding agent-* files) in: ${claudeProjectPath}`
    );
  }
  const sessionPath = path2.join(claudeProjectPath, mostRecentSession);
  return fs2.readFile(sessionPath, "utf8");
};
var session = { extract };

// src/tools/share.ts
var fetchSessionPollData = async (sessionId, apiUrl) => {
  const url = `${apiUrl}/api/trpc/sessions.poll?input=${encodeURIComponent(
    JSON.stringify({ id: sessionId })
  )}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.result?.data ?? null;
};
var pollForProcessing = async (sessionId, apiUrl, timeoutMs = SESSION_POLL_TIMEOUT_MS) => {
  const result = await poll({
    fn: () => fetchSessionPollData(sessionId, apiUrl),
    isSuccess: (data) => data.status === SessionStatus.READY && data.url !== void 0,
    isFailure: (data) => data.status === SessionStatus.FAILED,
    getFailureError: (data) => data.error || "Processing failed",
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs,
    timeoutError: "Processing timed out after 2 minutes"
  });
  if (!result.url) {
    throw new Error("Invalid session response");
  }
  return result.url;
};
var registerShare = (server) => {
  server.registerTool(
    "share",
    {
      description: "Share the current Claude Code session to Claudebin. Authenticates automatically if needed.",
      inputSchema: {
        project_path: z.string().describe("Absolute path to the project directory"),
        title: z.string().optional().describe("Optional title for the session"),
        is_public: z.boolean().default(true).describe(
          "Whether the session appears in public listings (false = unlisted, accessible via link)"
        )
      }
    },
    async ({ project_path, title, is_public }) => {
      try {
        const token = await auth.getToken();
        const content = await session.extract(project_path);
        const sizeBytes = new TextEncoder().encode(content).length;
        if (sizeBytes > MAX_SESSION_SIZE_BYTES) {
          throw new Error(
            `Session too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds 50MB limit`
          );
        }
        const api = createApiClient();
        const apiUrl = getApiBaseUrl();
        const result = await api.sessions.publish.mutate({
          title,
          conversation_data: content,
          is_public,
          access_token: token
        });
        const url = await pollForProcessing(result.id, apiUrl);
        safeOpenUrl(url);
        return {
          content: [{ type: "text", text: url }]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: error instanceof Error ? error.message : String(error)
            }
          ],
          isError: true
        };
      }
    }
  );
};

// src/tools/index.ts
var registerAllTools = (server) => {
  registerShare(server);
};

// src/index.ts
var main = async () => {
  const server = new McpServer({
    name: "claudebin",
    version: "0.1.0"
  });
  registerAllTools(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
};
main().catch(console.error);
