import type { ReactNode } from "react";

import type { Message } from "@/supabase/repos/messages";
import type { ContentBlock } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

type ThreadMessageItemProps = {
  message: Message;
};

const ThreadMessageItem = ({ message }: ThreadMessageItemProps): ReactNode => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "rounded-lg p-4",
        isUser ? "border border-blue-200 bg-blue-50" : "border border-gray-200 bg-gray-50",
      )}
    >
      <div className="mb-2 font-medium text-gray-600 text-sm">{isUser ? "User" : "Assistant"}</div>
      <div className="flex flex-col gap-2">
        {message.content.map((block, index) => (
          <ContentBlockRenderer key={`${block.type}-${index}`} block={block} />
        ))}
      </div>
    </div>
  );
};

type ContentBlockRendererProps = {
  block: ContentBlock;
};

const ContentBlockRenderer = ({ block }: ContentBlockRendererProps): ReactNode => {
  switch (block.type) {
    case "text":
      return <div className="whitespace-pre-wrap">{block.text}</div>;

    case "bash":
      return (
        <div className="rounded bg-gray-900 p-3 font-mono text-green-400 text-sm">
          <div className="mb-1 text-gray-500 text-xs">$ {block.description ?? "bash"}</div>
          <code>{block.command}</code>
        </div>
      );

    case "file_read":
      return (
        <div className="rounded border border-green-300 bg-green-50 p-2 text-sm">
          <span className="font-medium text-green-700">Read:</span> {block.file_path}
        </div>
      );

    case "file_write":
      return (
        <div className="rounded border border-blue-300 bg-blue-50 p-2 text-sm">
          <span className="font-medium text-blue-700">Write:</span> {block.file_path}
        </div>
      );

    case "file_edit":
      return (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-2 text-sm">
          <span className="font-medium text-yellow-700">Edit:</span> {block.file_path}
        </div>
      );

    case "glob":
      return (
        <div className="rounded border border-cyan-300 bg-cyan-50 p-2 text-sm">
          <span className="font-medium text-cyan-700">Glob:</span> {block.pattern}
        </div>
      );

    case "grep":
      return (
        <div className="rounded border border-cyan-300 bg-cyan-50 p-2 text-sm">
          <span className="font-medium text-cyan-700">Grep:</span> {block.pattern}
        </div>
      );

    case "tool_result":
      return (
        <div
          className={cn(
            "rounded p-2 font-mono text-xs",
            block.is_error ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700",
          )}
        >
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap">{block.content}</pre>
        </div>
      );

    case "tool_use":
      return (
        <div className="rounded border border-purple-300 bg-purple-50 p-2 text-sm">
          <span className="font-medium text-purple-700">Tool:</span> {block.name}
        </div>
      );

    case "todo":
      return (
        <div className="rounded border border-green-300 bg-green-50 p-2 text-sm">
          <div className="mb-1 font-medium text-green-700">Todos:</div>
          <ul className="list-disc pl-4">
            {block.todos.map((todo) => (
              <li key={todo.content} className={cn(todo.status === "completed" && "line-through")}>
                {todo.content}
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return (
        <div className="rounded bg-gray-100 p-2 text-gray-500 text-sm">
          Unknown block type: {(block as ContentBlock).type}
        </div>
      );
  }
};

export { ThreadMessageItem };
