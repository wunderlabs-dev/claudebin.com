"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { FileReadBlock } from "@/supabase/types/message";

import { mediaQueries } from "@/utils/media-queries";

import { SvgIconEye } from "@/components/icon/svg-icon-eye";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationFileReadProps = {
  block: FileReadBlock;
};

const ThreadPageConversationFileRead = ({ block }: ThreadPageConversationFileReadProps) => {
  const t = useTranslations();
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

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
          {block.content ? (
            <Code code={block.content} />
          ) : (
            <Typography variant="small" color="neutral">
              {t("common.noResultsFound")}
            </Typography>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationFileRead };
