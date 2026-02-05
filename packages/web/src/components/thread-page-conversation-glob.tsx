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

import { ThreadPageConversationChip } from "@/components/thread-page-conversation-chip";

type ThreadPageConversationGlobProps = {
  block: GlobBlock;
};

const ThreadPageConversationGlob = ({ block }: ThreadPageConversationGlobProps) => {
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
          <ThreadPageConversationChip label={block.pattern} />
        </AccordionTrigger>
        <AccordionContent>
          <Code code={block.filenames?.join("\n") ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationGlob };
