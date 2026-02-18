"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Attachment } from "@/supabase/types/message";

import { THREAD_ATTACHMENT_ALLOWED_IMAGE_TYPES, THREAD_ATTACHMENT_SIZE } from "@/utils/constants";
import { getSafeUrl } from "@/utils/helpers";

import { SvgIconFile } from "@/components/icon/svg-icon-file";
import { Chip } from "@/components/ui/chip";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ThreadPageConversationAttachmentChipProps = {
  attachment: Attachment;
};

const resolveDataUrlSrc = (attachment: Attachment) => {
  const mediaType = attachment.mediaType ?? "image/png";

  if (attachment.sourceType === "url") {
    return getSafeUrl(attachment.data);
  }
  if (THREAD_ATTACHMENT_ALLOWED_IMAGE_TYPES.includes(mediaType)) {
    return `data:${mediaType};base64,${attachment.data}`;
  }
};

const ThreadPageConversationAttachmentChip = ({
  attachment,
}: ThreadPageConversationAttachmentChipProps) => {
  const t = useTranslations();
  const dataUrlSrc = resolveDataUrlSrc(attachment);

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
        {dataUrlSrc ? (
          <TooltipContent>
            <Image
              src={dataUrlSrc}
              className="rounded"
              width={THREAD_ATTACHMENT_SIZE}
              height={THREAD_ATTACHMENT_SIZE}
              alt={t("common.image")}
              loading="lazy"
            />
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  );
};

export { ThreadPageConversationAttachmentChip };
