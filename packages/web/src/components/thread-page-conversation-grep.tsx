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

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationGrepProps = {
  block: GrepBlock;
};

const ThreadPageConversationGrep = ({ block }: ThreadPageConversationGrepProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="grep">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.grep")}
          <ThreadPageConversationChip label={block.pattern} />
        </AccordionTrigger>

        <AccordionContent>
          <Code code={block.filenames?.join("\n") ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationGrep };
