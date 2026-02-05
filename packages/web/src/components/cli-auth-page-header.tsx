import { useTranslations } from "next-intl";

import { renderers } from "@/utils/renderers";

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { SvgIconShield } from "@/components/icon";

const CliAuthPageHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col items-start gap-12 md:gap-18">
      <Typography variant="h1" leading="none" className="whitespace-break-spaces">
        {t.rich("cliAuth.title", renderers)}
      </Typography>
      <div className="flex flex-col items-start gap-5">
        <Badge>
          <SvgIconShield />
          {t("cliAuth.badge")}
        </Badge>
        <Typography color="neutral">{t("cliAuth.description")}</Typography>
      </div>
    </header>
  );
};

export { CliAuthPageHeader };
