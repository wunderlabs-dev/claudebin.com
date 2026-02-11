"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBoolean } from "usehooks-ts";

import { deleteThread } from "@/server/actions/threads";

import { Button } from "@/components/ui/button";
import { SvgIconBin } from "@/components/icon/svg-icon-bin";

type ThreadPageSidebarDeleteContainerProps = {
  id: string;
};

const ThreadPageSidebarDeleteContainer = ({ id }: ThreadPageSidebarDeleteContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { value: isConfirming, setTrue: showConfirm } = useBoolean();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteThread(id);
      router.push("/");
    });
  };

  if (isConfirming) {
    return (
      <Button variant="danger" onClick={handleDelete} disabled={isPending}>
        {isPending ? t("thread.deleting") : t("thread.confirmDelete")}
      </Button>
    );
  }
  return (
    <Button variant="secondary" onClick={showConfirm}>
      <SvgIconBin />
      {t("thread.deleteThread")}
    </Button>
  );
};

export { ThreadPageSidebarDeleteContainer };
