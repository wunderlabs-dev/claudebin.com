"use client";

import { Fragment } from "react";
import { isNil, not } from "ramda";

import type { QuestionBlock } from "@/supabase/types/message";

import { Options, OptionsListItem } from "@/components/ui/options";
import { Typography } from "@/components/ui/typography";

type ThreadPageConversationQuestionsProps = {
  block: QuestionBlock;
};

const toAnswerArray = (answer: string | string[] | undefined, isMultiSelect: boolean): string[] => {
  if (isNil(answer)) {
    return [];
  }
  if (Array.isArray(answer)) {
    return answer;
  }
  if (isMultiSelect) {
    return answer.split(", ");
  }
  return [answer];
};

const ThreadPageConversationQuestions = ({ block }: ThreadPageConversationQuestionsProps) => {
  return (
    <Fragment>
      {block.questions.map((question) => {
        const rawAnswer = block.answers?.[question.question];
        const answers = toAnswerArray(rawAnswer, question.multiSelect);
        const options = question.options.map((option) => option.label);
        const selectedPredefined = answers.filter((answer) => options.includes(answer));
        const customAnswers = answers.filter((answer) => not(options.includes(answer)));

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="h4">{question.question}</Typography>

            <Options>
              {question.options.map((option) => (
                <OptionsListItem
                  key={option.label}
                  selected={selectedPredefined.includes(option.label)}
                >
                  {option.label}
                </OptionsListItem>
              ))}
              {customAnswers.map((customAnswer) => (
                <OptionsListItem key={customAnswer} selected>
                  {customAnswer}
                </OptionsListItem>
              ))}
            </Options>
          </div>
        );
      })}
    </Fragment>
  );
};

export { ThreadPageConversationQuestions };
