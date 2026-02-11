"use client";

import { isServer } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import { mediaQueries } from "@/utils/mediaQueries";

import { Button } from "@/components/ui/button";
import { SvgIconChat } from "@/components/icon/svg-icon-chat";

const ThreadPageSidebarContinueConversation = () => {
  const t = useTranslations();
  const xl = useMediaQuery(mediaQueries.xl, { initializeWithValue: isServer });

  const handleClick = () => {
    document?.querySelector("[data-continue-conversation]")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      <SvgIconChat />
      {xl ? t("thread.continueConversation") : t("thread.continue")}
    </Button>
  );
};

export { ThreadPageSidebarContinueConversation };
