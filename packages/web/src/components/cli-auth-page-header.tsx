import { useTranslations } from "next-intl";

import { gradient } from "@/utils/renderers";

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { SvgIconShield } from "@/components/icon/svg-icon-shield";

const CliAuthPageHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col items-start gap-12 md:gap-18">
      <Typography variant="h1" leading="none" className="whitespace-break-spaces">
        {t.rich("cliAuth.title", { gradient })}
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
