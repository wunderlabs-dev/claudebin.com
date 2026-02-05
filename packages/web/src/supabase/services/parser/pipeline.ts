import type { ContentBlock, TaskItem } from "@/supabase/types/message";

import type { z } from "zod";

import {
  BlockType,
  MessageRole,
  parseSkillCommand,
  parseSkillMeta,
  type SkillCommandData,
} from "@/supabase/types/message";

import type {
  ImageBlockSchema,
  TextBlockSchema,
  RawContentBlock,
  RawJsonlMessage,
} from "./schemas";

import {
  BLOCK_TYPE_TO_RAW_TOOL,
  ToolInputSchema,
  extractTaskId,
  extractText,
  sanitizeResult,
  transformToolUse,
  enhanceToolOutput,
  normalizeImageBlock,
  normalizeBlock,
  isFilteredBlock,
  isTaskTool,
} from "./transforms";

type TrackedTaskTool = {
  id: string;
  name: string;
  input: Record<string, unknown>;
};

type PendingTool = {
  name: string;
  block: ContentBlock;
};

export type IntermediateMessage = {
  raw: RawJsonlMessage;
  content: ContentBlock[];
  toolNames: string[];
  textParts: string[];
};

export const createPipeline = () => {
  const msg = {
    blocks: [] as ContentBlock[],
    hasToolResult: false,
  };

  const pipeline = {
    pendingTools: new Map<string, PendingTool>(),
    taskToolMap: new Map<string, TrackedTaskTool>(),
    currentTasks: [] as TaskItem[],
    hasPendingTaskSnapshot: false,
    pendingSkillCommand: null as SkillCommandData | null,
    toolUseResult: undefined as unknown,
  };

  const acc = {
    messages: [] as IntermediateMessage[],
    current: null as IntermediateMessage | null,
    currentMsgId: null as string | null,
    currentIsAssistant: false,
  };

  const resetMessageState = (): void => {
    msg.blocks = [];
    msg.hasToolResult = false;
  };

  const getToolNames = (): string[] =>
    msg.blocks
      .map((b) => (b.type === BlockType.GENERIC ? b.name : BLOCK_TYPE_TO_RAW_TOOL[b.type]))
      .filter((name): name is string => !!name);

  const getTextParts = (): string[] =>
    msg.blocks.filter((b) => b.type === BlockType.TEXT).map((b) => (b as { text: string }).text);

  const emit = (block: ContentBlock): void => {
    msg.blocks.push(block);
  };

  const flushPendingTasks = (): void => {
    if (pipeline.hasPendingTaskSnapshot && pipeline.currentTasks.length > 0) {
      emit({ type: BlockType.TASKS, tasks: [...pipeline.currentTasks] });
      pipeline.hasPendingTaskSnapshot = false;
    }
  };

  const emitTasksSnapshot = (taskTool: TrackedTaskTool, result: string): void => {
    const taskId = extractTaskId(result);
    if (!taskId) return;

    if (taskTool.name === "TaskCreate") {
      const parsed = ToolInputSchema.TaskCreate.safeParse(taskTool.input);
      if (parsed.success) {
        pipeline.currentTasks.push({
          id: taskId,
          subject: parsed.data.subject,
          description: parsed.data.description,
          status: "pending",
        });
        pipeline.hasPendingTaskSnapshot = true;
      }
    }

    if (taskTool.name === "TaskUpdate") {
      const parsed = ToolInputSchema.TaskUpdate.safeParse(taskTool.input);
      const task = pipeline.currentTasks.find((t) => t.id === parsed.data?.taskId);
      if (parsed.success && task && parsed.data.status && task.status !== parsed.data.status) {
        task.status = parsed.data.status;
        pipeline.hasPendingTaskSnapshot = false;
        emit({ type: BlockType.TASKS, tasks: [...pipeline.currentTasks] });
      }
    }
  };

  const ingestToolResult = (raw: Extract<RawContentBlock, { type: "tool_result" }>): void => {
    msg.hasToolResult = true;
    const rawText = extractText(raw.content);

    const taskTool = pipeline.taskToolMap.get(raw.tool_use_id);
    if (taskTool) {
      emitTasksSnapshot(taskTool, sanitizeResult(taskTool.name, rawText));
      return;
    }

    const pending = pipeline.pendingTools.get(raw.tool_use_id);
    if (!pending) return;
    pipeline.pendingTools.delete(raw.tool_use_id);

    flushPendingTasks();

    const buildBlock = (extraFields: Record<string, unknown>): ContentBlock =>
      ({ ...pending.block, ...extraFields, is_error: raw.is_error }) as ContentBlock;

    if (pending.block.type === BlockType.MCP || pending.block.type === BlockType.GENERIC) {
      emit(buildBlock({ output: pipeline.toolUseResult }));
      return;
    }

    const outputFields = pipeline.toolUseResult
      ? enhanceToolOutput(pending.name, pipeline.toolUseResult)
      : null;

    if (outputFields) {
      emit(buildBlock(outputFields));
    } else {
      const errorFields = raw.is_error ? { error: sanitizeResult(pending.name, rawText) } : {};
      emit(buildBlock(errorFields));
    }
  };

  const ingestTaskTool = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    pipeline.taskToolMap.set(raw.id, { id: raw.id, name: raw.name, input: raw.input });
  };

  const ingestToolUse = (raw: Extract<RawContentBlock, { type: "tool_use" }>): void => {
    const block = transformToolUse(raw.id, raw.name, raw.input);
    pipeline.pendingTools.set(raw.id, { name: raw.name, block });
  };

  const ingestDefault = (raw: RawContentBlock): void => {
    const block = normalizeBlock(raw);
    if (!block || isFilteredBlock(block)) return;
    flushPendingTasks();
    emit(block);
  };

  const ingestBlock = (raw: RawContentBlock): void => {
    if (raw.type === "tool_result") {
      ingestToolResult(raw);
      return;
    }
    if (raw.type === "tool_use" && isTaskTool(raw.name)) {
      ingestTaskTool(raw);
      return;
    }
    if (raw.type === "tool_use") {
      ingestToolUse(raw);
      return;
    }
    ingestDefault(raw);
  };

  const isContentArray = (
    content: string | RawContentBlock[] | undefined,
  ): content is RawContentBlock[] => Array.isArray(content);

  const hasToolResultContent = (content: string | RawContentBlock[] | undefined): boolean =>
    isContentArray(content) && content.some((b) => b.type === "tool_result");

  const ingestSkillMeta = (content: string | RawContentBlock[] | undefined): void => {
    const text = typeof content === "string" ? content : extractText(content);
    const skillMeta = parseSkillMeta(text);
    resetMessageState();
    emit({
      type: BlockType.SKILL,
      ...pipeline.pendingSkillCommand!,
      instructions: skillMeta.instructions,
      output: skillMeta.output,
    });
    pipeline.pendingSkillCommand = null;
  };

  const ingestUserMessage = (content: string | RawContentBlock[] | undefined): void => {
    resetMessageState();
    if (!content) return;

    if (typeof content === "string") {
      const skillCommand = parseSkillCommand(content);
      if (skillCommand) {
        pipeline.pendingSkillCommand = skillCommand;
        return;
      }
      emit({ type: BlockType.TEXT, text: content });
      return;
    }

    const text = content
      .filter((b): b is z.infer<typeof TextBlockSchema> => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const attachments = content
      .filter((b): b is z.infer<typeof ImageBlockSchema> => b.type === "image")
      .map(normalizeImageBlock);

    emit({
      type: BlockType.TEXT,
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  const ingestContent = (content: RawContentBlock[] | undefined, isMeta?: boolean): boolean => {
    resetMessageState();
    if (!content) return false;

    if (isMeta && pipeline.pendingSkillCommand) {
      const skillMeta = parseSkillMeta(extractText(content));
      emit({
        type: BlockType.SKILL,
        ...pipeline.pendingSkillCommand,
        instructions: skillMeta.instructions,
        output: skillMeta.output,
      });
      pipeline.pendingSkillCommand = null;
      return true;
    }

    for (const raw of content) ingestBlock(raw);
    return false;
  };

  const startNewMessage = (r: RawJsonlMessage, msgId: string | null = null): void => {
    if (acc.current) acc.messages.push(acc.current);
    acc.current = {
      raw: r,
      content: msg.blocks,
      toolNames: getToolNames(),
      textParts: getTextParts(),
    };
    acc.currentMsgId = msgId;
    acc.currentIsAssistant = r.type === MessageRole.ASSISTANT;
  };

  const mergeIntoCurrent = (): void => {
    if (!acc.current) return;
    acc.current.content.push(...msg.blocks);
    acc.current.toolNames.push(...getToolNames());
    acc.current.textParts.push(...getTextParts());
  };

  const ingest = (r: RawJsonlMessage): void => {
    if (r.type !== MessageRole.USER && r.type !== MessageRole.ASSISTANT) {
      return;
    }

    pipeline.toolUseResult = r.toolUseResult;

    if (r.type === MessageRole.USER) {
      const content = r.message.content;

      // 1. Skill meta in USER message
      if (r.isMeta && pipeline.pendingSkillCommand) {
        ingestSkillMeta(content);
        mergeIntoCurrent();
        return;
      }

      // 2. Tool result in USER message - route through ingestContent
      if (hasToolResultContent(content)) {
        ingestContent(content as RawContentBlock[], r.isMeta);

        if (msg.hasToolResult && acc.currentIsAssistant) {
          mergeIntoCurrent();
        } else {
          startNewMessage(r);
        }
        return;
      }

      // 3. Regular user message (text/image/skill command)
      ingestUserMessage(content);
      startNewMessage(r);
      return;
    }

    // Assistant message handling
    const mergeWithPrevious = ingestContent(r.message.content, r.isMeta);
    const msgId = r.message.id ?? null;

    if (mergeWithPrevious && acc.current) {
      mergeIntoCurrent();
      return;
    }

    const isSameAssistantMessage =
      r.type === MessageRole.ASSISTANT && msgId && msgId === acc.currentMsgId;
    const isToolResultAfterAssistant = msg.hasToolResult && acc.currentIsAssistant;
    const shouldMerge = acc.current && (isSameAssistantMessage || isToolResultAfterAssistant);

    if (shouldMerge) {
      mergeIntoCurrent();
    } else {
      startNewMessage(r, msgId);
    }
  };

  const flush = (): void => {
    flushPendingTasks();

    for (const { block } of pipeline.pendingTools.values()) {
      emit(block);
    }
    pipeline.pendingTools.clear();

    if (acc.current) acc.messages.push(acc.current);
    acc.current = null;
  };

  return {
    ingest,
    flush,
    getMessages: () => acc.messages,
  };
};
