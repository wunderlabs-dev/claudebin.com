"use client";

import { useTranslations } from "next-intl";

import type { FileEditBlock } from "@/supabase/types/message";

import { SvgIconFile } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentFileEditProps = {
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

const ChatPageChatContentFileEdit = ({ block }: ChatPageChatContentFileEditProps) => {
  const t = useTranslations();
  const filename = block.file_path.split("/").pop() ?? block.file_path;
  const diff = toDiff(block.old_string, block.new_string);
  const lineCount = diff.split("\n").length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-edit">
        <AccordionTrigger>
          <SvgIconFile size="sm" color="primary" />
          {t("chat.edit")}
          <Chip icon={<SvgIconFile size="xs" />} label={filename} />
        </AccordionTrigger>
        <AccordionContent>
          <Typography variant="small" color="muted">
            {t("chat.lines", { count: lineCount })}
          </Typography>
          <Code code={diff} lang="diff" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileEdit };
