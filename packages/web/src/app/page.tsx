import { AppBar } from "@/components/ui/app-bar";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDivider,
  CardDescription,
  CardActions,
  CardMetaGroup,
  CardMeta,
  CardSection,
} from "@/components/ui/card";

import {
  SvgIconChat,
  SvgIconClock,
  SvgIconFile,
  SvgIconJauge,
  SvgIconFolder,
  SvgIconFork,
  SvgIconUser,
} from "@/components/icon";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main className="py-12">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="max-w-xs">
              <Card variant="card">
                <CardBody className="self-end">
                  <CardMetaGroup direction="row">
                    <CardMeta icon={<SvgIconClock size="sm" color="neutral" />}>2h ago</CardMeta>
                    <CardActions />
                  </CardMetaGroup>
                </CardBody>

                <CardBody>
                  <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>@author</CardDescription>
                  </CardHeader>
                  <CardMetaGroup direction="column">
                    <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>10 prompts</CardMeta>
                    <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>10 files</CardMeta>
                  </CardMetaGroup>
                </CardBody>
              </Card>
            </div>

            <Card variant="list">
              <CardBody>
                <CardSection>
                  <CardHeader>
                    <CardTitle>Title</CardTitle>
                  </CardHeader>
                  <CardMetaGroup direction="row">
                    <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>10 prompts</CardMeta>
                    <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>10 files</CardMeta>
                    <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>10%</CardMeta>
                  </CardMetaGroup>
                </CardSection>

                <CardDivider />

                <CardSection>
                  <CardMetaGroup direction="row">
                    <CardMeta icon={<SvgIconUser size="sm" color="neutral" />}>10 views</CardMeta>
                    <CardMeta icon={<SvgIconFork size="sm" color="neutral" />}>10 forks</CardMeta>
                    <CardMeta icon={<SvgIconFolder size="sm" color="neutral" />}>
                      project/master
                    </CardMeta>
                    <CardMeta icon={<SvgIconClock size="sm" color="neutral" />} align="end">
                      2h ago
                    </CardMeta>
                  </CardMetaGroup>
                </CardSection>
              </CardBody>

              <CardBody className="col-span-1 transition-colors bg-gray-500/40 group-hover:bg-orange-50 bg-dot" />
            </Card>

            <Card variant="grid">
              <CardBody>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                  <CardDescription>@author</CardDescription>
                </CardHeader>
              </CardBody>

              <CardBody>
                <CardSection>
                  <CardActions />

                  <CardMetaGroup direction="column">
                    <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>10 prompts</CardMeta>
                    <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>10 files</CardMeta>
                    <CardMetaGroup direction="row" align="between">
                      <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>10%</CardMeta>
                      <CardMeta icon={<SvgIconClock size="sm" color="neutral" />}>2h ago</CardMeta>
                    </CardMetaGroup>
                  </CardMetaGroup>
                </CardSection>

                <CardDivider />

                <CardSection>
                  <CardMetaGroup direction="column">
                    <CardMeta icon={<SvgIconUser size="sm" color="neutral" />}>10 views</CardMeta>
                    <CardMeta icon={<SvgIconFork size="sm" color="neutral" />}>10 forks</CardMeta>
                    <CardMeta icon={<SvgIconFolder size="sm" color="neutral" />}>
                      project/master
                    </CardMeta>
                  </CardMetaGroup>
                </CardSection>
              </CardBody>

              <CardBody className="transition-colors bg-gray-500/40 group-hover:bg-orange-50 bg-dot" />
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
