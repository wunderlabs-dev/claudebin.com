import type { Message as MessageDb } from "@/lib/repos/messages.repo";
import { BlockType, MessageRole } from "@/lib/types/message";
import {
  BashBlock,
  FileEditBlock,
  FileReadBlock,
  FileWriteBlock,
  GenericToolBlock,
  GlobBlock,
  GrepBlock,
  QuestionBlock,
  TaskBlock,
  TextBlock,
  TodoBlock,
  ToolResultBlock,
  WebFetchBlock,
  WebSearchBlock,
} from "./blocks";

export const Message = ({ message }: { message: MessageDb }) => {
  const { role, content, model } = message;

  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        role === MessageRole.USER
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
            return <TextBlock key={key} text={block.text} />;
          case BlockType.TOOL_RESULT:
            return (
              <ToolResultBlock
                key={key}
                content={block.content}
                isError={block.is_error}
              />
            );
          case BlockType.TOOL_USE:
            return (
              <GenericToolBlock
                key={key}
                name={block.name}
                input={block.input}
              />
            );
          case BlockType.BASH:
            return (
              <BashBlock
                key={key}
                command={block.command}
                description={block.description}
              />
            );
          case BlockType.FILE_READ:
            return <FileReadBlock key={key} file_path={block.file_path} />;
          case BlockType.FILE_WRITE:
            return <FileWriteBlock key={key} file_path={block.file_path} />;
          case BlockType.FILE_EDIT:
            return <FileEditBlock key={key} file_path={block.file_path} />;
          case BlockType.GLOB:
            return (
              <GlobBlock key={key} pattern={block.pattern} path={block.path} />
            );
          case BlockType.GREP:
            return (
              <GrepBlock key={key} pattern={block.pattern} path={block.path} />
            );
          case BlockType.TODO:
            return <TodoBlock key={key} todos={block.todos} />;
          case BlockType.QUESTION:
            return <QuestionBlock key={key} questions={block.questions} />;
          case BlockType.TASK:
            return (
              <TaskBlock
                key={key}
                description={block.description}
                subagent_type={block.subagent_type}
              />
            );
          case BlockType.WEB_SEARCH:
            return <WebSearchBlock key={key} query={block.query} />;
          case BlockType.WEB_FETCH:
            return <WebFetchBlock key={key} url={block.url} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
