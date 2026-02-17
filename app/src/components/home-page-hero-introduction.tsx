"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";
import { isServer } from "@tanstack/react-query";

import { gradient } from "@/utils/renderers";
import { mediaQueries } from "@/utils/media-queries";

import { SvgIconGithub } from "@/components/icon/svg-icon-github";

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
  const md = useMediaQuery(mediaQueries.md, { initializeWithValue: isServer });

  return (
    <Container as="section" size="lg" className={className} {...props}>
      <Backdrop spacing="md" className="px-4 lg:px-12">
        <div className="flex max-w-4xl flex-col gap-12 xl:gap-18">
          <Typography variant="h1" leading="none" className="whitespace-break-spaces">
            {t.rich("home.headline", { gradient })}
          </Typography>

          <div className="flex flex-col items-start gap-6">
            <Badge>{t("home.badge")}</Badge>

            <div className="flex w-full flex-col gap-12 lg:flex-row">
              <Typography variant="body" color="neutral" className="leading-8">
                {t("home.description")}
              </Typography>

              {md ? (
                <Tabs defaultValue="oneClick" className="flex shrink-0 flex-col gap-4 lg:w-xl">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="oneClick">{t("home.oneClickInstall")}</TabsTrigger>
                      <TabsTrigger value="shareSession">{t("home.shareSession")}</TabsTrigger>
                    </TabsList>

                    <Button
                      as="a"
                      variant="secondary"
                      href="https://github.com/wunderlabs-dev/claudebin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SvgIconGithub size="sm" />
                      {t("home.star")}
                    </Button>
                  </div>

                  <TabsContent value="oneClick">
                    <CopyInput value={t("commands.oneClickInstall")} />
                  </TabsContent>
                  <TabsContent value="shareSession">
                    <CopyInput value={t("commands.share")} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="shrink-0">
                  <Button
                    as="a"
                    variant="secondary"
                    href="https://github.com/wunderlabs-dev/claudebin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SvgIconGithub size="sm" />
                    {t("home.star")}
                  </Button>
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
