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

            <div className="flex flex-col items-start w-fit gap-1 p-1 bg-gray-200 border border-gray-50 rounded-xl">
              {question.options.map((option) => (
                <div
                  key={option.label}
                  className={cn(
                    "inline-flex items-center justify-start w-full px-3 py-2 rounded-lg text-base font-normal",
                    selected?.includes(option.label)
                      ? "bg-gray-100 text-white"
                      : "text-gray-450 line-through",
                  )}
                >
                  {option.label}
                </div>
              ))}
              {isCustomAnswer?.map((answer) => (
                <div
                  key={answer}
                  className="inline-flex items-center justify-start w-full px-3 py-2 rounded-lg bg-gray-100 text-base font-normal text-white"
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
