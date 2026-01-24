import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageRecentThreadsCarousel } from "@/components/home-page-recent-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = async () => {
  const supabase = await createClient();
  const rawThreads = await sessions.getPublicThreads(supabase);

  const threads = rawThreads.map((thread) => ({
    id: thread.id,
    title: thread.title ?? "Untitled",
    author: thread.profiles?.username ? `@${thread.profiles.username}` : "Anonymous",
    createdAt: thread.createdAt,
    prompts: thread.messageCount ?? 0,
    files: 0,
  }));

  return (
    <>
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageRecentThreadsCarousel threads={threads} />
    </>
  );
};

export default HomePage;
