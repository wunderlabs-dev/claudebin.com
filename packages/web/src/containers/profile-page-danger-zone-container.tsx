"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useBoolean } from "usehooks-ts";
import { toast } from "sonner";

import { cn } from "@/utils/helpers";
import { deleteAccount } from "@/actions/account";

import { SvgIconSkull } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type ProfilePageDangerZoneContainerProps = ComponentProps<"div">;

const ProfilePageDangerZoneContainer = ({
  className,
  ...props
}: ProfilePageDangerZoneContainerProps) => {
  const t = useTranslations();

  const { value, setTrue, setFalse } = useBoolean();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAccount,
    onError: () => toast.error(t("user.deleteAccountError")),
  });

  return (
    <div
      className={cn("flex flex-col items-start gap-3 p-8 border border-gray-250", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SvgIconSkull size="md" color="accent" />
        <Typography variant="h4">{t("user.dangerZone")}</Typography>
      </div>

      <Typography variant="small" color="muted">
        {t("user.dangerZoneDescription")}
      </Typography>

      {value ? (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={setFalse} disabled={isPending}>
            {t("user.cancel")}
          </Button>
          <Button variant="danger" onClick={() => mutate()} disabled={isPending}>
            {t("user.confirmDeleteAccount")}
          </Button>
        </div>
      ) : (
        <Button variant="danger" onClick={setTrue}>
          {t("user.deleteAccount")}
        </Button>
      )}
    </div>
  );
};

export { ProfilePageDangerZoneContainer };
