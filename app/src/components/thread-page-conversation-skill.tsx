"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { SkillBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconGlitters } from "@/components/icon/svg-icon-glitters";
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
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="skill">
        <AccordionTrigger>
          <SvgIconGlitters size="sm" color="primary" />
          {t("chat.skill")}
          {md ? <ThreadPageConversationChip label={block.commandName} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.commandName} />}
          {block.instructions ? <Code code={block.instructions} /> : null}
          {block.output ? <Code code={block.output} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationSkill };
