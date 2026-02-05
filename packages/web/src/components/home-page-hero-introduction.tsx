"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

import { renderers } from "@/utils/renderers";
import { breakpoints } from "@/utils/breakpoints";

import { SvgIconGlitters } from "@/components/icon";

import { Backdrop } from "@/components/ui/backdrop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CopyInput } from "@/components/ui/copy-input";
import { Typography } from "@/components/ui/typography";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type HomePageHeroIntroductionProps = ComponentProps<"section">;

const HomePageHeroIntroduction = ({ className, ...props }: HomePageHeroIntroductionProps) => {
  const t = useTranslations();
  const md = useMediaQuery(breakpoints.md);

  return (
    <Container as="section" size="lg" className={className} {...props}>
      <Backdrop spacing="md" className="px-4 lg:px-12">
        <div className="flex max-w-4xl flex-col gap-12 xl:gap-18">
          <Typography variant="h1" leading="none" className="whitespace-break-spaces">
            {t.rich("home.headline", renderers)}
          </Typography>

          <div className="flex flex-col items-start gap-6">
            <Badge>
              <SvgIconGlitters />
              {t("home.badge")}
            </Badge>

            <div className="flex flex-col gap-12 lg:flex-row">
              <Typography variant="body" color="neutral" className="leading-8">
                {t("home.description")}
              </Typography>

              {md ? (
                <Tabs defaultValue="cli" className="flex shrink-0 flex-col gap-4 lg:w-md">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="cli">{t("home.cliInstall")}</TabsTrigger>
                      <TabsTrigger value="editor">{t("home.editorInstall")}</TabsTrigger>
                    </TabsList>
                    <Button variant="secondary">{t("home.viewDemo")}</Button>
                  </div>

                  <TabsContent value="cli">
                    <CopyInput value={t("home.commandCli")} />
                  </TabsContent>
                  <TabsContent value="editor">
                    <CopyInput value={t("home.commandEditor")} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="shrink-0">
                  <Button variant="secondary">{t("home.viewDemo")}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Backdrop>
    </Container>
  );
};

export { HomePageHeroIntroduction };
