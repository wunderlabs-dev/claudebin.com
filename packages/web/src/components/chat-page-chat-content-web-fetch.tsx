"use client";

import prettyMs from "pretty-ms";
import prettyBytes from "pretty-bytes";
import { head } from "ramda";
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

const statusCodeColorClassNames: Record<string, string> = {
  "2": "text-green-50",
  "3": "text-orange-50",
  "4": "text-red-50",
  "5": "text-red-50",
} as const;

const getStatusColor = (statusCode: number) => {
  return statusCodeColorClassNames[head(String(statusCode)) as string];
};

const ChatPageChatContentWebFetch = ({ block }: ChatPageChatContentWebFetchProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="web-fetch">
        <AccordionTrigger>
          <SvgIconDownload size="sm" color="primary" />
          {t("chat.fetch")}

          {block.is_error ? (
            <Typography variant="small" className="shrink-0 text-red-50">
              {t("chat.error")}
            </Typography>
          ) : null}

          {block.durationMs ? (
            <Typography variant="small" className="shrink-0" color="neutral">
              {prettyMs(block.durationMs)}
            </Typography>
          ) : null}

          <ChatPageChatContentChip label={block.url} />
        </AccordionTrigger>

        <AccordionContent>
          {block.bytes || block.statusCode ? (
            <div className="flex justify-between items-center gap-3">
              {block.bytes ? (
                <Typography variant="small" color="neutral">
                  {t("chat.bytes")}: {prettyBytes(block.bytes)}
                </Typography>
              ) : null}
              {block.statusCode ? (
                <Typography variant="small" className={getStatusColor(block.statusCode)}>
                  {block.statusCode} {block.statusText}
                </Typography>
              ) : null}
            </div>
          ) : null}

          {block.content ? <Code code={block.content} /> : null}
          {block.is_error && block.error ? <Code code={block.error} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentWebFetch };
