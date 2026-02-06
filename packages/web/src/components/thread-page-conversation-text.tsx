"use client";

import { Children, isValidElement, useMemo, type ReactNode } from "react";
import { head, last, split } from "ramda";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Role, TextBlock } from "@/supabase/types/message";

import { useChatItemRole } from "@/components/ui/chat";

import { Code } from "@/components/ui/code";
import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/ui/typography";
import { Steps, StepsItem } from "@/components/ui/steps";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { ThreadPageConversationAttachmentChip } from "@/components/thread-page-conversation-attachment-chip";

type CodeElementProps = {
  children?: string;
  className?: string;
};

type ThreadPageConversationTextProps = {
  block: TextBlock;
};

const REMARK_PLUGINS = [remarkGfm];

const parseCodeBlock = (children: ReactNode) => {
  const firstChild = head(Children.toArray(children));

  if (isValidElement<CodeElementProps>(firstChild)) {
    return {
      code: String(firstChild.props.children).trimEnd(),
      lang: last(split("language-", firstChild.props.className ?? "typescript")),
    };
  }
  return null;
};

const createComponents = (role: Role) => ({
  hr: () => <Divider />,
  table: ({ children }: { children?: ReactNode }) => <Table variant={role}>{children}</Table>,
  thead: ({ children }: { children?: ReactNode }) => <TableHeader>{children}</TableHeader>,
  tbody: ({ children }: { children?: ReactNode }) => <TableBody>{children}</TableBody>,
  tr: ({ children }: { children?: ReactNode }) => <TableRow>{children}</TableRow>,
  th: ({ children }: { children?: ReactNode }) => <TableHead>{children}</TableHead>,
  td: ({ children }: { children?: ReactNode }) => <TableCell>{children}</TableCell>,
  ol: ({ children }: { children?: ReactNode }) => <Steps variant="ordered">{children}</Steps>,
  ul: ({ children }: { children?: ReactNode }) => <Steps variant="unordered">{children}</Steps>,
  li: ({ children }: { children?: ReactNode }) => <StepsItem>{children}</StepsItem>,
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  h1: ({ children }: { children?: ReactNode }) => <Typography variant="h3">{children}</Typography>,
  h2: ({ children }: { children?: ReactNode }) => <Typography variant="h4">{children}</Typography>,
  h3: ({ children }: { children?: ReactNode }) => (
    <Typography variant="body" fontWeight="bold">
      {children}
    </Typography>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <Typography variant="small">{children}</Typography>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} className="text-orange-50 hover:underline">
      {children}
    </a>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="text-base font-mono">{children}</code>
  ),
  pre: ({ children }: { children?: ReactNode }) => {
    const parsed = parseCodeBlock(children);

    if (parsed) {
      return <Code {...parsed} />;
    }
    return <pre>{children}</pre>;
  },
});

const ThreadPageConversationText = ({ block }: ThreadPageConversationTextProps) => {
  const role = useChatItemRole();
  const components = useMemo(() => createComponents(role), [role]);

  return (
    <div className="flex flex-col max-w-full gap-4 break-all [&>*:first-child]:mt-0">
      {block.text.trim().length ? (
        <Markdown remarkPlugins={REMARK_PLUGINS} components={components}>
          {block.text}
        </Markdown>
      ) : null}

      {block.attachments?.length ? (
        <div className="flex gap-2">
          {block.attachments?.map((attachment) => (
            <ThreadPageConversationAttachmentChip key={attachment.data} attachment={attachment} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { ThreadPageConversationText };
