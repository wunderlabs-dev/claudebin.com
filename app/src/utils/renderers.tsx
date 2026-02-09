import type { ReactNode } from "react";

import { BlockType } from "@/supabase/types/message";
import type { ContentBlock } from "@/supabase/types/message";

import { ThreadPageConversationText } from "@/components/thread-page-conversation-text";
import { ThreadPageConversationBash } from "@/components/thread-page-conversation-bash";
import { ThreadPageConversationFileRead } from "@/components/thread-page-conversation-file-read";
import { ThreadPageConversationFileWrite } from "@/components/thread-page-conversation-file-write";
import { ThreadPageConversationFileEdit } from "@/components/thread-page-conversation-file-edit";
import { ThreadPageConversationGlob } from "@/components/thread-page-conversation-glob";
import { ThreadPageConversationGrep } from "@/components/thread-page-conversation-grep";
import { ThreadPageConversationTask } from "@/components/thread-page-conversation-task";
import { ThreadPageConversationTaskOutput } from "@/components/thread-page-conversation-task-output";
import { ThreadPageConversationTaskStop } from "@/components/thread-page-conversation-task-stop";
import { ThreadPageConversationTasks } from "@/components/thread-page-conversation-tasks";
import { ThreadPageConversationQuestions } from "@/components/thread-page-conversation-questions";
import { ThreadPageConversationWebFetch } from "@/components/thread-page-conversation-web-fetch";
import { ThreadPageConversationWebSearch } from "@/components/thread-page-conversation-web-search";
import { ThreadPageConversationMcp } from "@/components/thread-page-conversation-mcp";
import { ThreadPageConversationGeneric } from "@/components/thread-page-conversation-generic";
import { ThreadPageConversationSkill } from "@/components/thread-page-conversation-skill";

export const gradient = (chunks: ReactNode) => (
  <span className="inline-block bg-linear-to-r from-orange-200 to-orange-50 bg-clip-text text-transparent">
    {chunks}
  </span>
);

export const block = (content: ContentBlock, index: number): ReactNode => {
  switch (content.type) {
    case BlockType.TEXT:
      return <ThreadPageConversationText key={index} block={content} />;
    case BlockType.BASH:
      return <ThreadPageConversationBash key={index} block={content} />;
    case BlockType.FILE_READ:
      return <ThreadPageConversationFileRead key={index} block={content} />;
    case BlockType.FILE_WRITE:
      return <ThreadPageConversationFileWrite key={index} block={content} />;
    case BlockType.FILE_EDIT:
      return <ThreadPageConversationFileEdit key={index} block={content} />;
    case BlockType.GLOB:
      return <ThreadPageConversationGlob key={index} block={content} />;
    case BlockType.GREP:
      return <ThreadPageConversationGrep key={index} block={content} />;
    case BlockType.TASK:
      return <ThreadPageConversationTask key={index} block={content} />;
    case BlockType.TASK_OUTPUT:
      return <ThreadPageConversationTaskOutput key={index} block={content} />;
    case BlockType.TASK_STOP:
      return <ThreadPageConversationTaskStop key={index} block={content} />;
    case BlockType.TASKS:
      return <ThreadPageConversationTasks key={index} block={content} />;
    case BlockType.QUESTION:
      return <ThreadPageConversationQuestions key={index} block={content} />;
    case BlockType.WEB_FETCH:
      return <ThreadPageConversationWebFetch key={index} block={content} />;
    case BlockType.WEB_SEARCH:
      return <ThreadPageConversationWebSearch key={index} block={content} />;
    case BlockType.MCP:
      return <ThreadPageConversationMcp key={index} block={content} />;
    case BlockType.GENERIC:
      return <ThreadPageConversationGeneric key={index} block={content} />;
    case BlockType.SKILL:
      return <ThreadPageConversationSkill key={index} block={content} />;
    default:
      return null;
  }
};
