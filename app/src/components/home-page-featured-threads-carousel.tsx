import { createClient } from "@/server/supabase/server";
import { sessions } from "@/server/repos/sessions";

import { HomePageFeaturedThreadsListItem } from "@/components/home-page-featured-threads-list-item";

const HomePageFeaturedThreadsCarousel = async () => {
  const supabase = await createClient();
  const threads = await sessions.getFeaturedThreads(supabase);

  return threads.map((thread) => (
    <div key={thread.id} className="bg-gray-100">
      <HomePageFeaturedThreadsListItem thread={thread} />
    </div>
  ));
};

export { HomePageFeaturedThreadsCarousel };
