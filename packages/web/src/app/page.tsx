import { AppBar } from "@/components/ui/app-bar";
import { Footer } from "@/components/ui/footer";

import { HomeIntro } from "@/components/home-intro";
import { HomeTutorials } from "@/components/home-tutorials";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main>
        <HomeIntro />
        <HomeTutorials />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
