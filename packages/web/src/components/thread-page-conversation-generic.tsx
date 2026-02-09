// @TODO: style
import type { GenericBlock } from "@/supabase/types/message";

import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationGenericProps = {
  block: GenericBlock;
};

const ThreadPageConversationGeneric = ({ block }: ThreadPageConversationGenericProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="small">{block.name}</Typography>
      <Code code={JSON.stringify(block.input)} />
    </div>
  );
};

export { ThreadPageConversationGeneric };
