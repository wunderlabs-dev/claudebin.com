"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";
import { head } from "ramda";
import { useMediaQuery } from "usehooks-ts";

import type { WebFetchBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconDownload } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationWebFetchProps = {
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

const ThreadPageConversationWebFetch = ({ block }: ThreadPageConversationWebFetchProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });

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

          {md ? <ThreadPageConversationChip label={block.url} /> : null}
        </AccordionTrigger>
        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.url} />}

          {block.bytes || block.statusCode ? (
            <div className="flex items-center justify-between gap-3">
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

export { ThreadPageConversationWebFetch };
