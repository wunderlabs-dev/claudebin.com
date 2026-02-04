"use client";

import { useTranslations } from "next-intl";

import type { SkillBlock } from "@/supabase/types/message";

import { SvgIconGlitters } from "@/components/icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentSkillProps = {
  block: SkillBlock;
};

const ChatPageChatContentSkill = ({ block }: ChatPageChatContentSkillProps) => {
  const t = useTranslations();
  const hasContent = block.instructions || block.output;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="skill">
        <AccordionTrigger disabled={!hasContent}>
          <SvgIconGlitters size="sm" color="primary" />
          {t("chat.skill")}
          <ChatPageChatContentChip label={block.commandName} />
        </AccordionTrigger>
        {hasContent ? (
          <AccordionContent>
            {block.instructions ? <Code code={block.instructions} /> : null}
            {block.output ? <Code code={block.output} /> : null}
          </AccordionContent>
        ) : null}
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentSkill };
