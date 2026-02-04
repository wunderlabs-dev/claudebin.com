"use client";

import { Children, isValidElement, useMemo, type ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Role, TextBlock } from "@/supabase/types/message";

import { useChatItemRole } from "@/components/ui/chat";
import { Code } from "@/components/ui/code";
import { Divider } from "@/components/ui/divider";
import { Steps, StepsItem } from "@/components/ui/steps";
import { Typography } from "@/components/ui/typography";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type ChatPageChatContentTextProps = {
  block: TextBlock;
};

const createComponents = (role: Role) => ({
  h1: ({ children }: { children?: ReactNode }) => <Typography variant="h3">{children}</Typography>,
  h2: ({ children }: { children?: ReactNode }) => <Typography variant="h4">{children}</Typography>,
  h3: ({ children }: { children?: ReactNode }) => (
    <Typography variant="body" fontWeight="bold">
      {children}
    </Typography>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <Typography variant="small" className="break-all">
      {children}
    </Typography>
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
    <code className="max-w-full overflow-x-auto scrollbar-hidden whitespace-nowrap rounded-sm bg-gray-200 px-2 py-0.5 font-mono text-base text-gray-600">
      {children}
    </code>
  ),
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
  pre: ({ children }: { children?: ReactNode }) => {
    const codeElement = Children.toArray(children)[0];

    if (isValidElement<{ children?: string; className?: string }>(codeElement)) {
      const code = String(codeElement.props.children).trimEnd();
      const lang = codeElement.props.className?.replace("language-", "") || "typescript";

      return <Code code={code} lang={lang} variant={role} />;
    }

    return <pre>{children}</pre>;
  },
  hr: () => <Divider className="my-8" />,
});

const ChatPageChatContentText = ({ block }: ChatPageChatContentTextProps) => {
  const role = useChatItemRole();
  const components = useMemo(() => createComponents(role), [role]);

  return (
    <div className="flex flex-col max-w-full gap-4 [&>*:first-child]:mt-0">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {block.text}
      </Markdown>
    </div>
  );
};

export { ChatPageChatContentText };
