"use client";

import { Fragment } from "react";
import type { QuestionBlock } from "@/supabase/types/message";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";

type ChatPageChatContentQuestionsProps = {
  block: QuestionBlock;
};

const ChatPageChatContentQuestions = ({ block }: ChatPageChatContentQuestionsProps) => {
  return (
    <Fragment>
      {block.questions.map((question) => {
        const answer = block.answers?.[question.question];
        const isCustomAnswer = answer && !question.options.some((o) => o.label === answer);

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
            {isCustomAnswer && (
              <Typography variant="small" className="text-gray-600">
                Answer: {answer}
              </Typography>
            )}
          </div>
        );
      })}
    </Fragment>
  );
};

export { ChatPageChatContentQuestions };
