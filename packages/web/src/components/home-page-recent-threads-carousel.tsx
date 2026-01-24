"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { formatDistanceToNow } from "date-fns";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { cn } from "@/utils/helpers";
import { renderers } from "@/utils/renderers";

import { HomePageRecentThreadsListItem } from "@/components/home-page-recent-threads-list-item";

import { SvgIconArrowLeft, SvgIconArrowRight } from "@/components/icon";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

type HomePageRecentThreadsCarouselProps = {
  threads: ThreadWithAuthor[];
} & ComponentProps<"section">;

const HomePageRecentThreadsCarousel = ({
  threads,
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
          <Typography variant="body" color="neutral" className="whitespace-break-spaces leading-8">
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
        <div className="flex cursor-grab select-none gap-4 border-transparent border-y active:cursor-grabbing">
          <div className="w-container-start shrink-0" aria-hidden="true" />
          {threads.map((thread) => (
            <div key={thread.id} className="bg-gray-100">
              <HomePageRecentThreadsListItem
                time={formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                files={0}
                prompts={thread.messageCount ?? 0}
                title={thread.title ?? "Untitled"}
                author={thread.profiles?.username ? `@${thread.profiles.username}` : "Anonymous"}
              />
            </div>
          ))}
          <div className="w-container-start shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export { HomePageRecentThreadsCarousel };
