"use client";

import { useTranslations } from "next-intl";

import type { McpBlock } from "@/supabase/types/message";

import { SvgIconMcp } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import { Code } from "@/components/ui/code";

type ChatPageChatContentMcpProps = {
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

const ChatPageChatContentMcp = ({ block }: ChatPageChatContentMcpProps) => {
  const t = useTranslations();
  const input = formatInput(block.input);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="mcp">
        <AccordionTrigger>
          <SvgIconMcp size="sm" color="primary" />
          {t("chat.mcp")}
          <Chip label={`${block.server} → ${block.tool}`} />
        </AccordionTrigger>
        <AccordionContent>
          {input ? <Code code={input} /> : null}
          {block.result ? <Code code={block.result} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentMcp };
