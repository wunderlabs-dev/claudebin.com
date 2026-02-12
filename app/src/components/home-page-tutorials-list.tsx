import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import { Backdrop } from "@/components/ui/backdrop";
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type HomePageTutorialsListProps = ComponentProps<"section">;

const tutorials = [
  {
    id: "installation",
    title: "home.installation",
    src: "https://samplelib.com/lib/preview/webm/sample-30s.webm",
  },
  {
    id: "howToUse",
    title: "home.howToUse",
    src: "https://samplelib.com/lib/preview/webm/sample-30s.webm",
  },
] as const;

const HomePageTutorialsList = ({ ...props }: HomePageTutorialsListProps) => {
  const t = useTranslations();

  return (
    <Container as="section" spacing="md" size="lg" {...props}>
      <Tabs defaultValue="installation" className="flex flex-col items-center gap-8">
        <Backdrop size="half" spacing="lg" className="sm:px-4 lg:px-12">
          <div className="w-full max-w-6xl mx-auto p-2 bg-gray-200/50 border border-gray-500/20 rounded-3xl">
            {tutorials.map((tutorial) => (
              <TabsContent key={tutorial.id} value={tutorial.id}>
                <video src={tutorial.src} className="size-full rounded-2xl" controls>
                  <track kind="captions" />
                </video>
              </TabsContent>
            ))}
          </div>
        </Backdrop>

        <TabsList>
          {tutorials.map((tutorial) => (
            <TabsTrigger key={tutorial.id} value={tutorial.id}>
              {t(tutorial.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Container>
  );
};

export { HomePageTutorialsList };
