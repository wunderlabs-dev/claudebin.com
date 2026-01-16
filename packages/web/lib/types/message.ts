// Claude Code Message Types
// Normalized data structures for session display

// =============================================================================
// Core Message Types
// =============================================================================

export type Role = "user" | "assistant";

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
  TEXT: "text",
  TOOL_USE: "tool_use",
  TOOL_RESULT: "tool_result",
} as const;

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export interface TextBlock {
  type: typeof BlockType.TEXT;
  text: string;
}

export interface ToolUseBlock {
  type: typeof BlockType.TOOL_USE;
  id: string;
  name: ToolName;
  input: ToolInput;
}

export interface ToolResultBlock {
  type: typeof BlockType.TOOL_RESULT;
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

// =============================================================================
// Tool Names
// =============================================================================

// Built-in Claude Code tools
export type BuiltInTool =
  | "Bash"
  | "Read"
  | "Write"
  | "Edit"
  | "MultiEdit"
  | "Glob"
  | "Grep"
  | "LS"
  | "Task"
  | "TodoRead"
  | "TodoWrite"
  | "WebFetch"
  | "WebSearch"
  | "NotebookEdit"
  | "AskUserQuestion"
  | "Skill"
  | "KillShell"
  | "TaskOutput";

// MCP plugin tools follow pattern: mcp__{server}__{tool}
export type McpTool = `mcp__${string}__${string}`;

export type ToolName = BuiltInTool | McpTool | string;

// =============================================================================
// Tool Inputs
// =============================================================================

export type ToolInput =
  | BashInput
  | ReadInput
  | WriteInput
  | EditInput
  | MultiEditInput
  | GlobInput
  | GrepInput
  | LSInput
  | TaskInput
  | TodoWriteInput
  | WebFetchInput
  | WebSearchInput
  | NotebookEditInput
  | AskUserQuestionInput
  | SkillInput
  | Record<string, unknown>; // Fallback for unknown tools

export interface BashInput {
  command: string;
  description?: string;
  timeout?: number;
  run_in_background?: boolean;
}

export interface ReadInput {
  file_path: string;
  offset?: number;
  limit?: number;
}

export interface WriteInput {
  file_path: string;
  content: string;
}

export interface EditInput {
  file_path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}

export interface MultiEditInput {
  file_path: string;
  edits: Array<{
    old_string: string;
    new_string: string;
  }>;
}

export interface GlobInput {
  pattern: string;
  path?: string;
}

export interface GrepInput {
  pattern: string;
  path?: string;
  glob?: string;
  type?: string;
  output_mode?: "content" | "files_with_matches" | "count";
}

export interface LSInput {
  path: string;
}

export interface TaskInput {
  description: string;
  prompt: string;
  subagent_type: string;
  model?: string;
  run_in_background?: boolean;
}

export interface TodoWriteInput {
  todos: Array<{
    content: string;
    status: "pending" | "in_progress" | "completed";
    activeForm: string;
  }>;
}

export interface WebFetchInput {
  url: string;
  prompt: string;
}

export interface WebSearchInput {
  query: string;
  allowed_domains?: string[];
  blocked_domains?: string[];
}

export interface NotebookEditInput {
  notebook_path: string;
  cell_id?: string;
  cell_type?: "code" | "markdown";
  edit_mode?: "replace" | "insert" | "delete";
  new_source: string;
}

export interface AskUserQuestionInput {
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

export interface SkillInput {
  skill: string;
  args?: string;
}

// =============================================================================
// Raw JSONL Types (what we receive from Claude Code)
// =============================================================================

export type RawMessageType =
  | "user"
  | "assistant"
  | "file-history-snapshot"
  | "tool_result";

export interface RawJsonlMessage {
  type: RawMessageType;
  message: {
    type: string;
    uuid: string;
    timestamp: string;
    sessionId: string;
    parentUuid: string | null;
    isMeta?: boolean;
    isSidechain?: boolean;
    message: {
      role: Role;
      content: string | RawContentBlock[];
    };
    // Metadata
    cwd?: string;
    version?: string;
    gitBranch?: string;
    model?: string;
    requestId?: string;
    userType?: string;
  };
}

export interface RawTextBlock {
  type: "text";
  text: string;
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
  TodoRead: "check-square",
  TodoWrite: "check-square",
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
  TodoRead: "green",
  TodoWrite: "green",
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
  block.type === "text";

export const isToolUseBlock = (block: ContentBlock): block is ToolUseBlock =>
  block.type === "tool_use";

export const isToolResultBlock = (
  block: ContentBlock,
): block is ToolResultBlock => block.type === "tool_result";

export const isMcpTool = (name: string): name is McpTool =>
  name.startsWith("mcp__");

export const isSkippedMessageType = (type: string): boolean =>
  type === "file-history-snapshot";
