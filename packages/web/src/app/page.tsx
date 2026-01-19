import { AppBar } from "@/components/ui/app-bar";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";
import { Divider } from "@/components/ui/divider";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDivider,
  CardDescription,
  CardMetaGroup,
  CardMeta,
  CardSection,
} from "@/components/ui/card";

import {
  SvgIconArrowLink,
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
                <div className="h-32 bg-dot" />
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
                  <CardTitle>Title</CardTitle>
                  <CardMetaGroup direction="row">
                    <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>10 prompts</CardMeta>
                    <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>10 files</CardMeta>
                    <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>10 %</CardMeta>
                  </CardMetaGroup>
                </CardSection>

                <CardDivider />

                <CardSection>
                  <CardMetaGroup direction="row">
                    <CardMeta icon={<SvgIconUser size="sm" color="neutral" />}>10 views</CardMeta>
                    <CardMeta icon={<SvgIconFork size="sm" color="neutral" />}>10 forks</CardMeta>
                    <CardMeta icon={<SvgIconFolder size="sm" color="neutral" />}>project</CardMeta>
                  </CardMetaGroup>
                </CardSection>
              </CardBody>
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
                  <CardMetaGroup direction="column">
                    <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>10 prompts</CardMeta>
                    <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>10 files</CardMeta>
                    <CardMeta icon={<SvgIconJauge size="sm" color="neutral" />}>10 %</CardMeta>
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
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
