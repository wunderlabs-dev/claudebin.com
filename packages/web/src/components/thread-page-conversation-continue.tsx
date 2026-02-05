"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

import { APP_THREADS_URL, AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { ChatItem, ChatContent } from "@/components/ui/chat";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ThreadPageConversationContinueProps = {
  id: string;
  isAuthor: boolean;
};

const EXPIRY_SECONDS = 5 * 60;

const ThreadPageConversationContinue = ({ id, isAuthor }: ThreadPageConversationContinueProps) => {
  const t = useTranslations();

  const [curlCommand, setCurlCommand] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/threads/${id}/continue`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate token");
      }

      const data = await response.json();
      setCurlCommand(data.curlCommand);
      setExpiresAt(new Date(data.expiresAt));
      setSecondsLeft(EXPIRY_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token");
    } finally {
      setIsGenerating(false);
    }
  }, [id]);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setSecondsLeft(diff);

      if (diff === 0) {
        setCurlCommand(null);
        setExpiresAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleGenerateClick = () => {
    generateToken();
  };

  return (
    <ChatItem variant="assistant" className="pb-0">
      <Avatar size="sm">
        <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
      </Avatar>
      <ChatContent className="w-auto" data-continue-conversation>
        <div className="flex flex-col gap-2">
          <Typography variant="h4">{t("thread.continueTitle")}</Typography>
          <Typography variant="small" color="muted">
            {isAuthor ? t("thread.continueDescriptionAuthor") : t("thread.continueDescription")}
          </Typography>
        </div>

        {isAuthor ? (
          <div className="flex flex-col gap-3">
            {curlCommand ? (
              <>
                <CopyInput variant="snippet" value={curlCommand} />
                <Typography variant="small" color="muted">
                  {secondsLeft > 0
                    ? t("thread.expiresIn", { seconds: secondsLeft })
                    : t("thread.expired")}
                </Typography>
                {secondsLeft === 0 && (
                  <Button variant="secondary" onClick={handleGenerateClick}>
                    {t("thread.regenerate")}
                  </Button>
                )}
              </>
            ) : (
              <Button variant="secondary" onClick={handleGenerateClick} disabled={isGenerating}>
                {isGenerating ? t("thread.generatingLink") : t("thread.generateContinueLink")}
              </Button>
            )}
            {error && (
              <Typography variant="small" color="accent">
                {error}
              </Typography>
            )}
          </div>
        ) : (
          <CopyInput variant="link" value={`${APP_THREADS_URL}/${id}`} />
        )}
      </ChatContent>
    </ChatItem>
  );
};

export { ThreadPageConversationContinue };
