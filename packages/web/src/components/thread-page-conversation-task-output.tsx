"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import type { TaskOutputBlock } from "@/supabase/types/message";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

import { SvgIconCode } from "@/components/icon/svg-icon-code";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Code } from "@/components/ui/code";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationTaskOutputProps = {
  block: TaskOutputBlock;
};

const ThreadPageConversationTaskOutput = ({ block }: ThreadPageConversationTaskOutputProps) => {
  const t = useTranslations();

  const badgeVariant = useMemo((): VariantProps<typeof badgeVariants>["variant"] => {
    if (block.status === "completed") {
      return "success";
    }
    if (block.status === "running") {
      return "default";
    }
    return "neutral";
  }, [block.status]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="task-output">
        <AccordionTrigger>
          <SvgIconCode size="sm" color="primary" />
          {t("chat.taskOutput")}

          {block.status ? (
            <Badge size="sm" variant={badgeVariant}>
              {block.status}
            </Badge>
          ) : null}

          <Badge size="sm">{block.task_id}</Badge>
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col gap-2">
            {block.description ? (
              <Typography variant="small" color="muted">
                {block.description}
              </Typography>
            ) : null}

            {block.output ? <Code code={block.output} /> : null}

            {block.exitCode ? (
              <Typography variant="small" color="muted">
                {t("chat.exitCode", { code: block.exitCode })}
              </Typography>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { ThreadPageConversationTaskOutput };
