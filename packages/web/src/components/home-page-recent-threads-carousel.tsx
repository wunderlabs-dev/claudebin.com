"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { cn } from "@/utils/helpers";
import { renderers } from "@/utils/renderers";

import { SvgIconArrowLeft, SvgIconArrowRight } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { HomePageRecentThreadsListItem } from "@/components/home-page-recent-threads-list-item";

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
    <section className={cn("flex flex-col gap-8 md:gap-12", className)} {...props}>
      <Container size="lg" spacing="lg" className="flex flex-col">
        <Typography variant="h2">{t.rich("home.recentThreadsTitle", renderers)}</Typography>

        <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between">
          <Typography variant="body" color="neutral" className="md:whitespace-break-spaces leading-8">
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
              <HomePageRecentThreadsListItem thread={thread} />
            </div>
          ))}
          <div className="w-container-start shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export { HomePageRecentThreadsCarousel };
