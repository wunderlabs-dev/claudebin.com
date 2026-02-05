"use client";

import { useTranslations } from "next-intl";

import type { FileReadBlock } from "@/supabase/types/message";

import { SvgIconEye } from "@/components/icon";
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

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-read">
        <AccordionTrigger>
          <SvgIconEye size="sm" color="primary" />
          {t("chat.read")}
          <ThreadPageConversationChip label={block.file_path} />
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.content ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationFileRead };
