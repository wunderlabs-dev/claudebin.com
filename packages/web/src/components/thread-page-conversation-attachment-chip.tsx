"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Attachment } from "@/supabase/types/message";

import { SvgIconFile } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ThreadPageConversationAttachmentChipProps = {
  attachment: Attachment;
};

const getImageSrc = (attachment: Attachment) => {
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
            src={getImageSrc(attachment)}
            alt={t("common.image")}
            width={200}
            height={200}
            className="rounded"
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { ThreadPageConversationAttachmentChip };
