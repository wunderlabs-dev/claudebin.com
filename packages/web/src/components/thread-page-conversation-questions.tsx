"use client";

import { type ReactNode, Fragment } from "react";
import { useTranslations } from "next-intl";
import { not } from "ramda";
import type { QuestionBlock } from "@/supabase/types/message";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationQuestionsProps = {
  block: QuestionBlock;
};

const ThreadPageConversationQuestions = ({ block }: ThreadPageConversationQuestionsProps) => {
  const t = useTranslations();

  return (
    <Fragment>
      {block.questions.map((question) => {
        const answer = block.answers?.[question.question];
        const isPredefinedAnswer =
          answer && question.options.some((option) => option.label === answer);
        const isUserAnswer = answer && not(isPredefinedAnswer);

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="h4">{question.question}</Typography>

            <Tabs value={answer}>
              <TabsList className="flex-col items-start rounded-xl w-full h-auto">
                {question.options.map((option) => (
                  <TabsTrigger
                    key={option.label}
                    value={option.label}
                    className="data-[state=inactive]:line-through w-full rounded-lg justify-start"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isUserAnswer ? (
              <Typography variant="small">
                {t.rich("chat.customAnswer", {
                  answer,
                  underline: (chunks: ReactNode) => <span className="border-b">{chunks}</span>,
                })}
              </Typography>
            ) : null}
          </div>
        );
      })}
    </Fragment>
  );
};

export { ThreadPageConversationQuestions };
