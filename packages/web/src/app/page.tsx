import { HomePageHeroIntroduction } from "@/components/home-page-hero-introduction";
import { HomePageRecentThreadsCarousel } from "@/components/home-page-recent-threads-carousel";
import { HomePageTutorialsList } from "@/components/home-page-tutorials-list";

const HomePage = () => {
  return (
    <>
      <HomePageHeroIntroduction />
      <HomePageTutorialsList />
      <HomePageRecentThreadsCarousel />
    </>
  );
};

export default HomePage;
