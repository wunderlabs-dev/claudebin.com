import type * as React from "react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type HomeTutorialsProps = React.ComponentProps<"section">;

const HomeTutorials = ({ className, ...props }: HomeTutorialsProps) => {
  const t = useTranslations();

  return (
    <Container as="section" data-slot="home-tutorials" className={className} {...props}>
      <Tabs defaultValue="terminal" className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
        <div className="w-full p-2 bg-gray-200/50 border border-gray-500/20 rounded-3xl">
          <TabsContent value="terminal">
            <video src="https://samplelib.com/lib/preview/webm/sample-30s.webm" className="size-full rounded-2xl" controls>
              <track kind="captions" />
            </video>
          </TabsContent>
          <TabsContent value="editor">
            <video src="https://samplelib.com/lib/preview/webm/sample-30s.webm" className="size-full rounded-2xl" controls>
              <track kind="captions" />
            </video>
          </TabsContent>
        </div>

        <TabsList>
          <TabsTrigger value="terminal">{t("home.viewDemoTerminal")}</TabsTrigger>
          <TabsTrigger value="editor">{t("home.viewDemoEditor")}</TabsTrigger>
        </TabsList>
      </Tabs>
    </Container>
  );
};

export { HomeTutorials };
