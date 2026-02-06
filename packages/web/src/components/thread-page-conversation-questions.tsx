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
        const rawAnswer = block.answers?.[question.question];
        const answers = Array.isArray(rawAnswer) ? rawAnswer : rawAnswer ? [rawAnswer] : [];
        const predefinedLabels = question.options.map((opt) => opt.label);
        const selectedPredefined = answers.filter((a) => predefinedLabels.includes(a));
        const customAnswers = answers.filter((a) => not(predefinedLabels.includes(a)));

        return (
          <div key={question.header} className="flex flex-col gap-4">
            <Typography variant="h4">{question.question}</Typography>

            {question.multiSelect ? (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const isSelected = selectedPredefined.includes(option.label);
                  return (
                    <div
                      key={option.label}
                      className={`rounded-sm px-3 py-1 text-sm ${
                        isSelected ? "bg-orange-50 text-gray-900" : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {option.label}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Tabs variant="list" value={selectedPredefined[0]}>
                <TabsList>
                  {question.options.map((option) => (
                    <TabsTrigger key={option.label} value={option.label}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            {customAnswers.length > 0 ? (
              <Typography variant="small">
                {t.rich("chat.customAnswer", {
                  answer: customAnswers.join(", "),
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
