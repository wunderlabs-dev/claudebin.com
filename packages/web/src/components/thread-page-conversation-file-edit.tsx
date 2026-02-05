"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";
import { isServer } from "@tanstack/react-query";

import type { FileEditBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconFile } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationFileEditProps = {
  block: FileEditBlock;
};

const toDiff = (oldString: string, newString: string): string => {
  const removed = oldString
    .split("\n")
    .map((line) => `- ${line}`)
    .join("\n");
  const added = newString
    .split("\n")
    .map((line) => `+ ${line}`)
    .join("\n");
  return `${removed}\n${added}`;
};

const ThreadPageConversationFileEdit = ({ block }: ThreadPageConversationFileEditProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });

  const filename = block.file_path.split("/").pop() ?? block.file_path;

  const diff = useMemo(
    () => toDiff(block.old_string, block.new_string),
    [block.old_string, block.new_string],
  );

  const lineCount = diff.split("\n").length;
  const linesAdded = block.new_string.split("\n").length;
  const linesRemoved = block.old_string.split("\n").length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-edit">
        <AccordionTrigger>
          <SvgIconFile size="sm" color="primary" />
          {t("chat.edit")}
          {md ? <ThreadPageConversationChip label={filename} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={filename} />}
          <div className="flex items-center justify-between">
            <Typography variant="small" color="neutral">
              {t("chat.lines", { count: lineCount })}
            </Typography>

            <div className="flex items-center justify-end gap-3">
              <Typography variant="small" className="text-green-50">
                +{linesAdded}
              </Typography>
              <Typography variant="small" className="text-red-50">
                -{linesRemoved}
              </Typography>
            </div>
          </div>
          <Code code={diff} lang="diff" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationFileEdit };
