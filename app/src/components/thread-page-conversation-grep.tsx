"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { GrepBlock } from "@/supabase/types/message";

import { mediaQueries } from "@/utils/mediaQueries";

import { SvgIconFileSearch } from "@/components/icon/svg-icon-file-search";
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
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="grep">
        <AccordionTrigger>
          <SvgIconFileSearch size="sm" color="primary" />
          {t("chat.grep")}
          {md ? <ThreadPageConversationChip label={block.pattern} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.pattern} />}
          <Code code={block.filenames?.join("\n") ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationGrep };
