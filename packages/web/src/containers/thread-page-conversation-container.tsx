"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { BlockType } from "@/supabase/types/message";
import type { ContentBlock } from "@/supabase/types/message";

import { getMessagesBySessionId } from "@/actions/messages";
import { AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";

import { ChatPageChatContentText } from "@/components/chat-page-chat-content-text";
import { ChatPageChatContentBash } from "@/components/chat-page-chat-content-bash";
import { ChatPageChatContentFileRead } from "@/components/chat-page-chat-content-file-read";
import { ChatPageChatContentFileWrite } from "@/components/chat-page-chat-content-file-write";
import { ChatPageChatContentFileEdit } from "@/components/chat-page-chat-content-file-edit";
import { ChatPageChatContentGlob } from "@/components/chat-page-chat-content-glob";
import { ChatPageChatContentGrep } from "@/components/chat-page-chat-content-grep";
import { ChatPageChatContentTask } from "@/components/chat-page-chat-content-task";
import { ChatPageChatContentTasks } from "@/components/chat-page-chat-content-tasks";
import { ChatPageChatContentQuestions } from "@/components/chat-page-chat-content-questions";
import { ChatPageChatContentWebFetch } from "@/components/chat-page-chat-content-web-fetch";
import { ChatPageChatContentWebSearch } from "@/components/chat-page-chat-content-web-search";
import { ChatPageChatContentMcp } from "@/components/chat-page-chat-content-mcp";

type ThreadPageConversationContainerProps = {
  id: string;
  author: string;
  avatarUrl?: string | null;
};

const renderers = {
  block: (block: ContentBlock, index: number): ReactNode => {
    switch (block.type) {
      case BlockType.TEXT:
        return <ChatPageChatContentText key={index} block={block} />;
      case BlockType.BASH:
        return <ChatPageChatContentBash key={index} block={block} />;
      case BlockType.FILE_READ:
        return <ChatPageChatContentFileRead key={index} block={block} />;
      case BlockType.FILE_WRITE:
        return <ChatPageChatContentFileWrite key={index} block={block} />;
      case BlockType.FILE_EDIT:
        return <ChatPageChatContentFileEdit key={index} block={block} />;
      case BlockType.GLOB:
        return <ChatPageChatContentGlob key={index} block={block} />;
      case BlockType.GREP:
        return <ChatPageChatContentGrep key={index} block={block} />;
      case BlockType.TASK:
        return <ChatPageChatContentTask key={index} block={block} />;
      case BlockType.TASKS:
        return <ChatPageChatContentTasks key={index} block={block} />;
      case BlockType.QUESTION:
        return <ChatPageChatContentQuestions key={index} block={block} />;
      case BlockType.WEB_FETCH:
        return <ChatPageChatContentWebFetch key={index} block={block} />;
      case BlockType.WEB_SEARCH:
        return <ChatPageChatContentWebSearch key={index} block={block} />;
      case BlockType.MCP:
        return <ChatPageChatContentMcp key={index} block={block} />;
      default: {
        return null;
      }
    }
  },
};

const mockupMarkdown = `
# Hello, how can I help you today?
## Hello, how can I help you today?
I'll deeply analyze the repository structure for you, Vlad. Let me use an exploration agent to thoroughly examine the codebase.

### Repository Structure

| Component | Purpose |
|----------|---------|
| cli.py | Path encoding/decoding (Windows/Unix), project discovery, format selection |
| Table line title | Table line value |
| pager.py | Cross-platform less-like pager with j/k/space/b/g/G/q/h |
| base.py | Maps tool results to tool uses, groups messages by role |
| tools.py | 10 formatters: Bash, Read, Write, Edit, MultiEdit, Task, Grep, LS, TodoRead, TodoWrite |

## Key Design Patterns

- **Factory pattern** - The \`FormatterFactory\` class is responsible for creating the correct formatter instance based on the output target, supporting terminal, HTML, and animated rendering modes
- **Registry pattern** - Each tool formatter is registered by its tool name in a central registry, allowing dynamic lookup and dispatch when processing tool use blocks in the conversation
- **Template method** - The base formatter class defines the shared interface and rendering lifecycle, while concrete subclasses override specific methods to implement format-specific behavior

## Ordered list

1. Read the current session file from the local Claude project directory, normalize the file path, and parse the raw JSON contents into a structured session object with metadata
2. Upload the parsed session data to the Supabase API endpoint using the authenticated client, handling rate limits, retries, and validating the response payload before proceeding
3. Return the generated shareable URL back to the user, automatically copy it to the system clipboard, and display a confirmation message with the link in the terminal

---

The arhitecture is designed to be modular and extensible.
`;

const ThreadPageConversationContainer = ({
  id,
  author,
  avatarUrl,
}: ThreadPageConversationContainerProps): ReactNode => {
  const { data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessagesBySessionId(id),
  });

  const [fallback] = [...author];

  return (
    <Chat className="pr-14">
      <ChatItem variant="assistant">
        <Avatar size="sm">
          <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
        </Avatar>

        <ChatContent>
          <ChatPageChatContentText
            block={{
              type: "text",
              text: mockupMarkdown,
            }}
          />

          <ChatPageChatContentTasks
            block={{
              type: "tasks",
              tasks: [
                {
                  id: "1",
                  subject: "Read existing session code",
                  status: "completed",
                },
                {
                  id: "2",
                  subject: "Implement publishSession function",
                  status: "in_progress",
                },
                {
                  id: "3",
                  subject: "Add error handling",
                  status: "pending",
                },
              ],
            }}
          />

          <ChatPageChatContentFileRead
            block={{
              type: "file_read",
              id: "read-1",
              file_path: "src/formatters/html.py",
            }}
          />

          <ChatPageChatContentFileWrite
            block={{
              type: "file_write",
              id: "write-1",
              file_path: "src/lib/publish.ts",
              content: `import { createClient } from "@supabase/supabase-js";\n\nexport const publishSession = async (session: Session): Promise<string> => {\n  const { data, error } = await supabase\n    .from("sessions")\n    .insert({ content: session })\n    .select("id")\n    .single();\n\n  if (error) throw new Error(error.message);\n  return data.id;\n};`,
            }}
          />

          <ChatPageChatContentFileEdit
            block={{
              type: "file_edit",
              id: "edit-1",
              file_path: "src/commands/publish.ts",
              old_string: `  const result = await uploadSession(id);\n  console.log("Uploaded:", result);\n  return result;`,
              new_string: `  const result = await publishSession(id);\n  const url = \`https://claudebin.com/threads/\${result.id}\`;\n  await clipboard.copy(url);\n  console.log("Published:", url);\n  return url;`,
            }}
          />

          <ChatPageChatContentGlob
            block={{
              type: "glob",
              id: "glob-1",
              pattern: "src/commands/**/*.ts",
            }}
          />

          <ChatPageChatContentGrep
            block={{
              type: "grep",
              id: "grep-1",
              pattern: "export const publish",
              path: "src/commands",
            }}
          />

          <ChatPageChatContentBash
            block={{
              type: "bash",
              id: "bash-1",
              command: "bun test src/lib/publish.test.ts",
              description: "Run publish tests",
            }}
          />

          <ChatPageChatContentQuestions
            block={{
              type: "question",
              id: "question-1",
              questions: [
                {
                  question: "Should the session be public by default?",
                  header: "Visibility",
                  options: [
                    { label: "Public", description: "Anyone with the link can view" },
                    { label: "Private", description: "Only you can view" },
                    { label: "Unlisted", description: "Not indexed, but accessible via link" },
                  ],
                  multiSelect: false,
                },
              ],
            }}
          />

          <ChatPageChatContentWebSearch
            block={{
              type: "web_search",
              id: "search-1",
              query: "supabase storage upload file typescript",
            }}
          />

          <ChatPageChatContentWebFetch
            block={{
              type: "web_fetch",
              id: "fetch-1",
              url: "https://supabase.com/docs/reference/javascript/storage-from-upload",
              prompt: "How to upload a file to Supabase Storage",
            }}
          />

          <ChatPageChatContentTask
            block={{
              type: "task",
              id: "task-1",
              description: "Explore upload patterns",
              prompt: "Find how files are uploaded in the codebase",
              subagent_type: "Explore",
            }}
          />

          <ChatPageChatContentMcp
            block={{
              type: "mcp",
              id: "mcp-1",
              server: "claudebin",
              tool: "share",
              input: { project_path: "/Users/dev/project", is_public: true },
            }}
          />
        </ChatContent>
      </ChatItem>
    </Chat>
  );
};

export { ThreadPageConversationContainer };
