export const MessageRole = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type Role = (typeof MessageRole)[keyof typeof MessageRole];

export const BlockType = {
  TEXT: "text",
  THINKING: "thinking",
  TOOL_RESULT: "tool_result",
  TOOL_USE: "tool_use",
  MCP: "mcp",
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
  | ToolUseBlock
  | McpBlock
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
  is_error?: boolean;
}

export interface ToolUseBlock {
  type: typeof BlockType.TOOL_USE;
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface McpBlock {
  type: typeof BlockType.MCP;
  id: string;
  server: string;
  tool: string;
  input: Record<string, unknown>;
}

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
