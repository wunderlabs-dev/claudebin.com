"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { FileReadBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconEye } from "@/components/icon/svg-icon-eye";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationFileReadProps = {
  block: FileReadBlock;
};

const ThreadPageConversationFileRead = ({ block }: ThreadPageConversationFileReadProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-read">
        <AccordionTrigger>
          <SvgIconEye size="sm" color="primary" />
          {t("chat.read")}
          {md ? <ThreadPageConversationChip label={block.file_path} /> : null}
        </AccordionTrigger>
        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.file_path} />}
          <Code code={block.content ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationFileRead };
