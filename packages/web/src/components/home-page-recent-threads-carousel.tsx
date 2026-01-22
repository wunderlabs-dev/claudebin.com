"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/utils/helpers";
import { renderers } from "@/utils/renderers";

import { HomePageRecentThreadsListItem } from "@/components/home-page-recent-threads-list-item";

import { SvgIconArrowLeft, SvgIconArrowRight } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

type HomePageRecentThreadsCarouselProps = ComponentProps<"section">;

const threads = [
  {
    id: "1",
    title: "Building a CLI tool with node.js",
    author: "@marius",
    time: "2h ago",
    prompts: 10,
    files: 2,
  },
  {
    id: "2",
    title: "React hooks optimization patterns",
    author: "@sarah",
    time: "3h ago",
    prompts: 85,
    files: 0,
  },
  {
    id: "3",
    title: "Auth Debugging flow",
    author: "@john",
    time: "1d ago",
    prompts: 88,
    files: 10,
  },
  {
    id: "4",
    title: "Database query optimization",
    author: "@emma",
    time: "2d ago",
    prompts: 4,
    files: 0,
  },
  {
    id: "5",
    title: "API rate limiting implementation",
    author: "@alex",
    time: "3d ago",
    prompts: 23,
    files: 5,
  },
  {
    id: "6",
    title: "CI/CD pipeline setup",
    author: "@mike",
    time: "4d ago",
    prompts: 45,
    files: 8,
  },
  {
    id: "7",
    title: "GraphQL schema design",
    author: "@lisa",
    time: "5d ago",
    prompts: 67,
    files: 3,
  },
  {
    id: "8",
    title: "WebSocket real-time chat",
    author: "@david",
    time: "5d ago",
    prompts: 34,
    files: 6,
  },
  {
    id: "9",
    title: "Unit testing best practices",
    author: "@anna",
    time: "6d ago",
    prompts: 52,
    files: 4,
  },
  {
    id: "10",
    title: "Docker container optimization",
    author: "@tom",
    time: "6d ago",
    prompts: 19,
    files: 2,
  },
  {
    id: "11",
    title: "Redux state management refactor",
    author: "@nina",
    time: "1w ago",
    prompts: 73,
    files: 12,
  },
  {
    id: "12",
    title: "REST API design patterns",
    author: "@chris",
    time: "1w ago",
    prompts: 41,
    files: 7,
  },
  {
    id: "13",
    title: "TypeScript migration guide",
    author: "@julia",
    time: "1w ago",
    prompts: 96,
    files: 15,
  },
  {
    id: "14",
    title: "Performance profiling session",
    author: "@mark",
    time: "1w ago",
    prompts: 28,
    files: 1,
  },
  {
    id: "15",
    title: "CSS Grid layout implementation",
    author: "@sophie",
    time: "2w ago",
    prompts: 37,
    files: 3,
  },
  {
    id: "16",
    title: "OAuth2 integration setup",
    author: "@james",
    time: "2w ago",
    prompts: 61,
    files: 9,
  },
  {
    id: "17",
    title: "Webpack configuration tuning",
    author: "@elena",
    time: "2w ago",
    prompts: 44,
    files: 2,
  },
  {
    id: "18",
    title: "MongoDB aggregation pipelines",
    author: "@ryan",
    time: "2w ago",
    prompts: 55,
    files: 0,
  },
  {
    id: "19",
    title: "React Native app debugging",
    author: "@kate",
    time: "3w ago",
    prompts: 82,
    files: 11,
  },
  {
    id: "20",
    title: "Kubernetes deployment config",
    author: "@ben",
    time: "3w ago",
    prompts: 39,
    files: 5,
  },
];

const HomePageRecentThreadsCarousel = ({
  className,
  ...props
}: HomePageRecentThreadsCarouselProps) => {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const handlePrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const handleNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className={cn("flex flex-col gap-12", className)} {...props}>
      <Container size="lg" spacing="lg" className="flex flex-col">
        <Typography variant="h2">{t.rich("home.recentThreadsTitle", renderers)}</Typography>

        <div className="flex items-center justify-between">
          <Typography variant="body" color="neutral" className="leading-8 whitespace-break-spaces">
            {t("home.recentThreadsDescription")}
          </Typography>

          <div className="flex items-center gap-2">
            <Button variant="icon" onClick={handlePrev}>
              <SvgIconArrowLeft />
            </Button>
            <Button variant="icon" onClick={handleNext}>
              <SvgIconArrowRight />
            </Button>
          </div>
        </div>
      </Container>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 cursor-grab active:cursor-grabbing select-none border-y border-transparent">
          <div className="shrink-0 w-container-start" aria-hidden="true" />
          {threads.map((thread) => (
            <div key={thread.id} className="bg-gray-100">
              <HomePageRecentThreadsListItem
                time={thread.time}
                files={thread.files}
                title={thread.title}
                author={thread.author}
                prompts={thread.prompts}
              />
            </div>
          ))}
          <div className="shrink-0 w-container-start" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export { HomePageRecentThreadsCarousel };
