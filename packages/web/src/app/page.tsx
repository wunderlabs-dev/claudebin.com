import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageRecentThreadsCarousel } from "@/components/home-page-recent-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = async () => {
  const supabase = await createClient();
  const { threads } = await sessions.getPublicThreads(supabase);

  return (
    <div className="overflow-hidden [--util-grid-columns:10] md:[--util-grid-columns:20] lg:[--util-grid-columns:30]">
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageRecentThreadsCarousel threads={threads} />
    </div>
  );
};

export default HomePage;
