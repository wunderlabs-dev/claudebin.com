"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Typography } from "@/components/ui/typography";

type QuestionCustomAnswerProps = {
  answers: string[];
};

const QuestionCustomAnswer = ({ answers }: QuestionCustomAnswerProps) => {
  const t = useTranslations();

  if (answers.length === 0) {
    return null;
  }

  return (
    <Typography variant="small">
      {t.rich("chat.customAnswer", {
        answer: answers.join(", "),
        underline: (chunks: ReactNode) => <span className="border-b">{chunks}</span>,
      })}
    </Typography>
  );
};

export { QuestionCustomAnswer };
