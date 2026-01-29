import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";

import type { TextBlock } from "@/supabase/types/message";

import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentTextProps = {
  block: TextBlock;
};

type WithNode<T> = T & { node?: unknown };

const components = {
  hr: () => <Divider />,
  p: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"p">>) => (
    <Typography variant="small" {...props} />
  ),
  h2: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"h2">>) => (
    <Typography variant="h3" as="h2" {...props} />
  ),
  h3: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"h3">>) => (
    <Typography variant="h4" as="h3" {...props} />
  ),
  em: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"em">>) => (
    <em className="italic" {...props} />
  ),
  strong: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"strong">>) => (
    <strong className="font-semibold" {...props} />
  ),
  pre: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"pre">>) => (
    <pre className="overflow-x-auto rounded-sm bg-gray-200 p-3" {...props} />
  ),
  code: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"code">>) => <code {...props} />,
  ul: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"ul">>) => (
    <ul className="list-disc pl-4" {...props} />
  ),
  ol: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"ol">>) => (
    <ol className="list-decimal pl-4" {...props} />
  ),
  li: ({ node: _, ...props }: WithNode<ComponentPropsWithoutRef<"li">>) => (
    <li className="leading-relaxed" {...props} />
  ),
};

const ChatPageChatContentText = ({ block }: ChatPageChatContentTextProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Markdown components={components}>{block.text}</Markdown>
    </div>
  );
};

export { ChatPageChatContentText };
