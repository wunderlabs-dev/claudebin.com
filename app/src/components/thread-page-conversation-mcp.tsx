"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { McpBlock } from "@/supabase/types/message";

import { mediaQueries } from "@/utils/mediaQueries";

import { SvgIconMcp } from "@/components/icon/svg-icon-mcp";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationMcpProps = {
  block: McpBlock;
};

const formatInput = (input: Record<string, unknown>): string => {
  return Object.entries(input)
    .map(([key, value]) => {
      const formatted = typeof value === "string" ? value : JSON.stringify(value);
      return `${key}: ${formatted}`;
    })
    .join("\n");
};

const formatOutput = (output: unknown): string => {
  return typeof output === "string" ? output : JSON.stringify(output);
};

const ThreadPageConversationMcp = ({ block }: ThreadPageConversationMcpProps) => {
  const t = useTranslations();
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  const label = `${block.server} → ${block.tool}`;
  const input = formatInput(block.input);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="mcp">
        <AccordionTrigger>
          <SvgIconMcp size="sm" color="primary" />
          {t("chat.mcp")}
          {md ? <ThreadPageConversationChip label={label} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={label} />}
          {input ? <Code code={input} /> : null}
          {block.output ? <Code code={formatOutput(block.output)} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationMcp };
