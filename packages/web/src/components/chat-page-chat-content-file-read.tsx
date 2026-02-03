"use client";

import { useTranslations } from "next-intl";

import type { FileReadBlock } from "@/supabase/types/message";

import { SvgIconEye, SvgIconFile } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentFileReadProps = {
  block: FileReadBlock;
  content?: string;
  lineCount?: number;
};

const ChatPageChatContentFileRead = ({
  block,
  content,
  lineCount,
}: ChatPageChatContentFileReadProps) => {
  const t = useTranslations();
  const filename = block.file_path.split("/").pop() ?? block.file_path;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="file-read">
        <AccordionTrigger>
          <SvgIconEye size="sm" color="primary" />
          {t("chat.read")}
          <Chip icon={<SvgIconFile size="xs" />} label={filename} />
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {lineCount ? (
            <Typography variant="small" color="muted">
              {t("chat.lines", { count: lineCount })}
            </Typography>
          ) : null}
          {content ? <Code code={content} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentFileRead };
