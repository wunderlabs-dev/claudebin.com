import { Suspense } from "react";

import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";
import { HomePageFeaturedThreadsDataLoader } from "@/components/home-page-featured-threads-data-loader";
import { HomePageFeaturedThreadsSkeleton } from "@/components/home-page-featured-threads-skeleton";

const HomePage = () => {
  return (
    <div className="overflow-hidden [--util-grid-columns:10] md:[--util-grid-columns:20] lg:[--util-grid-columns:30]">
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <Suspense fallback={<HomePageFeaturedThreadsSkeleton />}>
        <HomePageFeaturedThreadsDataLoader />
      </Suspense>
    </div>
  );
};

export default HomePage;
