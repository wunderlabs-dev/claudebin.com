import type { ReactNode } from "react";
import Markdown from "react-markdown";

import type { TextBlock } from "@/supabase/types/message";

import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentTextProps = {
  block: TextBlock;
};

const components = {
  hr: () => <Divider />,
  p: ({ children }: { children?: ReactNode }) => (
    <Typography variant="small">{children}</Typography>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <Typography variant="h3" as="h2">
      {children}
    </Typography>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <Typography variant="h4" as="h3">
      {children}
    </Typography>
  ),
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  pre: ({ children }: { children?: ReactNode }) => <pre>{children}</pre>,
  code: ({ children }: { children?: ReactNode }) => <code>{children}</code>,
  ul: ({ children }: { children?: ReactNode }) => <ul>{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol>{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
};

const ChatPageChatContentText = ({ block }: ChatPageChatContentTextProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Markdown components={components}>{block.text}</Markdown>
    </div>
  );
};

export { ChatPageChatContentText };
