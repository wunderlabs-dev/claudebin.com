"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Attachment } from "@/supabase/types/message";

import { THREAD_ATTACHMENT_SIZE } from "@/utils/constants";
import { sanitizeUrl } from "@/utils/sanitizeUrl";

import { SvgIconFile } from "@/components/icon/svg-icon-file";
import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ThreadPageConversationAttachmentChipProps = {
  attachment: Attachment;
};

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];

const resolveDataUrlSrc = (attachment: Attachment) => {
  if (attachment.sourceType === "url") {
    return sanitizeUrl(attachment.data);
  }
  const mediaType = attachment.mediaType ?? "image/png";
  if (!ALLOWED_IMAGE_TYPES.includes(mediaType)) return "";
  return `data:${mediaType};base64,${attachment.data}`;
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
            className="cursor-zoom-in"
            icon={<SvgIconFile size="xs" />}
            label={attachment.mediaType ?? t("common.image")}
          />
        </TooltipTrigger>
        <TooltipContent>
          <Image
            src={resolveDataUrlSrc(attachment)}
            className="rounded"
            width={THREAD_ATTACHMENT_SIZE}
            height={THREAD_ATTACHMENT_SIZE}
            alt={t("common.image")}
            loading="lazy"
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { ThreadPageConversationAttachmentChip };
