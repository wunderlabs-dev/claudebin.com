"use client";

import { useTranslations } from "next-intl";
import { useBoolean } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { SvgIconBin } from "@/components/icon/svg-icon-bin";

const ThreadPageSidebarDeleteContainer = () => {
  const t = useTranslations();

  const { value, setTrue } = useBoolean();

  if (value) {
    return (
      <Button variant="danger" onClick={() => { }}>
        {t("thread.confirmDelete")}
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
