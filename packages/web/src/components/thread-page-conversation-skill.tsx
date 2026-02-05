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

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationSkillProps = {
  block: SkillBlock;
};

const ThreadPageConversationSkill = ({ block }: ThreadPageConversationSkillProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="skill">
        <AccordionTrigger>
          <SvgIconGlitters size="sm" color="primary" />
          {t("chat.skill")}
          <ThreadPageConversationChip label={block.commandName} />
        </AccordionTrigger>

        <AccordionContent>
          {block.instructions ? <Code code={block.instructions} /> : null}
          {block.output ? <Code code={block.output} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationSkill };
