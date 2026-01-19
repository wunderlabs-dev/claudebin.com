import { AppBar } from "@/components/ui/app-bar";
import { Footer } from "@/components/ui/footer";

import { HomeIntro } from "@/components/HomeIntro";
import { HomeTutorials } from "@/components/HomeTutorials";

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
