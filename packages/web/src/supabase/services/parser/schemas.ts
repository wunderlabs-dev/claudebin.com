import { z } from "zod";

export const TextBlockSchema = z.object({ type: z.literal("text"), text: z.string() });

export const ImageBlockSchema = z.object({
  type: z.literal("image"),
  source: z.object({
    type: z.enum(["base64", "url"]),
    media_type: z.string().optional(),
    data: z.string(),
    url: z.string().optional(),
  }),
});

export const RawContentBlockSchema = z.union([
  TextBlockSchema,
  ImageBlockSchema,
  z.object({ type: z.literal("thinking"), thinking: z.string(), signature: z.string().optional() }),
  z.object({
    type: z.literal("tool_use"),
    id: z.string(),
    name: z.string(),
    input: z.record(z.string(), z.unknown()),
  }),
  z.object({
    type: z.literal("tool_result"),
    tool_use_id: z.string(),
    content: z.unknown(),
    is_error: z.boolean().optional(),
  }),
]);

export const ToolUseResultSchema = {
  Read: z.object({
    type: z.literal("text"),
    file: z.object({
      filePath: z.string(),
      content: z.string(),
      numLines: z.number().optional(),
      startLine: z.number().optional(),
      totalLines: z.number().optional(),
    }),
  }),
  Glob: z.object({
    filenames: z.array(z.string()),
    durationMs: z.number().optional(),
    numFiles: z.number(),
    truncated: z.boolean(),
  }),
  Grep: z.object({
    filenames: z.array(z.string()),
    durationMs: z.number().optional(),
    numFiles: z.number(),
    truncated: z.boolean(),
  }),
  Bash: z.object({
    stdout: z.string(),
    stderr: z.string(),
    interrupted: z.boolean(),
    isImage: z.boolean().optional(),
  }),
  Write: z.object({
    type: z.enum(["create", "update"]),
    filePath: z.string(),
    content: z.string().optional(),
  }),
  Edit: z.object({
    type: z.enum(["create", "update"]),
    filePath: z.string(),
    content: z.string().optional(),
    structuredPatch: z
      .array(
        z.object({
          oldStart: z.number(),
          oldLines: z.number(),
          newStart: z.number(),
          newLines: z.number(),
          lines: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  WebFetch: z.object({
    bytes: z.number().optional(),
    code: z.number(),
    codeText: z.string(),
    result: z.string(),
    durationMs: z.number(),
    url: z.string(),
  }),
  AskUserQuestion: z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        header: z.string(),
        options: z.array(z.object({ label: z.string(), description: z.string() })),
        multiSelect: z.boolean(),
      }),
    ),
    answers: z.record(z.string(), z.string()),
  }),
  TaskOutput: z.object({
    retrieval_status: z.string(),
    task: z.object({
      task_id: z.string(),
      task_type: z.string().optional(),
      status: z.string(),
      description: z.string().optional(),
      output: z.string().optional(),
      exitCode: z.number().optional(),
    }),
  }),
  TaskStop: z.object({
    success: z.boolean(),
  }),
} as const;

const BaseMessageFields = {
  uuid: z.string(),
  timestamp: z.string(),
  sessionId: z.string(),
  parentUuid: z.string().nullable(),
  cwd: z.string().optional(),
  isMeta: z.boolean().optional(),
  isSidechain: z.boolean().optional(),
  toolUseResult: z.unknown().optional(),
};

const UserMessageSchema = z.object({
  ...BaseMessageFields,
  type: z.literal("user"),
  message: z.object({
    id: z.string().optional(),
    role: z.literal("user"),
    content: z.union([z.string(), z.array(RawContentBlockSchema)]),
    model: z.string().optional(),
  }),
});

const AssistantMessageSchema = z.object({
  ...BaseMessageFields,
  type: z.literal("assistant"),
  message: z.object({
    id: z.string().optional(),
    role: z.literal("assistant"),
    content: z.array(RawContentBlockSchema),
    model: z.string().optional(),
  }),
});

const SkippedMessageSchema = z.object({
  ...BaseMessageFields,
  type: z.enum(["file-history-snapshot", "tool_result"]),
  message: z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant"]),
    content: z.union([z.string(), z.array(RawContentBlockSchema)]).optional(),
    model: z.string().optional(),
  }),
});

export const RawJsonlMessageSchema = z.discriminatedUnion("type", [
  UserMessageSchema,
  AssistantMessageSchema,
  SkippedMessageSchema,
]);

export type RawContentBlock = z.infer<typeof RawContentBlockSchema>;
export type RawJsonlMessage = z.infer<typeof RawJsonlMessageSchema>;
