"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { not } from "ramda";
import { toast } from "sonner";

import { toggleVisibility } from "@/server/actions/visibility";

import { cn } from "@/utils/helpers";

import { SvgIconGlobe } from "@/components/icon/svg-icon-globe";
import { Badge } from "@/components/ui/badge";

type ThreadPageVisibilityContainerProps = {
  id: string;
  initialIsPublic?: boolean;
  isAuthor?: boolean;
};

const ThreadPageVisibilityContainer = ({
  id,
  initialIsPublic,
  isAuthor,
}: ThreadPageVisibilityContainerProps) => {
  const t = useTranslations();

  const [isPublic, setIsPublic] = useState(initialIsPublic);

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleVisibility(id),
    onMutate: () => setIsPublic(not),
    onError: () => {
      setIsPublic(not);
      toast.error(t("common.sharingSettingsUpdateError"));
    },
    onSuccess: (result) => {
      setIsPublic(result.isPublic);
      toast.success(t("common.sharingSettingsUpdated"));
    },
  });

  const handleChangeVisiblity = () => {
    if (isAuthor) {
      mutate();
    }
  };

  if (not(isAuthor)) {
    return (
      <Badge variant="success">
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.unlisted")}
      </Badge>
    );
  }

  return (
    <button
      type="button"
      onClick={handleChangeVisiblity}
      disabled={isPending}
      className={cn("cursor-pointer transition-opacity", isPending ? "opacity-50" : "opacity-100")}
    >
      <Badge variant={isPublic ? "success" : "neutral"}>
        <SvgIconGlobe size="sm" />
        {isPublic ? t("common.public") : t("common.unlisted")}
      </Badge>
    </button>
  );
};

export { ThreadPageVisibilityContainer };
