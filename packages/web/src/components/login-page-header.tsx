import { useTranslations } from "next-intl";

import { renderers } from "@/utils/renderers";

import { SvgIconLock } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

const LoginPageHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col items-start gap-18">
      <Typography variant="h1" leading="none" className="whitespace-break-spaces">
        {t.rich("login.title", renderers)}
      </Typography>
      <div className="flex flex-col items-start gap-5">
        <Badge>
          <SvgIconLock />
          {t("login.badge")}
        </Badge>
        <Typography color="neutral">{t("login.description")}</Typography>
      </div>
    </header>
  );
};

export { LoginPageHeader };
