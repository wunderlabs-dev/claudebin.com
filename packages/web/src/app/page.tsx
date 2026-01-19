import { AppBar } from "@/components/ui/app-bar";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";

import { HomeIntro } from "@/components/HomeIntro";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main>
        <Container>
          <HomeIntro />
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
