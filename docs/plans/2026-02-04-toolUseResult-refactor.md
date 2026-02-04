# toolUseResult Refactor Implementation Plan

**Date**: 2026-02-04
**Goal**: Replace generic `result: string` with rich typed output structures using `toolUseResult` from JSONL messages.

---

## Phase 1: Update Types (message.ts)

### 1.1 Remove ToolResult base interface
```typescript
// DELETE
export interface ToolResult {
  result?: string;
  is_error?: boolean;
}
```

### 1.2 Update FileReadBlock
```typescript
export interface FileReadBlock {
  type: typeof BlockType.FILE_READ;
  id: string;
  file_path: string;
  offset?: number;
  limit?: number;
  // Output from toolUseResult
  content?: string;
  numLines?: number;
  totalLines?: number;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.3 Update GlobBlock
```typescript
export interface GlobBlock {
  type: typeof BlockType.GLOB;
  id: string;
  pattern: string;
  path?: string;
  // Output from toolUseResult
  filenames?: string[];
  numFiles?: number;
  truncated?: boolean;
  durationMs?: number;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.4 Update GrepBlock
```typescript
export interface GrepBlock {
  type: typeof BlockType.GREP;
  id: string;
  pattern: string;
  path?: string;
  glob?: string;
  // Output from toolUseResult
  filenames?: string[];
  numFiles?: number;
  truncated?: boolean;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.5 Update BashBlock
```typescript
export interface BashBlock {
  type: typeof BlockType.BASH;
  id: string;
  command: string;
  description?: string;
  timeout?: number;
  // Output from toolUseResult
  stdout?: string;
  stderr?: string;
  interrupted?: boolean;
  // Error handling
  is_error?: boolean;
}
```

### 1.6 Update FileWriteBlock
```typescript
export interface FileWriteBlock {
  type: typeof BlockType.FILE_WRITE;
  id: string;
  file_path: string;
  content: string;
  // Output from toolUseResult
  success?: boolean;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.7 Update FileEditBlock
```typescript
export interface FileEditBlock {
  type: typeof BlockType.FILE_EDIT;
  id: string;
  file_path: string;
  old_string: string;
  new_string: string;
  // Output from toolUseResult
  success?: boolean;
  newContent?: string;
  structuredPatch?: Array<{
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    lines: string[];
  }>;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.8 Update WebFetchBlock
```typescript
export interface WebFetchBlock {
  type: typeof BlockType.WEB_FETCH;
  id: string;
  url: string;
  prompt: string;
  // Output from toolUseResult
  content?: string;
  statusCode?: number;
  statusText?: string;
  bytes?: number;
  durationMs?: number;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.9 Update WebSearchBlock
```typescript
export interface WebSearchBlock {
  type: typeof BlockType.WEB_SEARCH;
  id: string;
  query: string;
  // Output from toolUseResult
  content?: string;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.10 Update TaskBlock
```typescript
export interface TaskBlock {
  type: typeof BlockType.TASK;
  id: string;
  description: string;
  prompt: string;
  subagent_type: string;
  // Output from toolUseResult
  output?: string;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.11 Update QuestionBlock
```typescript
export interface QuestionBlock {
  type: typeof BlockType.QUESTION;
  id: string;
  questions: Array<{
    question: string;
    header: string;
    options: Array<{ label: string; description: string }>;
    multiSelect: boolean;
  }>;
  // Output from toolUseResult
  answers?: Record<string, string>;
  // Error handling
  is_error?: boolean;
}
```

### 1.12 Update McpBlock
```typescript
export interface McpBlock {
  type: typeof BlockType.MCP;
  id: string;
  server: string;
  tool: string;
  input: Record<string, unknown>;
  // Output from toolUseResult (generic - varies by MCP tool)
  output?: unknown;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

### 1.13 Update GenericBlock
```typescript
export interface GenericBlock {
  type: typeof BlockType.GENERIC;
  id: string;
  name: string;
  input: Record<string, unknown>;
  // Output from toolUseResult
  output?: unknown;
  // Error handling
  is_error?: boolean;
  error?: string;
}
```

---

## Phase 2: Update Parser (parser.ts)

### 2.1 Add toolUseResult to RawJsonlMessageSchema
```typescript
const RawJsonlMessageSchema = z.object({
  type: z.enum(["user", "assistant", "file-history-snapshot", "tool_result"]),
  uuid: z.string(),
  timestamp: z.string(),
  sessionId: z.string(),
  parentUuid: z.string().nullable(),
  isMeta: z.boolean().optional(),
  isSidechain: z.boolean().optional(),
  message: z.object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant"]),
    content: z.union([z.string(), z.array(RawContentBlockSchema)]),
    model: z.string().optional(),
  }),
  // NEW FIELDS
  toolUseResult: z.unknown().optional(),
  sourceToolAssistantUUID: z.string().optional(),
});
```

### 2.2 Add Zod schemas for each toolUseResult shape
```typescript
const ReadToolUseResult = z.object({
  type: z.literal("text"),
  file: z.object({
    filePath: z.string(),
    content: z.string(),
    numLines: z.number().optional(),
    startLine: z.number().optional(),
    totalLines: z.number().optional(),
  }),
});

const GlobToolUseResult = z.object({
  filenames: z.array(z.string()),
  durationMs: z.number().optional(),
  numFiles: z.number(),
  truncated: z.boolean(),
});

const BashToolUseResult = z.object({
  stdout: z.string(),
  stderr: z.string(),
  interrupted: z.boolean(),
  isImage: z.boolean().optional(),
});

const WriteToolUseResult = z.object({
  type: z.literal("create"),
  filePath: z.string(),
  content: z.string().optional(),
});

const EditToolUseResult = z.object({
  type: z.literal("update"),
  filePath: z.string(),
  content: z.string().optional(),
  structuredPatch: z.array(z.object({
    oldStart: z.number(),
    oldLines: z.number(),
    newStart: z.number(),
    newLines: z.number(),
    lines: z.array(z.string()),
  })).optional(),
});

const WebFetchToolUseResult = z.object({
  bytes: z.number().optional(),
  code: z.number(),
  codeText: z.string(),
  result: z.string(),
  durationMs: z.number(),
  url: z.string(),
});

const QuestionToolUseResult = z.object({
  questions: z.array(z.object({
    question: z.string(),
    header: z.string(),
    options: z.array(z.object({ label: z.string(), description: z.string() })),
    multiSelect: z.boolean(),
  })),
  answers: z.record(z.string(), z.string()),
});

const TodoToolUseResult = z.object({
  oldTodos: z.array(z.object({
    content: z.string(),
    status: z.enum(["pending", "in_progress", "completed"]),
    activeForm: z.string().optional(),
  })),
  newTodos: z.array(z.object({
    content: z.string(),
    status: z.enum(["pending", "in_progress", "completed"]),
    activeForm: z.string().optional(),
  })),
});
```

### 2.3 Update TrackedToolBlock type
```typescript
// Remove result?: string, add tool-specific output fields
type TrackedToolBlock = ContentBlock & {
  id: string;
  is_error?: boolean;
  error?: string;
  // Each block type will have its own output fields
};
```

### 2.4 Create attachToolOutput function
```typescript
const attachToolOutput = (
  block: TrackedToolBlock,
  toolName: string,
  toolUseResult: unknown,
  isError: boolean,
): void => {
  block.is_error = isError;

  // Handle error case (string)
  if (typeof toolUseResult === "string") {
    block.error = toolUseResult;
    return;
  }

  switch (toolName) {
    case RawTool.READ: {
      const parsed = ReadToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.FILE_READ) {
        block.content = sanitize(parsed.data.file.content);
        block.numLines = parsed.data.file.numLines;
        block.totalLines = parsed.data.file.totalLines;
      }
      break;
    }

    case RawTool.GLOB: {
      const parsed = GlobToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.GLOB) {
        block.filenames = parsed.data.filenames.map(toRelativePath);
        block.numFiles = parsed.data.numFiles;
        block.truncated = parsed.data.truncated;
        block.durationMs = parsed.data.durationMs;
      }
      break;
    }

