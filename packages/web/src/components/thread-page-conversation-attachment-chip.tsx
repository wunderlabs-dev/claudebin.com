"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Attachment } from "@/supabase/types/message";

import { THREAD_ATTACHMENT_SIZE } from "@/utils/constants";

import { SvgIconFile } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ThreadPageConversationAttachmentChipProps = {
  attachment: Attachment;
};

const srcFromDataUrl = (attachment: Attachment) => {
  if (attachment.sourceType === "url") {
    return attachment.data;
  }
  return `data:${attachment.mediaType ?? "image/png"};base64,${attachment.data}`;
};

const ThreadPageConversationAttachmentChip = ({
  attachment,
}: ThreadPageConversationAttachmentChipProps) => {
  const t = useTranslations();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Chip
            className="cursor-default"
            icon={<SvgIconFile size="xs" />}
            label={attachment.mediaType ?? t("common.image")}
          />
        </TooltipTrigger>
        <TooltipContent>
          <Image
            src={srcFromDataUrl(attachment)}
            className="rounded"
            width={THREAD_ATTACHMENT_SIZE}
            height={THREAD_ATTACHMENT_SIZE}
            alt={t("common.image")}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { ThreadPageConversationAttachmentChip };
