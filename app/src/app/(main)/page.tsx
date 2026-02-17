import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageFeaturedThreads } from "@/components/home-page-featured-threads";
import { HomePageFeaturedThreadsCarousel } from "@/components/home-page-featured-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = () => {
  return (
    <div className="overflow-hidden [--util-grid-columns:10] md:[--util-grid-columns:20] lg:[--util-grid-columns:30]">
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageFeaturedThreads>
        <HomePageFeaturedThreadsCarousel />
      </HomePageFeaturedThreads>
    </div>
  );
};

export default HomePage;
