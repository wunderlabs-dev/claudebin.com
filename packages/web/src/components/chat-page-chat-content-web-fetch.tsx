"use client";

import prettyBytes from "pretty-bytes";
import { useTranslations } from "next-intl";

import type { WebFetchBlock } from "@/supabase/types/message";

import { SvgIconDownload } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";


type ChatPageChatContentWebFetchProps = {
  block: WebFetchBlock;
};

const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="web-fetch">
        <AccordionTrigger>
          <SvgIconDownload size="sm" color="primary" />
          {t("chat.fetch")}
          {block.statusCode ? (
            <Typography variant="small" className="shrink-0 text-gray-400">
              {block.statusCode} {block.statusText}
            </Typography>
          ) : null}
          {block.bytes ? (
            <Typography variant="small" className="shrink-0 text-gray-400">
              {prettyBytes(block.bytes)}
            </Typography>
          ) : null}
          <ChatPageChatContentChip label={block.url} />
        </AccordionTrigger>
        <AccordionContent>
          {block.content ? <Code code={block.content} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentWebFetch };
