"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBoolean } from "usehooks-ts";

import { deleteAccount } from "@/actions/account";
import { cn } from "@/utils/helpers";

import { SvgIconSkull } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type ProfilePageDangerZoneProps = ComponentProps<"div">;

const ProfilePageDangerZone = ({ className, ...props }: ProfilePageDangerZoneProps) => {
  const t = useTranslations();
  const { value, setTrue, setFalse } = useBoolean();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteAccount();
    setIsLoading(false);
  };

  return (
    <div
      className={cn("flex flex-col items-start gap-3 border border-gray-250 p-8", className)}
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
          <Button variant="secondary" onClick={setFalse} disabled={isLoading}>
            {t("user.cancel")}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
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

export { ProfilePageDangerZone };
