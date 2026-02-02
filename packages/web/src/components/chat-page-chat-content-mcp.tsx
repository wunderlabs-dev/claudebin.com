import type { McpBlock } from "@/supabase/types/message";

type ChatPageChatContentMcpProps = {
  block: McpBlock;
};

const titleCase = (str: string): string =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const truncateValue = (value: unknown, maxLength = 50): string => {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

const ChatPageChatContentMcp = ({ block }: ChatPageChatContentMcpProps) => {
  const entries = Object.entries(block.input);

  return (
    <div className="flex flex-col gap-1 rounded-md border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs">🔌</span>
        <span className="font-medium text-gray-700 text-sm">{titleCase(block.server)}</span>
        <span className="text-gray-400 text-xs">→</span>
        <span className="text-gray-600 text-sm">{titleCase(block.tool)}</span>
      </div>
      {entries.length > 0 ? (
        <div className="mt-1 flex flex-col gap-0.5">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-2 text-xs">
              <span className="text-gray-500">{key}:</span>
              <span className="font-mono text-gray-700">{truncateValue(value)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { ChatPageChatContentMcp };
