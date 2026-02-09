import type { Message } from "@/supabase/repos/messages";
import type { ContentBlock } from "@/supabase/types/message";
import { BlockType, MessageRole } from "@/supabase/types/message";

const blockToMarkdown = (block: ContentBlock): string => {
  switch (block.type) {
    case BlockType.TEXT:
      return block.text;

    case BlockType.THINKING:
      return `<thinking>\n${block.thinking}\n</thinking>`;

    case BlockType.BASH:
      return `> Ran \`${block.command}\``;

    case BlockType.FILE_READ:
      return `> Read \`${block.file_path}\``;

    case BlockType.FILE_WRITE:
      return `> Wrote \`${block.file_path}\``;

    case BlockType.FILE_EDIT:
      return `> Edited \`${block.file_path}\``;

    case BlockType.GLOB:
      return `> Searched for \`${block.pattern}\`${block.numFiles ? ` (${block.numFiles} files)` : ""}`;

    case BlockType.GREP:
      return `> Grepped for \`${block.pattern}\`${block.numFiles ? ` (${block.numFiles} matches)` : ""}`;

    case BlockType.TASK:
      return `> Spawned task: ${block.description}`;

    case BlockType.TASK_OUTPUT:
      return `> Task output (${block.task_id})`;

    case BlockType.TASK_STOP:
      return `> Stopped task (${block.task_id})`;

    case BlockType.WEB_FETCH:
      return `> Fetched ${block.url}`;

    case BlockType.WEB_SEARCH:
      return `> Searched: ${block.query}`;

    case BlockType.MCP:
      return `> MCP: ${block.server}/${block.tool}`;

    case BlockType.QUESTION:
      return `> Asked question: ${block.questions[0]?.question ?? ""}`;

    case BlockType.TASKS:
      return `> Todos: ${block.tasks.length} items`;

    case BlockType.SKILL:
      return `> Used skill: ${block.commandName}`;

    case BlockType.GENERIC:
      return `> Tool: ${block.name}`;

    default:
      return "";
  }
};

const messageToMarkdown = (message: Message): string => {
  const role = message.role === MessageRole.USER ? "User" : "Assistant";
  const content = message.content.map(blockToMarkdown).filter(Boolean).join("\n\n");

  return `## ${role}\n\n${content}`;
};

export const messagesToMarkdown = (messages: Message[]): string => {
  return messages.map(messageToMarkdown).join("\n\n");
};
