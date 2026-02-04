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
      {block.questions.map((question) => (
        <div key={question.header} className="flex flex-col gap-4">
          <Typography variant="small">{question.question}</Typography>
          <Tabs value={question.options[2]?.label}>
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
        </div>
      ))}
    </Fragment>
  );
};

export { ChatPageChatContentQuestions };
