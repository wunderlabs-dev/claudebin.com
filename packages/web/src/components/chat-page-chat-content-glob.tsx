"use client";

import { useTranslations } from "next-intl";

import type { GlobBlock } from "@/supabase/types/message";

import { SvgIconMagnifier } from "@/components/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

import { ChatPageChatContentChip } from "@/components/chat-page-chat-content-chip";

type ChatPageChatContentGlobProps = {
  block: GlobBlock;
};

const ChatPageChatContentGlob = ({ block }: ChatPageChatContentGlobProps) => {
  const t = useTranslations();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="glob">
        <AccordionTrigger>
          <SvgIconMagnifier size="sm" color="primary" />
          {t("chat.glob")}
          {block.numFiles ? (
            <Typography variant="caption" color="muted">
              {t("common.files", { count: block.numFiles })}
            </Typography>
          ) : null}
          <ChatPageChatContentChip label={block.pattern} />
        </AccordionTrigger>
        <AccordionContent>
          {block.filenames ? <Code code={block.filenames.join("\n")} /> : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ChatPageChatContentGlob };
