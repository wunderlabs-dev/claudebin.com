import { AppBar } from "@/components/ui/app-bar";
import { Footer } from "@/components/ui/footer";

import { HomeIntro } from "@/components/home-intro";
import { HomeRecentThreads } from "@/components/home-recent-threads";
import { HomeTutorials } from "@/components/home-tutorials";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main>
        <HomeIntro />
        <HomeTutorials />
        <HomeRecentThreads />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