    case RawTool.GREP: {
      const parsed = GlobToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.GREP) {
        block.filenames = parsed.data.filenames.map(toRelativePath);
        block.numFiles = parsed.data.numFiles;
        block.truncated = parsed.data.truncated;
      }
      break;
    }

    case RawTool.BASH: {
      const parsed = BashToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.BASH) {
        block.stdout = sanitize(parsed.data.stdout);
        block.stderr = sanitize(parsed.data.stderr);
        block.interrupted = parsed.data.interrupted;
      }
      break;
    }

    case RawTool.WRITE: {
      const parsed = WriteToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.FILE_WRITE) {
        block.success = true;
      }
      break;
    }

    case RawTool.EDIT: {
      const parsed = EditToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.FILE_EDIT) {
        block.success = true;
        block.newContent = parsed.data.content;
        block.structuredPatch = parsed.data.structuredPatch;
      }
      break;
    }

    case RawTool.WEB_FETCH: {
      const parsed = WebFetchToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.WEB_FETCH) {
        block.content = sanitize(parsed.data.result);
        block.statusCode = parsed.data.code;
        block.statusText = parsed.data.codeText;
        block.bytes = parsed.data.bytes;
        block.durationMs = parsed.data.durationMs;
      }
      break;
    }

    case RawTool.WEB_SEARCH: {
      // WebSearch result format TBD, use content for now
      if (block.type === BlockType.WEB_SEARCH && typeof toolUseResult === "object") {
        block.content = JSON.stringify(toolUseResult);
      }
      break;
    }

    case RawTool.TASK: {
      if (block.type === BlockType.TASK && typeof toolUseResult === "object") {
        block.output = JSON.stringify(toolUseResult);
      }
      break;
    }

    case RawTool.ASK_USER_QUESTION: {
      const parsed = QuestionToolUseResult.safeParse(toolUseResult);
      if (parsed.success && block.type === BlockType.QUESTION) {
        block.answers = parsed.data.answers;
      }
      break;
    }

    default: {
      // MCP or Generic - store raw output
      if (block.type === BlockType.MCP || block.type === BlockType.GENERIC) {
        block.output = toolUseResult;
      }
      break;
    }
  }
};
```

### 2.5 Update ingestToolResult to use toolUseResult
```typescript
const ingestToolResult = (
  raw: Extract<RawContentBlock, { type: "tool_result" }>,
  toolUseResult: unknown,
): void => {
  hasToolResult = true;

  const taskTool = taskToolMap.get(raw.tool_use_id);
  if (taskTool) {
    // Handle TodoWrite tools using toolUseResult
    const parsed = TodoToolUseResult.safeParse(toolUseResult);
    if (parsed.success) {
      emitTasksSnapshotFromResult(parsed.data.newTodos);
    }
    return;
  }

  const toolBlock = toolBlockMap.get(raw.tool_use_id);
  if (toolBlock) {
    const toolName = toolNameMap.get(raw.tool_use_id) ?? "";
    attachToolOutput(toolBlock, toolName, toolUseResult, raw.is_error ?? false);
  }
};
```

### 2.6 Update ingest to pass toolUseResult
```typescript
const ingest = (r: RawJsonlMessage): void => {
  if (isSkippedMessageType(r.type)) return;

  // Pass toolUseResult to ingestContent/ingestToolResult
  ingestContent(r.message.content, r.toolUseResult);
  // ... rest of function
};
```

---

## Phase 3: Update Frontend Components

### 3.1 chat-page-chat-content-bash.tsx
```typescript
const ChatPageChatContentBash = ({ block }: ChatPageChatContentBashProps) => {
  const hasOutput = block.stdout || block.stderr;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="bash">
        <AccordionTrigger>
          <SvgIconBash size="sm" color="primary" />
          {block.description ?? block.command}
          {block.interrupted && <span className="text-yellow-500 text-xs ml-2">interrupted</span>}
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.command} lang="bash" />
          {block.stdout && <Code code={block.stdout} />}
          {block.stderr && <Code code={block.stderr} className="text-red-400" />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.2 chat-page-chat-content-file-read.tsx
```typescript
const ChatPageChatContentFileRead = ({ block }: ChatPageChatContentFileReadProps) => {
  const t = useTranslations();
  const lineInfo = block.numLines
    ? `${block.numLines}${block.totalLines ? ` of ${block.totalLines}` : ""} lines`
    : null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-read">
        <AccordionTrigger>
          <SvgIconEye size="sm" color="primary" />
          {t("chat.read")}
          <ChatPageChatContentChip label={block.file_path} />
          {lineInfo && <span className="text-xs text-gray-500 ml-2">{lineInfo}</span>}
        </AccordionTrigger>
        <AccordionContent>
          {block.content && <Code code={block.content} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.3 chat-page-chat-content-glob.tsx
```typescript
const ChatPageChatContentGlob = ({ block }: ChatPageChatContentGlobProps) => {
  const t = useTranslations();
  const fileCount = block.numFiles ?? block.filenames?.length ?? 0;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="glob">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.glob")}
          <ChatPageChatContentChip label={block.pattern} />
          <span className="text-xs text-gray-500 ml-2">
            {fileCount} files{block.truncated && " (truncated)"}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {block.filenames && (
            <Code code={block.filenames.join("\n")} />
          )}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.4 chat-page-chat-content-grep.tsx
```typescript
const ChatPageChatContentGrep = ({ block }: ChatPageChatContentGrepProps) => {
  const t = useTranslations();
  const fileCount = block.numFiles ?? block.filenames?.length ?? 0;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="grep">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.grep")}
          <ChatPageChatContentChip label={block.pattern} />
          <span className="text-xs text-gray-500 ml-2">
            {fileCount} files{block.truncated && " (truncated)"}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {block.filenames && (
            <Code code={block.filenames.join("\n")} />
          )}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.5 chat-page-chat-content-questions.tsx
```typescript
const ChatPageChatContentQuestions = ({ block }: ChatPageChatContentQuestionsProps) => {
  return (
    <Fragment>
      {block.questions.map((question) => {
        const answer = block.answers?.[question.question];
        const selectedOption = question.options.find(o => o.label === answer);
        const isCustomAnswer = answer && !selectedOption;

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="small">{question.question}</Typography>
            <Tabs value={answer ?? ""}>
              <TabsList>
                {question.options.map((option) => (
                  <TabsTrigger
                    key={option.label}
                    value={option.label}
                    className={cn(
                      answer && answer !== option.label && "line-through opacity-50"
                    )}
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {isCustomAnswer && (
              <Typography variant="small" className="italic text-blue-500">
                Custom answer: {answer}
              </Typography>
            )}
          </div>
        );
      })}
    </Fragment>
  );
};
```

### 3.6 chat-page-chat-content-web-fetch.tsx
```typescript
const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  const t = useTranslations();
  const hasOutput = block.content || block.error;

  if (!hasOutput) {
    return (
      <Action icon={<SvgIconDownload size="sm" color="primary" />} title={t("chat.fetch")}>
        {block.url}
      </Action>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="web-fetch">
        <AccordionTrigger>
          <SvgIconDownload size="sm" color="primary" />
          {t("chat.fetch")}
          <ChatPageChatContentChip label={block.url} />
          {block.statusCode && (
            <span className="text-xs text-gray-500 ml-2">
              HTTP {block.statusCode}
              {block.durationMs && ` • ${block.durationMs}ms`}
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent>
          {block.content && <Code code={block.content} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.7 chat-page-chat-content-web-search.tsx
```typescript
const ChatPageChatContentWebSearch = ({ block }: ChatPageChatContentWebSearchProps) => {
  const t = useTranslations();
  const hasOutput = block.content || block.error;

  if (!hasOutput) {
    return (
      <Action icon={<SvgIconWorld size="sm" color="primary" />} title={t("chat.search")}>
        {block.query}
      </Action>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="web-search">
        <AccordionTrigger>
          <SvgIconWorld size="sm" color="primary" />
          {t("chat.search")}
          <ChatPageChatContentChip label={block.query} />
        </AccordionTrigger>
        <AccordionContent>
          {block.content && <Code code={block.content} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.8 chat-page-chat-content-task.tsx
```typescript
const ChatPageChatContentTask = ({ block }: ChatPageChatContentTaskProps) => {
  const t = useTranslations();
  const hasOutput = block.output || block.error;

  if (!hasOutput) {
    return (
      <Action icon={<SvgIconHammer size="sm" color="primary" />} title={t("chat.task")}>
        {block.description}
      </Action>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="task">
        <AccordionTrigger>
          <SvgIconHammer size="sm" color="primary" />
          {t("chat.task")}
          <ChatPageChatContentChip label={block.subagent_type} />
        </AccordionTrigger>
        <AccordionContent>
          <Typography variant="small" color="muted">{block.description}</Typography>
          {block.output && <Code code={block.output} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.9 chat-page-chat-content-mcp.tsx
```typescript
const ChatPageChatContentMcp = ({ block }: ChatPageChatContentMcpProps) => {
  const t = useTranslations();
  const input = formatInput(block.input);
  const output = block.output
    ? (typeof block.output === "string" ? block.output : JSON.stringify(block.output, null, 2))
    : null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="mcp">
        <AccordionTrigger>
          <SvgIconMcp size="sm" color="primary" />
          {t("chat.mcp")}
          <ChatPageChatContentChip label={`${block.server} → ${block.tool}`} />
        </AccordionTrigger>
        <AccordionContent>
          {input && <Code code={input} />}
          {output && <Code code={output} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

### 3.10 chat-page-chat-content-generic.tsx
```typescript
const ChatPageChatContentGeneric = ({ block }: ChatPageChatContentGenericProps) => {
  const output = block.output
    ? (typeof block.output === "string" ? block.output : JSON.stringify(block.output, null, 2))
    : null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="generic">
        <AccordionTrigger>
          <span className="font-medium">{block.name}</span>
        </AccordionTrigger>
        <AccordionContent>
          <Code code={JSON.stringify(block.input, null, 2)} />
          {output && <Code code={output} />}
          {block.error && <Code code={block.error} className="text-red-400" />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

---

## Phase 4: Update TasksBlock handling

### 4.1 Update emitTasksSnapshot to use TodoToolUseResult
```typescript
const emitTasksSnapshotFromResult = (newTodos: Array<{
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm?: string;
}>): void => {
  // Map TodoToolUseResult format to TaskItem format
  const tasks: TaskItem[] = newTodos.map((todo, idx) => ({
    id: String(idx + 1),
    subject: todo.content,
    status: todo.status,
  }));

  emit({ type: BlockType.TASKS, tasks });
};
```

---

## Implementation Checklist

### Phase 1: Types
- [ ] Remove `ToolResult` interface from message.ts
- [ ] Update `FileReadBlock` with typed output fields
- [ ] Update `GlobBlock` with typed output fields
- [ ] Update `GrepBlock` with typed output fields
- [ ] Update `BashBlock` with typed output fields
- [ ] Update `FileWriteBlock` with typed output fields
- [ ] Update `FileEditBlock` with typed output fields
- [ ] Update `WebFetchBlock` with typed output fields
- [ ] Update `WebSearchBlock` with typed output fields
- [ ] Update `TaskBlock` with typed output fields
- [ ] Update `QuestionBlock` with answers field
- [ ] Update `McpBlock` with output field
- [ ] Update `GenericBlock` with output field

### Phase 2: Parser
- [ ] Add `toolUseResult` to `RawJsonlMessageSchema`
- [ ] Add Zod schemas for each toolUseResult shape
- [ ] Update `TrackedToolBlock` type
- [ ] Create `attachToolOutput` function
- [ ] Update `ingestToolResult` to use `toolUseResult`
- [ ] Update `ingest` to pass `toolUseResult`
- [ ] Update `emitTasksSnapshot` for new format

### Phase 3: Components
- [ ] Update `chat-page-chat-content-bash.tsx`
- [ ] Update `chat-page-chat-content-file-read.tsx`
- [ ] Update `chat-page-chat-content-glob.tsx`
- [ ] Update `chat-page-chat-content-grep.tsx`
- [ ] Update `chat-page-chat-content-questions.tsx`
- [ ] Update `chat-page-chat-content-web-fetch.tsx`
- [ ] Update `chat-page-chat-content-web-search.tsx`
- [ ] Update `chat-page-chat-content-task.tsx`
- [ ] Update `chat-page-chat-content-mcp.tsx`
- [ ] Update `chat-page-chat-content-generic.tsx`

### Phase 4: Testing
- [ ] Run type check
- [ ] Test with real session data
- [ ] Verify all components render correctly

---

## Files to Modify

1. `packages/web/src/supabase/types/message.ts`
2. `packages/web/src/supabase/services/parser.ts`
3. `packages/web/src/components/chat-page-chat-content-bash.tsx`
4. `packages/web/src/components/chat-page-chat-content-file-read.tsx`
5. `packages/web/src/components/chat-page-chat-content-file-write.tsx`
6. `packages/web/src/components/chat-page-chat-content-file-edit.tsx`
7. `packages/web/src/components/chat-page-chat-content-glob.tsx`
8. `packages/web/src/components/chat-page-chat-content-grep.tsx`
9. `packages/web/src/components/chat-page-chat-content-questions.tsx`
10. `packages/web/src/components/chat-page-chat-content-web-fetch.tsx`
11. `packages/web/src/components/chat-page-chat-content-web-search.tsx`
12. `packages/web/src/components/chat-page-chat-content-task.tsx`
13. `packages/web/src/components/chat-page-chat-content-mcp.tsx`
14. `packages/web/src/components/chat-page-chat-content-generic.tsx`
