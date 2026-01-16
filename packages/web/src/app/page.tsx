import { AppBar } from "@/components/ui/app-bar";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Footer } from "@/components/ui/footer";

import { SvgIconChat, SvgIconClock, SvgIconFile, SvgIconArrowLink } from "@/components/icon";

const HomePage = () => {
  return (
    <>
      <AppBar />

      <main className="py-12">
        <Container>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1">
                <SvgIconClock size="sm" />
                <span className="text-xs">2h ago</span>
              </div>
              <SvgIconArrowLink size="sm" color="primary" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <CardTitle>React hooks optimization patterns</CardTitle>
                <CardDescription>@sarah</CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>89 prompts</CardMeta>
                <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>2 files</CardMeta>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
