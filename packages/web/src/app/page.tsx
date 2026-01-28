import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageRecentThreadsCarousel } from "@/components/home-page-recent-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = async () => {
  const supabase = await createClient();
  const { threads } = await sessions.getPublicThreads(supabase);

  return (
    <>
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageRecentThreadsCarousel threads={threads} />
    </>
  );
};

export default HomePage;
