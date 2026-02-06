"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { toggleVisibility } from "@/actions/visibility";

import { cn } from "@/utils/helpers";

import { SvgIconGlobe } from "@/components/icon/svg-icon-globe";
import { Badge } from "@/components/ui/badge";

type ThreadPageVisibilityToggleContainerProps = {
  id: string;
  initialIsPublic: boolean;
  isAuthor: boolean;
};

const ThreadPageVisibilityToggleContainer = ({
  id,
  initialIsPublic,
  isAuthor,
}: ThreadPageVisibilityToggleContainerProps) => {
  const t = useTranslations();

  const [isPublic, setIsPublic] = useState(initialIsPublic);

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleVisibility(id),
    onMutate: () => {
      setIsPublic((prev) => !prev);
    },
    onError: () => {
      setIsPublic((prev) => !prev);
    },
    onSuccess: (result) => {
      setIsPublic(result.isPublic);
    },
  });

  const handleClick = () => {
    if (isAuthor) {
      mutate();
    }
  };

  // Non-authors see static badge
  if (!isAuthor) {
    return (
      <Badge variant="neutral">
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.unlisted")}
      </Badge>
    );
  }

  // Authors see clickable badge
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn("cursor-pointer transition-opacity", isPending ? "opacity-50" : "opacity-100")}
    >
      <Badge variant="neutral">
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.unlisted")}
      </Badge>
    </button>
  );
};

export { ThreadPageVisibilityToggleContainer };
