"use client";

import { useTranslations } from "next-intl";

import { SvgIconChat } from "@/components/icon";

import { Button } from "@/components/ui/button";

const ThreadPageSidebarContinueConversation = () => {
  const t = useTranslations();

  const handleClick = () => {
    document?.querySelector("[data-continue-conversation]")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      <SvgIconChat />
      {t("thread.continueConversation")}
    </Button>
  );
};

export { ThreadPageSidebarContinueConversation };
