import { AppBar } from "@/components/ui/app-bar";
import {
  Thread,
  ThreadHeader,
  ThreadContent,
  ThreadTitle,
  ThreadDescription,
  ThreadMeta,
} from "@/components/ui/thread";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";

import { SvgIconChat, SvgIconClock, SvgIconFile, SvgIconArrowLink } from "@/components/icon";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main className="py-12">
        <Container>
          <Thread>
            <ThreadHeader>
              <div className="flex items-center gap-1">
                <SvgIconClock size="sm" />
                <span className="text-xs">2h ago</span>
              </div>
              <SvgIconArrowLink size="sm" color="primary" />
            </ThreadHeader>
            <ThreadContent>
              <div className="flex flex-col gap-1">
                <ThreadTitle>React hooks optimization patterns</ThreadTitle>
                <ThreadDescription>@sarah</ThreadDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ThreadMeta icon={<SvgIconChat size="sm" color="neutral" />}>89 prompts</ThreadMeta>
                <ThreadMeta icon={<SvgIconFile size="sm" color="neutral" />}>2 files</ThreadMeta>
              </div>
            </ThreadContent>
          </Thread>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
