// Claude Code Message Types
// Normalized data structures for session display

// =============================================================================
// Core Message Types
// =============================================================================

export const MessageRole = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type Role = (typeof MessageRole)[keyof typeof MessageRole];

export interface Message {
  id: string;
  role: Role;
  content: ContentBlock[];
  timestamp: Date;
  model?: string;
  isMeta?: boolean;
}

// =============================================================================
// Content Blocks
// =============================================================================

export const BlockType = {
  // Core types
  TEXT: "text",
  THINKING: "thinking",
  TOOL_RESULT: "tool_result",
  TOOL_USE: "tool_use", // Fallback for unknown tools
  MCP: "mcp", // MCP server tools

  // Specific tool types
  QUESTION: "question",
  BASH: "bash",
  FILE_READ: "file_read",
  FILE_WRITE: "file_write",
  FILE_EDIT: "file_edit",
  GLOB: "glob",
  GREP: "grep",
  TASK: "task",
  WEB_FETCH: "web_fetch",
  WEB_SEARCH: "web_search",
  TASKS: "tasks",
} as const;

export type ContentBlock =
  | TextBlock
  | ThinkingBlock
  | ToolResultBlock
  | ToolUseBlock // Fallback for unknown tools
  | McpBlock // MCP server tools
  | QuestionBlock
  | BashBlock
  | FileReadBlock
  | FileWriteBlock
  | FileEditBlock
  | GlobBlock
  | GrepBlock
  | TaskBlock
  | WebFetchBlock
  | WebSearchBlock
  | TasksBlock;

export interface TextBlock {
  type: typeof BlockType.TEXT;
  text: string;
}

export interface ThinkingBlock {
  type: typeof BlockType.THINKING;
  thinking: string;
  signature?: string;
}

export interface ToolResultBlock {
  type: typeof BlockType.TOOL_RESULT;
  tool_use_id: string;
  content: string;
  // Note: is_error uses snake_case to match Claude API response format
  is_error?: boolean;
}

// Fallback for unknown tools
export interface ToolUseBlock {
  type: typeof BlockType.TOOL_USE;
  id: string;
  name: string;
  input: Record<string, unknown>;
}

// MCP server tools (mcp__server__tool pattern)
export interface McpBlock {
  type: typeof BlockType.MCP;
  id: string;
  server: string;
  tool: string;
  input: Record<string, unknown>;
}

// =============================================================================
// Specific Tool Blocks
// =============================================================================

export interface QuestionBlock {
  type: typeof BlockType.QUESTION;
  id: string;
  questions: Array<{
    question: string;
    header: string;
    options: Array<{
      label: string;
      description: string;
    }>;
    multiSelect: boolean;
  }>;
}

export interface BashBlock {
  type: typeof BlockType.BASH;
  id: string;
  command: string;
  description?: string;
  timeout?: number;
}

export interface FileReadBlock {
  type: typeof BlockType.FILE_READ;
  id: string;
  file_path: string;
  offset?: number;
  limit?: number;
}

export interface FileWriteBlock {
  type: typeof BlockType.FILE_WRITE;
  id: string;
  file_path: string;
  content: string;
}

export interface FileEditBlock {
  type: typeof BlockType.FILE_EDIT;
  id: string;
  file_path: string;
  old_string: string;
  new_string: string;
}

export interface GlobBlock {
  type: typeof BlockType.GLOB;
  id: string;
  pattern: string;
  path?: string;
}

export interface GrepBlock {
  type: typeof BlockType.GREP;
  id: string;
  pattern: string;
  path?: string;
  glob?: string;
}

export interface TaskBlock {
  type: typeof BlockType.TASK;
  id: string;
  description: string;
  prompt: string;
  subagent_type: string;
}

export interface WebFetchBlock {
  type: typeof BlockType.WEB_FETCH;
  id: string;
  url: string;
  prompt: string;
}

export interface WebSearchBlock {
  type: typeof BlockType.WEB_SEARCH;
  id: string;
  query: string;
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

// =============================================================================
// Raw Tool Names (what Claude API sends)
// =============================================================================

export enum RawTool {
  ASK_USER_QUESTION = "AskUserQuestion",
  BASH = "Bash",
  READ = "Read",
  WRITE = "Write",
  EDIT = "Edit",
  GLOB = "Glob",
  GREP = "Grep",
  TASK = "Task",
  WEB_FETCH = "WebFetch",
  WEB_SEARCH = "WebSearch",
  // Task management tools (aggregated into TASKS block)
  TASK_CREATE = "TaskCreate",
  TASK_UPDATE = "TaskUpdate",
  TASK_GET = "TaskGet",
  TASK_LIST = "TaskList",
}

// =============================================================================
// Tool Name Mapping (raw API name → internal block type)
// =============================================================================

export const RAW_TOOL_TO_BLOCK_TYPE: Record<string, string> = {
  [RawTool.ASK_USER_QUESTION]: BlockType.QUESTION,
  [RawTool.BASH]: BlockType.BASH,
  [RawTool.READ]: BlockType.FILE_READ,
  [RawTool.WRITE]: BlockType.FILE_WRITE,
  [RawTool.EDIT]: BlockType.FILE_EDIT,
  [RawTool.GLOB]: BlockType.GLOB,
  [RawTool.GREP]: BlockType.GREP,
  [RawTool.TASK]: BlockType.TASK,
  [RawTool.WEB_FETCH]: BlockType.WEB_FETCH,
  [RawTool.WEB_SEARCH]: BlockType.WEB_SEARCH,
};

// Task tools get aggregated into a single TASKS block (no individual rendering)
export const RAW_TASK_TOOLS: readonly string[] = [
  RawTool.TASK_CREATE,
  RawTool.TASK_UPDATE,
  RawTool.TASK_GET,
  RawTool.TASK_LIST,
];

// =============================================================================
// Raw JSONL Types (what we receive from Claude Code)
// =============================================================================

export type RawMessageType = "user" | "assistant" | "file-history-snapshot" | "tool_result";

export interface RawJsonlMessage {
  type: RawMessageType;
  uuid: string;
  timestamp: string;
  sessionId: string;
  parentUuid: string | null;
  isMeta?: boolean;
  isSidechain?: boolean;
  message: {
    id?: string;
    role: Role;
    content: string | RawContentBlock[];
    model?: string;
  };
  // Metadata
  cwd?: string;
  version?: string;
  gitBranch?: string;
  requestId?: string;
  userType?: string;
}

export interface RawTextBlock {
  type: "text";
  text: string;
}

export interface RawThinkingBlock {
  type: "thinking";
  thinking: string;
  signature?: string;
}

export interface RawToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface RawToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export type RawContentBlock =
  | RawTextBlock
  | RawThinkingBlock
  | RawToolUseBlock
  | RawToolResultBlock;

// =============================================================================
// Type Guards
// =============================================================================

export const isTextBlock = (block: ContentBlock): block is TextBlock =>
  block.type === BlockType.TEXT;

export const isThinkingBlock = (block: ContentBlock): block is ThinkingBlock =>
  block.type === BlockType.THINKING;

export const isToolResultBlock = (block: ContentBlock): block is ToolResultBlock =>
  block.type === BlockType.TOOL_RESULT;

export const isToolUseBlock = (block: ContentBlock): block is ToolUseBlock =>
  block.type === BlockType.TOOL_USE;

export const isMcpBlock = (block: ContentBlock): block is McpBlock => block.type === BlockType.MCP;

export const isQuestionBlock = (block: ContentBlock): block is QuestionBlock =>
  block.type === BlockType.QUESTION;

export const isBashBlock = (block: ContentBlock): block is BashBlock =>
  block.type === BlockType.BASH;

export const isFileReadBlock = (block: ContentBlock): block is FileReadBlock =>
  block.type === BlockType.FILE_READ;

export const isFileWriteBlock = (block: ContentBlock): block is FileWriteBlock =>
  block.type === BlockType.FILE_WRITE;

export const isFileEditBlock = (block: ContentBlock): block is FileEditBlock =>
  block.type === BlockType.FILE_EDIT;

export const isTasksBlock = (block: ContentBlock): block is TasksBlock =>
  block.type === BlockType.TASKS;

export const isSkippedMessageType = (type: string): boolean => type === "file-history-snapshot";
