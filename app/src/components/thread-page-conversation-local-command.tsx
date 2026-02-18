"use client";

import { isServer } from "@tanstack/react-query";
import { isNil } from "ramda";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { LocalCommandBlock } from "@/supabase/types/message";

import { mediaQueries } from "@/utils/media-queries";

import { SvgIconBash } from "@/components/icon/svg-icon-bash";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Code } from "@/components/ui/code";

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationLocalCommandProps = {
  block: LocalCommandBlock;
};

const ThreadPageConversationLocalCommand = ({ block }: ThreadPageConversationLocalCommandProps) => {
  const t = useTranslations();
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  if (isNil(block.output)) {
    return (
      <div className="flex items-center gap-2 py-2">
        <SvgIconBash size="sm" color="primary" />
        <span className="text-primary text-sm">{t("chat.command")}</span>
        <ThreadPageConversationChip label={block.commandName} />
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="local-command">
        <AccordionTrigger>
          <SvgIconBash size="sm" color="primary" />
          {t("chat.command")}
          {md ? <ThreadPageConversationChip label={block.commandName} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.commandName} />}
          <Code code={block.output} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationLocalCommand };
