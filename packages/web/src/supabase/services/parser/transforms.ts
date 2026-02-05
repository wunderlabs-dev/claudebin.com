import type { Attachment, ContentBlock } from "@/supabase/types/message";

import { z } from "zod";

import {
  BlockType,
  RAW_TASK_TOOLS,
  RAW_TOOL_TO_BLOCK_TYPE,
  RawTool,
} from "@/supabase/types/message";

import {
  type ImageBlockSchema,
  TextBlockSchema,
  ToolUseResultSchema,
  type RawContentBlock,
} from "./schemas";

type McpToolInfo = { server: string; tool: string };

export const BLOCK_TYPE_TO_RAW_TOOL: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_TOOL_TO_BLOCK_TYPE).map(([raw, internal]) => [internal, raw]),
);

export const ToolInputSchema = {
  AskUserQuestion: z.object({
    questions: z
      .array(
        z.object({
          question: z.string(),
          header: z.string(),
          options: z.array(z.object({ label: z.string(), description: z.string() })),
          multiSelect: z.boolean(),
        }),
      )
      .default([]),
  }),
  Bash: z.object({
    command: z.string(),
    description: z.string().optional(),
    timeout: z.number().optional(),
  }),
  Read: z.object({
    file_path: z.string(),
    offset: z.number().optional(),
    limit: z.number().optional(),
  }),
  Write: z.object({ file_path: z.string(), content: z.string() }),
  Edit: z.object({ file_path: z.string(), old_string: z.string(), new_string: z.string() }),
  Glob: z.object({ pattern: z.string(), path: z.string().optional() }),
  Grep: z.object({ pattern: z.string(), path: z.string().optional(), glob: z.string().optional() }),
  Task: z.object({ description: z.string(), prompt: z.string(), subagent_type: z.string() }),
  TaskOutput: z.object({
    task_id: z.string(),
    block: z.boolean().optional(),
    timeout: z.number().optional(),
  }),
  TaskStop: z.object({ task_id: z.string() }),
  WebFetch: z.object({ url: z.string(), prompt: z.string() }),
  WebSearch: z.object({ query: z.string() }),
  TaskCreate: z.object({ subject: z.string(), description: z.string().optional() }),
  TaskUpdate: z.object({
    taskId: z.string(),
    status: z.enum(["pending", "in_progress", "completed"]).optional(),
  }),
} as const;

export const extractTaskId = (content: string): string | null => {
  const match = content.match(/(?:Task |task )#(\d+)/i);
  return match ? match[1] : null;
};

export const parseToolInput = <T>(
  schema: z.ZodType<T>,
  input: Record<string, unknown>,
): T | null => {
  const result = schema.safeParse(input);
  return result.success ? result.data : null;
};

const parseMcpToolName = (name: string): McpToolInfo | null => {
  const match = name.match(/^mcp__(.+)__(\w+)$/);
  if (!match) return null;
  return {
    server: match[1].replace(/_/g, " "),
    tool: match[2].replace(/_/g, " "),
  };
};

export const toRelativePath = (absolutePath: string): string => {
  const patterns = [
    /.*\/(packages\/.*)/,
    /.*\/(src\/.*)/,
    /.*\/([^/]+\.(ts|tsx|js|jsx|json|md|css|html))$/,
  ];

  for (const pattern of patterns) {
    const match = absolutePath.match(pattern);
    if (match) return match[1];
  }

  return absolutePath.replace(/^\/Users\/[^/]+\/[^/]+\/[^/]+\//, "");
};

const stripAbsolutePaths = (text: string): string =>
  text.replace(/\/Users\/[^\s:]+/g, (match) => toRelativePath(match));

export const transformToolUse = (
  id: string,
  name: string,
  input: Record<string, unknown>,
): ContentBlock => {
  const fallback: ContentBlock = { type: BlockType.GENERIC, id, name, input };

  switch (name) {
    case RawTool.ASK_USER_QUESTION: {
      const data = parseToolInput(ToolInputSchema.AskUserQuestion, input);
      return { type: BlockType.QUESTION, id, questions: data?.questions ?? [] };
    }
    case RawTool.BASH: {
      const data = parseToolInput(ToolInputSchema.Bash, input);
      return data ? { type: BlockType.BASH, id, ...data } : fallback;
    }
    case RawTool.READ: {
      const data = parseToolInput(ToolInputSchema.Read, input);
      return data
        ? { type: BlockType.FILE_READ, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.WRITE: {
      const data = parseToolInput(ToolInputSchema.Write, input);
      return data
        ? { type: BlockType.FILE_WRITE, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.EDIT: {
      const data = parseToolInput(ToolInputSchema.Edit, input);
      return data
        ? { type: BlockType.FILE_EDIT, id, ...data, file_path: toRelativePath(data.file_path) }
        : fallback;
    }
    case RawTool.GLOB: {
      const data = parseToolInput(ToolInputSchema.Glob, input);
      return data ? { type: BlockType.GLOB, id, ...data } : fallback;
    }
    case RawTool.GREP: {
      const data = parseToolInput(ToolInputSchema.Grep, input);
      return data ? { type: BlockType.GREP, id, ...data } : fallback;
    }
    case RawTool.TASK: {
      const data = parseToolInput(ToolInputSchema.Task, input);
      return data ? { type: BlockType.TASK, id, ...data } : fallback;
    }
    case RawTool.TASK_OUTPUT: {
      const data = parseToolInput(ToolInputSchema.TaskOutput, input);
      return data ? { type: BlockType.TASK_OUTPUT, id, ...data } : fallback;
    }
    case RawTool.TASK_STOP: {
      const data = parseToolInput(ToolInputSchema.TaskStop, input);
      return data ? { type: BlockType.TASK_STOP, id, ...data } : fallback;
    }
    case RawTool.WEB_FETCH: {
      const data = parseToolInput(ToolInputSchema.WebFetch, input);
      return data ? { type: BlockType.WEB_FETCH, id, ...data } : fallback;
    }
    case RawTool.WEB_SEARCH: {
      const data = parseToolInput(ToolInputSchema.WebSearch, input);
      return data ? { type: BlockType.WEB_SEARCH, id, ...data } : fallback;
    }
    default: {
      const mcpInfo = parseMcpToolName(name);
      if (mcpInfo) {
        return { type: BlockType.MCP, id, ...mcpInfo, input };
      }
      console.error("[parser] Unknown tool falling back to generic", {
        name,
        inputKeys: Object.keys(input),
      });
      return fallback;
    }
  }
};

export const extractText = (content: unknown): string => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(extractText).join("\n");
  const parsed = TextBlockSchema.safeParse(content);
  return parsed.success ? parsed.data.text : JSON.stringify(content);
};

const stripSystemReminders = (text: string): string =>
  text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").trim();

const stripLineNumbers = (text: string): string => text.replace(/^ *\d+→/gm, "");

// biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape codes require control characters
const stripAnsiCodes = (text: string): string => text.replace(/\x1b\[[0-9;]*m/g, "");

const sanitize = (text: string): string => stripAbsolutePaths(stripSystemReminders(text));

const sanitizers: Partial<Record<string, (result: string) => string>> = {
  [RawTool.READ]: (result) => sanitize(stripLineNumbers(result)),
  [RawTool.BASH]: (result) => sanitize(stripAnsiCodes(result)),
  [RawTool.GLOB]: sanitize,
  [RawTool.GREP]: sanitize,
  [RawTool.WRITE]: sanitize,
  [RawTool.EDIT]: sanitize,
  [RawTool.TASK]: sanitize,
  [RawTool.WEB_FETCH]: sanitize,
  [RawTool.WEB_SEARCH]: sanitize,
};

export const sanitizeResult = (toolName: string, result: string): string => {
  const sanitizer = sanitizers[toolName];
  return sanitizer ? sanitizer(result) : sanitize(result);
};

const enhanceRead = (data: z.infer<typeof ToolUseResultSchema.Read>) => ({
  content: sanitize(stripLineNumbers(data.file.content)),
  numLines: data.file.numLines,
  totalLines: data.file.totalLines,
});

const enhanceGlob = (data: z.infer<typeof ToolUseResultSchema.Glob>) => ({
  filenames: data.filenames.map(toRelativePath),
  numFiles: data.numFiles,
  truncated: data.truncated,
  durationMs: data.durationMs,
});

const enhanceGrep = (data: z.infer<typeof ToolUseResultSchema.Grep>) => ({
  filenames: data.filenames.map(toRelativePath),
  numFiles: data.numFiles,
  truncated: data.truncated,
  durationMs: data.durationMs,
});

const enhanceBash = (data: z.infer<typeof ToolUseResultSchema.Bash>) => ({
  stdout: sanitize(stripAnsiCodes(data.stdout)),
  stderr: sanitize(stripAnsiCodes(data.stderr)),
  interrupted: data.interrupted,
});

const enhanceWrite = (_data: z.infer<typeof ToolUseResultSchema.Write>) => ({
  success: true,
});

const enhanceEdit = (_data: z.infer<typeof ToolUseResultSchema.Edit>) => ({
  success: true,
});

const enhanceWebFetch = (data: z.infer<typeof ToolUseResultSchema.WebFetch>) => ({
  content: sanitize(data.result),
  statusCode: data.code,
  statusText: data.codeText,
  bytes: data.bytes,
  durationMs: data.durationMs,
});

const enhanceQuestion = (data: z.infer<typeof ToolUseResultSchema.AskUserQuestion>) => ({
  answers: data.answers,
});

const enhanceTaskOutput = (data: z.infer<typeof ToolUseResultSchema.TaskOutput>) => ({
  status: data.task.status,
  task_type: data.task.task_type,
  description: data.task.description,
  output: data.task.output ? sanitize(data.task.output) : undefined,
  exitCode: data.task.exitCode,
});

const enhanceTaskStop = (data: z.infer<typeof ToolUseResultSchema.TaskStop>) => ({
  success: data.success,
});

const outputEnhancers = {
  [RawTool.READ]: { schema: ToolUseResultSchema.Read, enhance: enhanceRead },
  [RawTool.GLOB]: { schema: ToolUseResultSchema.Glob, enhance: enhanceGlob },
  [RawTool.GREP]: { schema: ToolUseResultSchema.Grep, enhance: enhanceGrep },
  [RawTool.BASH]: { schema: ToolUseResultSchema.Bash, enhance: enhanceBash },
  [RawTool.WRITE]: { schema: ToolUseResultSchema.Write, enhance: enhanceWrite },
  [RawTool.EDIT]: { schema: ToolUseResultSchema.Edit, enhance: enhanceEdit },
  [RawTool.WEB_FETCH]: { schema: ToolUseResultSchema.WebFetch, enhance: enhanceWebFetch },
  [RawTool.ASK_USER_QUESTION]: {
    schema: ToolUseResultSchema.AskUserQuestion,
    enhance: enhanceQuestion,
  },
  [RawTool.TASK_OUTPUT]: {
    schema: ToolUseResultSchema.TaskOutput,
    enhance: enhanceTaskOutput,
  },
  [RawTool.TASK_STOP]: {
    schema: ToolUseResultSchema.TaskStop,
    enhance: enhanceTaskStop,
  },
} as const;

export const enhanceToolOutput = (
  toolName: string,
  toolUseResult: unknown,
): Record<string, unknown> | null => {
  const enhancer = outputEnhancers[toolName as keyof typeof outputEnhancers];
  if (!enhancer) return null;

  const parsed = enhancer.schema.safeParse(toolUseResult);
  if (!parsed.success) return null;

  // biome-ignore lint/suspicious/noExplicitAny: enhancer types are matched by registry key
  return (enhancer.enhance as (data: any) => Record<string, unknown>)(parsed.data);
};

export const normalizeImageBlock = (block: z.infer<typeof ImageBlockSchema>): Attachment => ({
  type: "image",
  sourceType: block.source.type,
  mediaType: block.source.media_type,
  data: block.source.type === "url" ? (block.source.url ?? block.source.data) : block.source.data,
});

export const normalizeBlock = (block: RawContentBlock): ContentBlock | null => {
  switch (block.type) {
    case "text":
      return { type: BlockType.TEXT, text: block.text };
    case "thinking":
      return { type: BlockType.THINKING, thinking: block.thinking, signature: block.signature };
    case "image":
      return null;
    default:
      return { type: BlockType.TEXT, text: JSON.stringify(block) };
  }
};

export const isFilteredBlock = (block: ContentBlock): boolean => {
  if (block.type === BlockType.TEXT) return !block.text.trim();
  return block.type === BlockType.THINKING;
};

export const isTaskTool = (name: string): boolean => RAW_TASK_TOOLS.includes(name);
