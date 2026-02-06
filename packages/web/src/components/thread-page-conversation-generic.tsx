import type { GenericBlock } from "@/supabase/types/message";

type ThreadPageConversationGenericProps = {
  block: GenericBlock;
};

const ThreadPageConversationGeneric = ({ block }: ThreadPageConversationGenericProps) => {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="font-medium">{block.name}</span>
      <pre className="overflow-x-auto px-1.5 py-0.5 bg-gray-100 rounded scrollbar-hidden">
        <code>{JSON.stringify(block.input, null, 2)}</code>
      </pre>
    </div>
  );
};

export { ThreadPageConversationGeneric };
