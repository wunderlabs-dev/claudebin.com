import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";

import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageFeaturedThreadsCarousel } from "@/components/home-page-featured-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = async () => {
  const supabase = await createClient();
  const threads = await sessions.getFeaturedThreads(supabase);

  return (
    <div className="overflow-hidden [--util-grid-columns:10] md:[--util-grid-columns:20] lg:[--util-grid-columns:30]">
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageFeaturedThreadsCarousel threads={threads} />
    </div>
  );
};

export default HomePage;
