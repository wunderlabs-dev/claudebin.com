"use client";

import { Fragment } from "react";
import { not } from "ramda";

import type { QuestionBlock } from "@/supabase/types/message";

import { Typography } from "@/components/ui/typography";
import { QuestionOptionsMulti } from "@/components/question-options-multi";
import { QuestionOptionsSingle } from "@/components/question-options-single";
import { QuestionCustomAnswer } from "@/components/question-custom-answer";

type ThreadPageConversationQuestionsProps = {
  block: QuestionBlock;
};

const ThreadPageConversationQuestions = ({ block }: ThreadPageConversationQuestionsProps) => {
  return (
    <Fragment>
      {block.questions.map((question) => {
        const rawAnswer = block.answers?.[question.question];
        const answers = Array.isArray(rawAnswer) ? rawAnswer : rawAnswer ? [rawAnswer] : [];
        const predefinedLabels = question.options.map((opt) => opt.label);
        const selectedPredefined = answers.filter((a) => predefinedLabels.includes(a));
        const customAnswers = answers.filter((a) => not(predefinedLabels.includes(a)));

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="h4">{question.question}</Typography>

            {question.multiSelect ? (
              <QuestionOptionsMulti options={question.options} selected={selectedPredefined} />
            ) : (
              <QuestionOptionsSingle options={question.options} selected={selectedPredefined[0]} />
            )}

            <QuestionCustomAnswer answers={customAnswers} />
          </div>
        );
      })}
    </Fragment>
  );
};

export { ThreadPageConversationQuestions };
