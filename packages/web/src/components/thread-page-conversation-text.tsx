"use client";

import Image from "next/image";
import { Children, isValidElement, useMemo, useState, type ReactNode } from "react";
import { head, last, split } from "ramda";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Attachment, Role, TextBlock } from "@/supabase/types/message";

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

type CodeElementProps = {
  children?: string;
  className?: string;
};

type ThreadPageConversationTextProps = {
  block: TextBlock;
};

type ImageAttachmentProps = {
  attachment: Attachment;
};

const ImageAttachmentComponent = ({ attachment }: ImageAttachmentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const src =
    attachment.sourceType === "base64"
      ? `data:${attachment.mediaType ?? "image/png"};base64,${attachment.data}`
      : attachment.data;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full max-w-md h-32 bg-gray-100 rounded-lg border border-gray-200">
        <Typography variant="small" className="text-gray-500">
          Failed to load image
        </Typography>
      </div>
    );
  }

  return (
    <div className="relative max-w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <Typography variant="small" className="text-gray-500">
            Loading...
          </Typography>
        </div>
      )}
      <Image
        src={src}
        alt="User attached screenshot"
        className="max-w-full h-auto rounded-lg border border-gray-200"
        width={800}
        height={600}
        unoptimized
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? "none" : "block", width: "auto", height: "auto" }}
      />
    </div>
  );
};

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
  hr: () => <Divider className="my-8" />,
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
    <code className="font-mono text-base">{children}</code>
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
  const hasText = block.text.trim().length > 0;
  const hasAttachments = block.attachments && block.attachments.length > 0;

  return (
    <div className="flex flex-col max-w-full gap-4 [&>*:first-child]:mt-0">
      {hasText && (
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
          {block.text}
        </Markdown>
      )}
      {hasAttachments &&
        block.attachments?.map((attachment) => (
          <ImageAttachmentComponent
            key={`${attachment.sourceType}-${attachment.data.slice(0, 50)}`}
            attachment={attachment}
          />
        ))}
    </div>
  );
};

export { ThreadPageConversationText };
