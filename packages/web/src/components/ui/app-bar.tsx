"use client";

import type * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEventListener } from "usehooks-ts";

import { cn } from "@/utils/helpers";

import { SvgIconClaudebinXs, SvgIconHome, SvgIconUser } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Nav, NavLink, NavLabel } from "@/components/ui/nav";

type AppBarProps = React.ComponentProps<"header">;

const AppBar = ({ className, ...props }: AppBarProps) => {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState<number>();

  useEventListener("scroll", () => {
    setIsScrolled(window.scrollY);
  });

  return (
    <header
      data-slot="app-bar"
      className={cn(
        "sticky top-0 z-10",
        isScrolled ? "bg-gray-100/25 backdrop-blur-md" : undefined,
        className,
      )}
      {...props}
    >
      <Container size="lg">
        <div className="flex items-center justify-between pt-3 pb-2">
          <div className="flex items-center gap-24">
            <Link href="/">
              <SvgIconClaudebinXs size="auto" className="w-14" />
            </Link>

            <Nav>
              <NavLink variant="active" href="/">
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
