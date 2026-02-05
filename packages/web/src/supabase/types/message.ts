export const MessageRole = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type Role = (typeof MessageRole)[keyof typeof MessageRole];

export const BlockType = {
  TEXT: "text",
  THINKING: "thinking",
  GENERIC: "generic",
  MCP: "mcp",
  QUESTION: "question",
  BASH: "bash",
  FILE_READ: "file_read",
  FILE_WRITE: "file_write",
  FILE_EDIT: "file_edit",
  GLOB: "glob",
  GREP: "grep",
  TASK: "task",
  TASK_OUTPUT: "task_output",
  TASK_STOP: "task_stop",
  WEB_FETCH: "web_fetch",
  WEB_SEARCH: "web_search",
  TASKS: "tasks",
  SKILL: "skill",
} as const;

export type ContentBlock =
  | TextBlock
  | ThinkingBlock
  | GenericBlock
  | McpBlock
  | QuestionBlock
  | BashBlock
  | FileReadBlock
  | FileWriteBlock
  | FileEditBlock
  | GlobBlock
  | GrepBlock
  | TaskBlock
  | TaskOutputBlock
  | TaskStopBlock
  | WebFetchBlock
  | WebSearchBlock
  | TasksBlock
  | SkillBlock;

export type ImageAttachment = {
  type: "image";
  sourceType: "base64" | "url";
  mediaType?: string; // "image/png", "image/jpeg", etc.
  data: string; // base64 data or URL
};

export type Attachment = ImageAttachment;

export interface TextBlock {
  type: typeof BlockType.TEXT;
  text: string;
  attachments?: Attachment[];
}

export interface ThinkingBlock {
  type: typeof BlockType.THINKING;
  thinking: string;
  signature?: string;
}

// Base fields shared by all tool blocks
export interface ToolBase {
  id: string;
  is_error?: boolean;
  error?: string;
}

export interface GenericBlock extends ToolBase {
  type: typeof BlockType.GENERIC;
  name: string;
  input: Record<string, unknown>;
  // Output - generic fallback
  output?: unknown;
}

export interface McpBlock extends ToolBase {
  type: typeof BlockType.MCP;
  server: string;
  tool: string;
  input: Record<string, unknown>;
  // Output - generic since MCP tools vary
  output?: unknown;
}

export interface QuestionBlock extends ToolBase {
  type: typeof BlockType.QUESTION;
  questions: Array<{
    question: string;
    header: string;
    options: Array<{
      label: string;
      description: string;
    }>;
    multiSelect: boolean;
  }>;
  // Output
  answers?: Record<string, string>;
}

export interface BashBlock extends ToolBase {
  type: typeof BlockType.BASH;
  command: string;
  description?: string;
  timeout?: number;
  // Output
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  interrupted?: boolean;
}

export interface FileReadBlock extends ToolBase {
  type: typeof BlockType.FILE_READ;
  file_path: string;
  offset?: number;
  limit?: number;
  // Output
  content?: string;
  numLines?: number;
  totalLines?: number;
}

export interface FileWriteBlock extends ToolBase {
  type: typeof BlockType.FILE_WRITE;
  file_path: string;
  content: string;
  // Output
  success?: boolean;
}

export interface FileEditBlock extends ToolBase {
  type: typeof BlockType.FILE_EDIT;
  file_path: string;
  old_string: string;
  new_string: string;
  // Output
  success?: boolean;
}

export interface GlobBlock extends ToolBase {
  type: typeof BlockType.GLOB;
  pattern: string;
  path?: string;
  // Output
  filenames?: string[];
  numFiles?: number;
  truncated?: boolean;
  durationMs?: number;
}

export interface GrepBlock extends ToolBase {
  type: typeof BlockType.GREP;
  pattern: string;
  path?: string;
  glob?: string;
  // Output
  filenames?: string[];
  numFiles?: number;
  truncated?: boolean;
  durationMs?: number;
}

export interface TaskBlock extends ToolBase {
  type: typeof BlockType.TASK;
  description: string;
  prompt: string;
  subagent_type: string;
  // Output
  output?: string;
}

