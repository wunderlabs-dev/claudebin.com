"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { FileWriteBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconPen } from "@/components/icon/svg-icon-pen";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationFileWriteProps = {
  block: FileWriteBlock;
};

const ThreadPageConversationFileWrite = ({ block }: ThreadPageConversationFileWriteProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });
  const lineCount = block.content.split("\n").length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-write">
        <AccordionTrigger>
          <SvgIconPen size="sm" color="primary" />
          {t("chat.write")}
          {md ? <ThreadPageConversationChip label={block.file_path} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.file_path} />}

          <div className="flex justify-end">
            <Typography variant="small" className="text-green-50">
              +{t("chat.lines", { count: lineCount })}
            </Typography>
          </div>
          <Code code={block.content} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationFileWrite };
