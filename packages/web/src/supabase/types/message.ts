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
  TOOL_USE: "tool_use", // Fallback for unknown/MCP tools

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
  | ToolUseBlock // Fallback for unknown/MCP tools
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

// Fallback for unknown tools (MCP, etc.)
export interface ToolUseBlock {
  type: typeof BlockType.TOOL_USE;
  id: string;
  name: string;
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
// Tool Name Mapping (raw name → block type)
// =============================================================================

export const TOOL_TO_BLOCK_TYPE: Record<string, string> = {
  AskUserQuestion: BlockType.QUESTION,
  Bash: BlockType.BASH,
  Read: BlockType.FILE_READ,
  Write: BlockType.FILE_WRITE,
  Edit: BlockType.FILE_EDIT,
  Glob: BlockType.GLOB,
  Grep: BlockType.GREP,
  Task: BlockType.TASK,
  WebFetch: BlockType.WEB_FETCH,
  WebSearch: BlockType.WEB_SEARCH,
};

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
// Display Helpers
// =============================================================================

export const TOOL_ICONS: Record<string, string> = {
  Bash: "terminal",
  Read: "file-text",
  Write: "file-plus",
  Edit: "edit",
  MultiEdit: "edit-3",
  Glob: "search",
  Grep: "search",
  LS: "folder",
  Task: "cpu",
  WebFetch: "globe",
  WebSearch: "search",
  NotebookEdit: "book-open",
  AskUserQuestion: "help-circle",
  Skill: "zap",
  KillShell: "x-circle",
  TaskOutput: "terminal",
};

export const TOOL_COLORS: Record<string, string> = {
  Bash: "red",
  Read: "green",
  Write: "blue",
  Edit: "yellow",
  MultiEdit: "yellow",
  Glob: "cyan",
  Grep: "cyan",
  LS: "blue",
  Task: "purple",
  WebFetch: "indigo",
  WebSearch: "indigo",
  NotebookEdit: "orange",
  AskUserQuestion: "pink",
  Skill: "amber",
};

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
