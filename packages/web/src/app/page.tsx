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

      <main>
        <Container></Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
