"use client";

import { useTranslations } from "next-intl";

import type { GlobBlock } from "@/supabase/types/message";

import { SvgIconMagnifier } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentGlobProps = {
  block: GlobBlock;
};

const ChatPageChatContentGlob = ({ block }: ChatPageChatContentGlobProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="glob">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.glob")}
          <ChatPageChatContentChip label={block.pattern} />
        </AccordionTrigger>
        <AccordionContent>{block.result ? <Code code={block.result} /> : null}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentGlob };
