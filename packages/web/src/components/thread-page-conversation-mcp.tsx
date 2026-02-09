"use client";
// @TODO: refactor
import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { McpBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

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
      const str = typeof value === "string" ? value : JSON.stringify(value);
      return `${key}: ${str}`;
    })
    .join("\n");
};

const ThreadPageConversationMcp = ({ block }: ThreadPageConversationMcpProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });
  const input = formatInput(block.input);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="mcp">
        <AccordionTrigger>
          <SvgIconMcp size="sm" color="primary" />
          {t("chat.mcp")}
          {md ? <ThreadPageConversationChip label={`${block.server} → ${block.tool}`} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={`${block.server} → ${block.tool}`} />}
          {input ? <Code code={input} /> : null}

          {block.output ? (
            <Code
              code={
                typeof block.output === "string"
                  ? block.output
                  : JSON.stringify(block.output, null, 2)
              }
            />
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationMcp };
