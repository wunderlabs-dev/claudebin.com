"use client";

import { useTranslations } from "next-intl";

import type { FileWriteBlock } from "@/supabase/types/message";

import { SvgIconPen } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentFileWriteProps = {
  block: FileWriteBlock;
};

const ChatPageChatContentFileWrite = ({ block }: ChatPageChatContentFileWriteProps) => {
  const t = useTranslations();
  const lineCount = block.content.split("\n").length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-write">
        <AccordionTrigger>
          <SvgIconPen size="sm" color="primary" />
          {t("chat.write")}
          <ChatPageChatContentChip label={block.file_path} />
        </AccordionTrigger>
        <AccordionContent>
          <Typography variant="small" color="muted">
            {t("chat.lines", { count: lineCount })}
          </Typography>
          <Code code={block.content} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileWrite };
