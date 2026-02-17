import { getCachedFeaturedThreads } from "@/server/cache/featured-threads";

import { HomePageFeaturedThreadsCarousel } from "@/components/home-page-featured-threads-carousel";

const HomePageFeaturedThreadsDataLoader = async () => {
  const threads = await getCachedFeaturedThreads();

  return <HomePageFeaturedThreadsCarousel threads={threads} />;
};

export { HomePageFeaturedThreadsDataLoader };
