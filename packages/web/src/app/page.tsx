import { AppBar } from "@/components/ui/app-bar";
import {
  Thread,
  ThreadColumn,
  ThreadContent,
  ThreadTitle,
  ThreadDescription,
  ThreadGroup,
  ThreadGroupItem,
} from "@/components/ui/thread";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";

import {
  SvgIconChat,
  SvgIconClock,
  SvgIconFile,
  SvgIconJauge,
  SvgIconFolder,
  SvgIconFork,
} from "@/components/icon";
import { Divider } from "@/components/ui/divider";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main className="py-12">
        <Container>
          <div className="flex flex-col gap-8">
            <Thread>
              <ThreadContent>
                <ThreadGroup>
                  <ThreadTitle>React hooks optimization patterns</ThreadTitle>
                  <ThreadDescription>@sarah</ThreadDescription>
                </ThreadGroup>
                <ThreadGroup>
                  <ThreadGroupItem icon={<SvgIconChat size="sm" color="neutral" />}>
                    89 prompts
                  </ThreadGroupItem>
                  <ThreadGroupItem icon={<SvgIconFile size="sm" color="neutral" />}>
                    2 files
                  </ThreadGroupItem>
                </ThreadGroup>
              </ThreadContent>
            </Thread>

            <Thread variant="detailed">
              <ThreadContent>
                <ThreadColumn className="col-span-10" divider="right">
                  <ThreadTitle variant="h4">React hooks optimization patterns</ThreadTitle>
                  <ThreadGroup direction="row">
                    <ThreadGroupItem icon={<SvgIconChat size="sm" color="neutral" />}>
                      89 prompts
                    </ThreadGroupItem>
                    <ThreadGroupItem icon={<SvgIconFile size="sm" color="neutral" />}>
                      2 files
                    </ThreadGroupItem>
                  </ThreadGroup>

                  <Divider />

                  <div className="flex justify-between">
                    <ThreadGroup direction="row">
                      <ThreadGroupItem icon={<SvgIconJauge size="sm" color="neutral" />}>
                        10 Views
                      </ThreadGroupItem>
                      <ThreadGroupItem icon={<SvgIconFork size="sm" color="neutral" />}>
                        10 forks
                      </ThreadGroupItem>
                      <ThreadGroupItem icon={<SvgIconFolder size="sm" color="neutral" />}>
                        project/master
                      </ThreadGroupItem>
                    </ThreadGroup>
                    <ThreadGroupItem icon={<SvgIconClock size="sm" color="neutral" />}>
                      2h ago
                    </ThreadGroupItem>
                  </div>
                </ThreadColumn>
              </ThreadContent>
            </Thread>

            <Thread variant="grid">
              <ThreadContent>
                <ThreadColumn className="col-span-1">
                  <ThreadTitle variant="h3">React hooks optimization patterns</ThreadTitle>
                  <ThreadDescription>@author</ThreadDescription>
                </ThreadColumn>

                <ThreadColumn className="col-span-1" divider="both">
                  <ThreadGroup>
                    <ThreadGroupItem icon={<SvgIconJauge size="sm" color="neutral" />}>
                      10 Views
                    </ThreadGroupItem>
                    <ThreadGroupItem icon={<SvgIconFork size="sm" color="neutral" />}>
                      10 forks
                    </ThreadGroupItem>
                    <ThreadGroupItem icon={<SvgIconFolder size="sm" color="neutral" />}>
                      project/master
                    </ThreadGroupItem>
                  </ThreadGroup>

                  <Divider />

                  <ThreadGroup>
                    <ThreadGroupItem icon={<SvgIconJauge size="sm" color="neutral" />}>
                      10 Views
                    </ThreadGroupItem>
                    <ThreadGroupItem icon={<SvgIconFork size="sm" color="neutral" />}>
                      10 forks
                    </ThreadGroupItem>
                    <ThreadGroupItem icon={<SvgIconFolder size="sm" color="neutral" />}>
                      project/master
                    </ThreadGroupItem>
                  </ThreadGroup>
                </ThreadColumn>
              </ThreadContent>
            </Thread>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
