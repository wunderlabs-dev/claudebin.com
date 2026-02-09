"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";

import type { ThreadWithAuthor } from "@/supabase/repos/sessions";

import { cn } from "@/utils/helpers";
import { gradient } from "@/utils/renderers";

import { SvgIconArrowLeft } from "@/components/icon/svg-icon-arrow-left";
import { SvgIconArrowRight } from "@/components/icon/svg-icon-arrow-right";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

import { HomePageFeaturedThreadsListItem } from "@/components/home-page-featured-threads-list-item";

type HomePageFeaturedThreadsCarouselProps = {
  threads: ThreadWithAuthor[];
} & ComponentProps<"section">;

const HomePageFeaturedThreadsCarousel = ({
  threads,
  className,
  ...props
}: HomePageFeaturedThreadsCarouselProps) => {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const handlePrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const handleNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className={cn("flex flex-col gap-8 md:gap-12", className)} {...props}>
      <Container size="lg" spacing="lg" className="flex flex-col">
        <Typography variant="h2">{t.rich("home.featuredThreadsTitle", { gradient })}</Typography>

        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-0">
          <Typography
            variant="body"
            color="neutral"
            className="leading-8 md:whitespace-break-spaces"
          >
            {t("home.featuredThreadsDescription")}
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
        <div className="flex gap-4 border-y border-transparent cursor-grab select-none active:cursor-grabbing">
          <div className="w-container-start shrink-0" aria-hidden="true" />
          {threads.map((thread) => (
            <div key={thread.id} className="bg-gray-100">
              <HomePageFeaturedThreadsListItem thread={thread} />
            </div>
          ))}
          <div className="w-container-start shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export { HomePageFeaturedThreadsCarousel };
