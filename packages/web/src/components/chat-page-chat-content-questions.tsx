"use client";

import { type ReactNode, Fragment } from "react";
import { useTranslations } from "next-intl";
import { not } from "ramda";
import type { QuestionBlock } from "@/supabase/types/message";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentQuestionsProps = {
  block: QuestionBlock;
};

const ChatPageChatContentQuestions = ({ block }: ChatPageChatContentQuestionsProps) => {
  const t = useTranslations();

  return (
    <Fragment>
      {block.questions.map((question) => {
        const answer = block.answers?.[question.question];

        const isAnswer = answer && question.options.some((option) => option.label === answer);
        const isCustomAnswer = answer && not(isAnswer);

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="small">{question.question}</Typography>

            <Tabs value={answer}>
              <TabsList>
                {question.options.map((option) => (
                  <TabsTrigger
                    key={option.label}
                    value={option.label}
                    className="data-[state=inactive]:line-through"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isCustomAnswer ? (
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

export { ChatPageChatContentQuestions };
