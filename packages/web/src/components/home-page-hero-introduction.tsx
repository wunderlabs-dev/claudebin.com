import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import { renderers } from "@/utils/renderers";

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

  return (
    <Container as="section" size="lg" className={className} {...props}>
      <Backdrop spacing="sm" className="px-12">
        <div className="flex flex-col max-w-4xl gap-18">
          <Typography variant="h1" className="leading-none whitespace-break-spaces">
            {t.rich("home.headline", renderers)}
          </Typography>

          <div className="flex flex-col items-start gap-6">
            <Badge>
              <SvgIconGlitters />
              {t("home.badge")}
            </Badge>

            <div className="flex gap-12">
              <Typography variant="body" color="neutral" className="leading-8">
                {t("home.description")}
              </Typography>

              <Tabs defaultValue="cli" className="flex flex-col shrink-0 w-md gap-4">
                <div className="flex justify-between">
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
            </div>
          </div>
        </div>
      </Backdrop>
    </Container>
  );
};

export { HomePageHeroIntroduction };
