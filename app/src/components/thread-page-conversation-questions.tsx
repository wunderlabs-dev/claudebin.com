"use client";

import { Fragment } from "react";
import { not } from "ramda";

import type { QuestionBlock } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

import { Typography } from "@/components/ui/typography";

type ThreadPageConversationQuestionsProps = {
  block: QuestionBlock;
};

const ThreadPageConversationQuestions = ({ block }: ThreadPageConversationQuestionsProps) => {
  return (
    <Fragment>
      {block.questions.map((question) => {
        const answers = block.answers?.[question.question];
        const options = question.options.map((option) => option.label);
        const selected = answers?.filter((answer) => options.includes(answer));
        const isCustomAnswer = answers?.filter((answer) => not(options.includes(answer)));

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="h4">{question.question}</Typography>

            <div className="flex w-fit flex-col items-start gap-1 rounded-xl border border-gray-50 bg-gray-200 p-1">
              {question.options.map((option) => {
                const active = selected?.includes(option.label);

                return (
                  <div
                    key={option.label}
                    className={cn(
                      "inline-flex w-full items-center justify-start rounded-lg px-3 py-2 font-normal text-base",
                      active ? "bg-gray-100 text-white" : "text-gray-450 line-through",
                    )}
                  >
                    {option.label}
                  </div>
                );
              })}
              {isCustomAnswer?.map((answer) => (
                <div
                  key={answer}
                  className="inline-flex w-full items-center justify-start rounded-lg bg-gray-100 px-3 py-2 font-normal text-base text-white"
                >
                  {answer}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export { ThreadPageConversationQuestions };
