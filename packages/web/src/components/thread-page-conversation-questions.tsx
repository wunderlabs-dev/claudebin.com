"use client";

import { Fragment } from "react";
import { not } from "ramda";

import type { QuestionBlock } from "@/supabase/types/message";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationQuestionsProps = {
  block: QuestionBlock;
};

const ThreadPageConversationQuestions = ({ block }: ThreadPageConversationQuestionsProps) => {
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

            <Tabs variant="list" value={answer}>
              <TabsList>
                {question.options.map((option) => (
                  <TabsTrigger key={option.label} value={option.label}>
                    {option.label}
                  </TabsTrigger>
                ))}
                {isUserAnswer ? (
                  <TabsTrigger key={answer} value={answer}>
                    {answer}
                  </TabsTrigger>
                ) : null}
              </TabsList>
            </Tabs>
          </div>
        );
      })}
    </Fragment>
  );
};

export { ThreadPageConversationQuestions };
