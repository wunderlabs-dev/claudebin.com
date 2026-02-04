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
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

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

  const diff = toDiff(block.old_string, block.new_string);
  const filename = block.file_path.split("/").pop() ?? block.file_path;

  const lineCount = diff.split("\n").length;
  const linesAdded = block.new_string.split("\n").length;
  const linesRemoved = block.old_string.split("\n").length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-edit">
        <AccordionTrigger>
          <SvgIconFile size="sm" color="primary" />
          {t("chat.edit")}
          <ChatPageChatContentChip label={filename} />
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center justify-between">
            <Typography variant="small" color="neutral">
              {t("chat.lines", { count: lineCount })}
            </Typography>

            <div className="flex justify-end gap-3">
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

export { ChatPageChatContentFileEdit };
