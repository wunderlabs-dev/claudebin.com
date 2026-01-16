import type * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { SvgIconClaudebinXs, SvgIconHome, SvgIconUser } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Nav, NavLink, NavLabel } from "@/components/ui/nav";

type AppBarProps = React.ComponentProps<"header">;

const AppBar = ({ className, ...props }: AppBarProps) => {
  const t = useTranslations();

  return (
    <header data-slot="app-bar" className={cn("sticky top-0", className)} {...props}>
      <Container>
        <div className="flex items-center justify-between pt-3 pb-2">
          <div className="flex items-center gap-24">
            <Link href="/">
              <SvgIconClaudebinXs size="auto" className="w-14" />
            </Link>

            <Nav>
              <NavLink href="/">
                <SvgIconHome size="sm" />
                <NavLabel>{t("appBar.claudebin")}</NavLabel>
              </NavLink>
              <NavLink href="/threads">
                <NavLabel>{t("appBar.threads")}</NavLabel>
              </NavLink>
            </Nav>
          </div>

          <Button variant="default">
            <SvgIconUser size="sm" />
            {t("appBar.login")}
          </Button>
        </div>

        <Divider />
      </Container>
    </header>
  );
};

export { AppBar };