export interface TaskOutputBlock extends ToolBase {
  type: typeof BlockType.TASK_OUTPUT;
  task_id: string;
  block?: boolean;
  timeout?: number;
  // Output
  status?: string;
  task_type?: string;
  description?: string;
  output?: string;
  exitCode?: number;
}

export interface TaskStopBlock extends ToolBase {
  type: typeof BlockType.TASK_STOP;
  task_id: string;
  // Output
  success?: boolean;
}

export interface WebFetchBlock extends ToolBase {
  type: typeof BlockType.WEB_FETCH;
  url: string;
  prompt: string;
  // Output
  content?: string;
  statusCode?: number;
  statusText?: string;
  bytes?: number;
  durationMs?: number;
}

export interface WebSearchBlock extends ToolBase {
  type: typeof BlockType.WEB_SEARCH;
  query: string;
  // Output
  content?: string;
}

export interface TaskItem {
  id: string;
  subject: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
}

export interface TasksBlock {
  type: typeof BlockType.TASKS;
  tasks: TaskItem[];
}

export interface SkillBlock {
  type: typeof BlockType.SKILL;
  name: string;
  commandName: string;
  instructions?: string;
  output?: string;
}

export enum RawTool {
  ASK_USER_QUESTION = "AskUserQuestion",
  BASH = "Bash",
  READ = "Read",
  WRITE = "Write",
  EDIT = "Edit",
  GLOB = "Glob",
  GREP = "Grep",
  TASK = "Task",
  TASK_OUTPUT = "TaskOutput",
  TASK_STOP = "TaskStop",
  WEB_FETCH = "WebFetch",
  WEB_SEARCH = "WebSearch",
  TASK_CREATE = "TaskCreate",
  TASK_UPDATE = "TaskUpdate",
  TASK_GET = "TaskGet",
  TASK_LIST = "TaskList",
}

export const RAW_TOOL_TO_BLOCK_TYPE: Record<string, string> = {
  [RawTool.ASK_USER_QUESTION]: BlockType.QUESTION,
  [RawTool.BASH]: BlockType.BASH,
  [RawTool.READ]: BlockType.FILE_READ,
  [RawTool.WRITE]: BlockType.FILE_WRITE,
  [RawTool.EDIT]: BlockType.FILE_EDIT,
  [RawTool.GLOB]: BlockType.GLOB,
  [RawTool.GREP]: BlockType.GREP,
  [RawTool.TASK]: BlockType.TASK,
  [RawTool.TASK_OUTPUT]: BlockType.TASK_OUTPUT,
  [RawTool.TASK_STOP]: BlockType.TASK_STOP,
  [RawTool.WEB_FETCH]: BlockType.WEB_FETCH,
  [RawTool.WEB_SEARCH]: BlockType.WEB_SEARCH,
};

export const RAW_TASK_TOOLS: readonly string[] = [
  RawTool.TASK_CREATE,
  RawTool.TASK_UPDATE,
  RawTool.TASK_GET,
  RawTool.TASK_LIST,
];

export const isSkippedMessageType = (type: string): boolean => type === "file-history-snapshot";

// Skill command patterns
const SKILL_COMMAND_REGEX =
  /<command-message>([^<]+)<\/command-message>\s*\n<command-name>\/([^<]+)<\/command-name>/;
const SKILL_INSTRUCTIONS_REGEX = /<instructions>([\s\S]*?)<\/instructions>/;
const SKILL_OUTPUT_REGEX = /<output>([\s\S]*?)<\/output>/;

export type SkillCommandData = {
  name: string;
  commandName: string;
};

export type SkillMetaData = {
  instructions?: string;
  output?: string;
};

export const parseSkillCommand = (content: string): SkillCommandData | null => {
  const match = content.match(SKILL_COMMAND_REGEX);
  if (!match) return null;
  return {
    name: match[1].trim(),
    commandName: `/${match[2].trim()}`,
  };
};

export const parseSkillMeta = (content: string): SkillMetaData => {
  const instructionsMatch = content.match(SKILL_INSTRUCTIONS_REGEX);
  const outputMatch = content.match(SKILL_OUTPUT_REGEX);
  return {
    instructions: instructionsMatch?.[1]?.trim(),
    output: outputMatch?.[1]?.trim(),
  };
};
