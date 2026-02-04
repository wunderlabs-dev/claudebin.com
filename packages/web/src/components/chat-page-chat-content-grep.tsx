"use client";

import { useTranslations } from "next-intl";

import type { GrepBlock } from "@/supabase/types/message";

import { SvgIconMagnifier } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentGrepProps = {
  block: GrepBlock;
};

const ChatPageChatContentGrep = ({ block }: ChatPageChatContentGrepProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="grep">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.grep")}
          <ChatPageChatContentChip label={block.pattern} />
        </AccordionTrigger>
        <AccordionContent>
          {block.filenames ? <Code code={block.filenames.join("\n")} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentGrep };
