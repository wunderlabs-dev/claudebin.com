"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { McpBlock } from "@/supabase/types/message";

import { stringifyJSON } from "@/utils/helpers";
import { mediaQueries } from "@/utils/media-queries";

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

const ThreadPageConversationMcp = ({ block }: ThreadPageConversationMcpProps) => {
  const t = useTranslations();
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  const label = t("chat.mcpLabel", { server: block.server, tool: block.tool });

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
          {block.input ? <Code code={stringifyJSON(block.input)} /> : null}
          {block.output ? <Code code={stringifyJSON(block.output)} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationMcp };
