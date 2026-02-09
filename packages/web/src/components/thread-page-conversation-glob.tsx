"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import type { GlobBlock } from "@/supabase/types/message";

import { breakpoints } from "@/utils/breakpoints";

import { SvgIconMagnifier } from "@/components/icon/svg-icon-magnifier";
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
  const md = useMediaQuery(breakpoints.md, { initializeWithValue: isServer });

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

          {md ? <ThreadPageConversationChip label={block.pattern} /> : null}
        </AccordionTrigger>

        <AccordionContent>
          {md ? null : <ThreadPageConversationChip label={block.pattern} />}
          <Code code={block.filenames?.join("\n") ?? t("common.noResultsFound")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationGlob };
