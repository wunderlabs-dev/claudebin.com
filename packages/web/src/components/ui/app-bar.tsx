"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEventListener, useIsomorphicLayoutEffect } from "usehooks-ts";

import type { User } from "@supabase/supabase-js";

import { cn } from "@/utils/helpers";

import { SvgIconClaudebinXs, SvgIconHome, SvgIconUser } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Nav, NavLink, NavLabel } from "@/components/ui/nav";

type AppBarProps = ComponentProps<"header"> & {
  user: User | null;
};

const links = [
  { href: "/", label: "appBar.claudebin", icon: <SvgIconHome size="sm" /> },
  { href: "/threads", label: "appBar.threads", icon: null },
] as const;

const AppBar = ({ user, className, ...props }: AppBarProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const [isSticky, setIsSticky] = useState<number>();

  useEventListener("scroll", () => {
    setIsSticky(window.scrollY);
  });
  useIsomorphicLayoutEffect(() => {
    setIsSticky(window.scrollY);
  }, []);

  return (
    <header
      data-slot="app-bar"
      className={cn(
        "sticky top-0 z-10",
        isSticky ? "bg-gray-100/25 backdrop-blur-md" : undefined,
        className,
      )}
      {...props}
    >
      <Container size="lg">
        <div className="flex items-center justify-between pt-3 pb-2">
          <div className="flex items-center gap-24">
            <Link href="/" className="transition-colors ease-in-out hover:text-orange-50">
              <SvgIconClaudebinXs size="auto" className="w-14" />
            </Link>
            <Nav>
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  variant={pathname === link.href ? "active" : "default"}
                >
                  {link.icon}
                  <NavLabel>{t(link.label)}</NavLabel>
                </NavLink>
              ))}
            </Nav>
          </div>

          {user ? (
            <Button>
              <SvgIconUser size="sm" />
              {t("appBar.logout")}
            </Button>
          ) : (
            <Button>
              <SvgIconUser size="sm" />
              {t("appBar.login")}
            </Button>
          )}
        </div>

        <Divider />
      </Container>
    </header>
  );
};

export { AppBar };
