import type { Message } from "@/lib/repos/messages.repo";
import { BlockType } from "@/lib/types/message";
import {
  BashContent,
  FileEditContent,
  FileReadContent,
  FileWriteContent,
  GenericToolContent,
  GlobContent,
  GrepContent,
  QuestionContent,
  TaskContent,
  TextContent,
  TodoContent,
  ToolResultContent,
  WebFetchContent,
  WebSearchContent,
} from "./content-blocks";

export const MessageContent = ({ message }: { message: Message }) => {
  const { role, content, model } = message;

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        role === "user"
          ? "bg-blue-50 border border-blue-200"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {role || "unknown"}
        </span>
        {model && (
          <span className="text-xs text-gray-400 font-mono">{model}</span>
        )}
      </div>

      {content.map((block, i) => {
        const key = "id" in block ? block.id : `${block.type}-${i}`;
        switch (block.type) {
          case BlockType.TEXT:
            return <TextContent key={key} text={block.text} />;
          case BlockType.TOOL_RESULT:
            return (
              <ToolResultContent
                key={key}
                content={block.content}
                isError={block.is_error}
              />
            );
          case BlockType.TOOL_USE:
            return (
              <GenericToolContent
                key={key}
                name={block.name}
                input={block.input}
              />
            );
          case BlockType.BASH:
            return (
              <BashContent
                key={key}
                command={block.command}
                description={block.description}
              />
            );
          case BlockType.FILE_READ:
            return <FileReadContent key={key} file_path={block.file_path} />;
          case BlockType.FILE_WRITE:
            return <FileWriteContent key={key} file_path={block.file_path} />;
          case BlockType.FILE_EDIT:
            return <FileEditContent key={key} file_path={block.file_path} />;
          case BlockType.GLOB:
            return (
              <GlobContent
                key={key}
                pattern={block.pattern}
                path={block.path}
              />
            );
          case BlockType.GREP:
            return (
              <GrepContent
                key={key}
                pattern={block.pattern}
                path={block.path}
              />
            );
          case BlockType.TODO:
            return <TodoContent key={key} todos={block.todos} />;
          case BlockType.QUESTION:
            return <QuestionContent key={key} questions={block.questions} />;
          case BlockType.TASK:
            return (
              <TaskContent
                key={key}
                description={block.description}
                subagent_type={block.subagent_type}
              />
            );
          case BlockType.WEB_SEARCH:
            return <WebSearchContent key={key} query={block.query} />;
          case BlockType.WEB_FETCH:
            return <WebFetchContent key={key} url={block.url} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
