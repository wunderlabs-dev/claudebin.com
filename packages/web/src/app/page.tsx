import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Steps, StepsItem } from "@/components/ui/steps";
import { FormControl, Input, InputLabel } from "@/components/ui/form-control";
import { CopyInput } from "@/components/ui/copy-input";
import { Tabs, TabsList, TabsListItem, TabsContent } from "@/components/ui/tabs";
import { Divider } from "@/components/ui/divider";
import { List, ListItem, ListItemLabel } from "@/components/ui/list";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
} from "@/components/ui/card";

import {
  SvgIconArrowBottom,
  SvgIconArrowLeft,
  SvgIconArrowLink,
  SvgIconArrowRight,
  SvgIconArrowTop,
  SvgIconBash,
  SvgIconCalendar,
  SvgIconCheck,
  SvgIconClock,
  SvgIconCopy,
  SvgIconFile,
  SvgIconFolder,
  SvgIconFork,
  SvgIconGear,
  SvgIconGlitters,
  SvgIconHome,
  SvgIconJauge,
  SvgIconKey,
  SvgIconLine,
  SvgIconLoading,
  SvgIconRefresh,
  SvgIconShield,
  SvgIconChat,
  SvgIconSkull,
  SvgIconTalk,
  SvgIconUser,
} from "@/components/icon";

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Tabs</h2>
        <Tabs defaultValue="option1">
          <TabsList>
            <TabsListItem value="option1">Option</TabsListItem>
            <TabsListItem value="option2">Option</TabsListItem>
            <TabsListItem value="option3">Option</TabsListItem>
            <TabsListItem value="option4">Option</TabsListItem>
            <TabsListItem value="option5">Option</TabsListItem>
          </TabsList>

          <TabsContent value="option1">Content for option 1</TabsContent>
          <TabsContent value="option2">Content for option 2</TabsContent>
          <TabsContent value="option3">Content for option 3</TabsContent>
          <TabsContent value="option4">Content for option 4</TabsContent>
          <TabsContent value="option5">Content for option 5</TabsContent>
        </Tabs>

        <Tabs defaultValue="option1" variant="transparent">
          <TabsList>
            <TabsListItem value="option1">Option</TabsListItem>
            <TabsListItem value="option2">Option</TabsListItem>
          </TabsList>

          <TabsContent value="option1">Content for option 1</TabsContent>
          <TabsContent value="option2">Content for option 2</TabsContent>
        </Tabs>
      </section>

      <section className="flex w-full flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Divider</h2>
        <Divider />
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">List</h2>
        <List>
          <ListItem>
            <SvgIconUser size="md" />
            <ListItemLabel>Navigation</ListItemLabel>
          </ListItem>
          <ListItem variant="active">
            <SvgIconUser size="md" />
            <ListItemLabel variant="active">Navigation</ListItemLabel>
          </ListItem>
        </List>
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Card</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-1">
              <SvgIconClock size="sm" />
              <Typography variant="caption">2h ago</Typography>
            </div>
            <SvgIconArrowLink size="sm" color="primary" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <CardTitle>React hooks optimization patterns</CardTitle>
              <CardDescription>@sarah</CardDescription>
            </div>
            <div className="flex flex-col gap-1">
              <CardMeta icon={<SvgIconChat size="sm" color="muted" />}>89 prompts</CardMeta>
              <CardMeta icon={<SvgIconFile size="sm" color="muted" />}>2 files</CardMeta>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">CopyInput</h2>
        <CopyInput value="npx claudebin publish" />
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Input</h2>
        <div className="flex flex-col gap-4">
          <FormControl>
            <InputLabel htmlFor="default">Default label</InputLabel>
            <Input id="default" placeholder="Default input" />
          </FormControl>
          <FormControl variant="error">
            <InputLabel htmlFor="error">Error label</InputLabel>
            <Input id="error" placeholder="Error input" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="disabled">Disabled label</InputLabel>
            <Input id="disabled" disabled placeholder="Disabled input" />
          </FormControl>
        </div>
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Typography</h2>
        <div className="flex flex-col gap-2">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="body">Body text paragraph</Typography>
          <Typography variant="small">Small text</Typography>
          <Typography variant="caption">Caption text</Typography>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-medium">Avatar</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-medium">Buttons</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="default" disabled>
            Default disabled
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" disabled>
            Secondary disabled
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline" disabled>
            Outline disabled
          </Button>
          <Button variant="circle">
            <SvgIconGear />
          </Button>
          <Button variant="circle" disabled>
            <SvgIconGear />
          </Button>
          <Button variant="danger">Danger</Button>
          <Button variant="danger" disabled>
            Danger disabled
          </Button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-medium">Badges</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Badge variant="default">InputLabel</Badge>
          <Badge variant="success">InputLabel</Badge>
          <Badge variant="error">InputLabel</Badge>
          <Badge variant="default">
            <SvgIconClock /> InputLabel
          </Badge>
          <Badge variant="success">
            <SvgIconUser size="sm" /> InputLabel
            <SvgIconUser size="sm" />
          </Badge>
          <Badge variant="error">
            <SvgIconSkull size="sm" /> InputLabel
            <SvgIconSkull size="sm" />
          </Badge>
        </div>
      </section>

      <section className="flex flex-col items-start gap-4">
        <h2 className="text-lg font-medium">Steps</h2>
        <Steps>
          <StepsItem number={1}>Open your terminal</StepsItem>
          <StepsItem number={2}>Run the command</StepsItem>
          <StepsItem number={3}>Share your session</StepsItem>
        </Steps>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-medium">Icons</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SvgIconArrowBottom size="lg" />
          <SvgIconArrowLeft size="lg" />
          <SvgIconArrowLink size="lg" />
          <SvgIconArrowRight size="lg" />
          <SvgIconArrowTop size="lg" />
          <SvgIconBash size="lg" />
          <SvgIconCalendar size="lg" />
          <SvgIconCheck size="lg" />
          <SvgIconClock size="lg" />
          <SvgIconCopy size="lg" />
          <SvgIconFile size="lg" />
          <SvgIconFolder size="lg" />
          <SvgIconFork size="lg" />
          <SvgIconGear size="lg" />
          <SvgIconGlitters size="lg" />
          <SvgIconHome size="lg" />
          <SvgIconJauge size="lg" />
          <SvgIconKey size="lg" />
          <SvgIconLine size="lg" />
          <SvgIconLoading size="lg" />
          <SvgIconRefresh size="lg" />
          <SvgIconShield size="lg" />
          <SvgIconSkull size="lg" />
          <SvgIconTalk size="lg" />
          <SvgIconUser size="lg" />
        </div>

        {/* Icon sizes */}
        <div className="flex items-end gap-4 mt-4">
          <div className="flex flex-col items-center gap-1">
            <SvgIconHome size="xs" />
            <span className="text-xs text-gray-400">xs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SvgIconHome size="sm" />
            <span className="text-xs text-gray-400">sm</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SvgIconHome size="md" />
            <span className="text-xs text-gray-400">md</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SvgIconHome size="lg" />
            <span className="text-xs text-gray-400">lg</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SvgIconHome size="xl" />
            <span className="text-xs text-gray-400">xl</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
