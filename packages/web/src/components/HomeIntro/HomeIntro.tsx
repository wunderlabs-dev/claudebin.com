import type { ReactNode } from "react";
import type * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/helpers";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { CopyInput } from "@/components/ui/copy-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SvgIconGlitters } from "@/components/icon";

type HomeIntroProps = React.ComponentProps<"section">;

const HomeIntro = ({ className, ...props }: HomeIntroProps) => {
  const t = useTranslations();

  const renderers = {
    gradient: (chunks: ReactNode) => (
      <span className="block bg-gradient-to-r from-orange-200 to-orange-50 text-transparent bg-clip-text">
        {chunks}
      </span>
    ),
  };

  return (
    <section data-slot="home-intro" className={cn("bg-grid", className)} {...props}>
      <div className="max-w-4xl flex flex-col gap-18">
        <Typography variant="h1" className="leading-none">
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

            <Tabs defaultValue="cli" className="flex flex-col gap-4 shrink-0 w-md">
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
    </section>
  );
};

export { HomeIntro };
