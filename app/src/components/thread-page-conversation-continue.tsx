"use client";

import { useTranslations } from "next-intl";

import { APP_URL, AVATAR_ASSISTANT_IMAGE_SRC } from "@/utils/constants";

import { ChatItem, ChatContent } from "@/components/ui/chat";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type ThreadPageConversationContinueProps = {
  id: string;
};

const ThreadPageConversationContinue = ({ id }: ThreadPageConversationContinueProps) => {
  const t = useTranslations();

  const curlCommand = `curl -s "${APP_URL}/api/threads/${id}/md" | claude`;

  return (
    <ChatItem variant="assistant" className="pb-0">
      <Avatar size="sm">
        <AvatarImage src={AVATAR_ASSISTANT_IMAGE_SRC} />
      </Avatar>
      <ChatContent className="w-full" data-continue-conversation>
        <div className="flex flex-col gap-2">
          <Typography variant="h4">{t("thread.continueTitle")}</Typography>
          <Typography variant="small" color="muted">
            {t("thread.continueDescription")}
          </Typography>
        </div>

        <CopyInput variant="snippet" value={curlCommand} />
      </ChatContent>
    </ChatItem>
  );
};

export { ThreadPageConversationContinue };
