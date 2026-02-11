"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useBoolean } from "usehooks-ts";
import { toast } from "sonner";

import { deleteThread } from "@/server/actions/threads";

import { Button } from "@/components/ui/button";
import { SvgIconBin } from "@/components/icon/svg-icon-bin";

type ThreadPageSidebarDeleteContainerProps = {
  id: string;
};

const ThreadPageSidebarDeleteContainer = ({ id }: ThreadPageSidebarDeleteContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { value, setTrue } = useBoolean();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteThread(id),
    onSuccess: () => {
      toast.success(t("thread.deleteSuccess"));
      router.push("/");
    },
    onError: () => toast.error(t("thread.deleteError")),
  });

  if (value) {
    return (
      <Button variant="danger" onClick={() => mutate()} disabled={isPending}>
        {isPending ? t("thread.deleting") : t("thread.confirmDelete")}
      </Button>
    );
  }
  return (
    <Button variant="secondary" onClick={setTrue}>
      <SvgIconBin />
      {t("thread.deleteThread")}
    </Button>
  );
};

export { ThreadPageSidebarDeleteContainer };
