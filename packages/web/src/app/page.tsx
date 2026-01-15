import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Steps, StepsItem } from "@/components/ui/steps";
import { FormControl, Input, InputLabel } from "@/components/ui/form-control";
import { CopyInput } from "@/components/ui/copy-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Divider } from "@/components/ui/divider";
import { List, ListItem, ListItemLabel } from "@/components/ui/list";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardMeta } from "@/components/ui/card";

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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-350 uppercase tracking-wider">{children}</h2>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="flex w-full max-w-4xl flex-col gap-6 border-b border-gray-150 pb-12">
    {children}
  </section>
);

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-12">
      {/* Accordion */}
      <Section>
        <SectionTitle>Accordion</SectionTitle>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      {/* Buttons */}
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">Default</Button>
            <Button variant="default" disabled>
              Default disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary">Secondary</Button>
            <Button variant="secondary" disabled>
              Secondary disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline">Outline</Button>
            <Button variant="outline" disabled>
              Outline disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="danger">Danger</Button>
            <Button variant="danger" disabled>
              Danger disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="circle">
              <SvgIconGear />
            </Button>
            <Button variant="circle" disabled>
              <SvgIconGear />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="link">
              <SvgIconArrowLeft size="sm" /> <ButtonText>Back</ButtonText>
            </Button>
            <Button variant="link">
              <ButtonText>Next</ButtonText> <SvgIconArrowRight size="sm" />
            </Button>
            <Button variant="link" disabled>
              <SvgIconArrowLeft size="sm" /> <ButtonText>Back</ButtonText>
            </Button>
          </div>
        </div>
      </Section>

      {/* Avatar */}
      <Section>
        <SectionTitle>Avatar</SectionTitle>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-6">
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
          <div className="flex flex-wrap items-center gap-6">
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
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section>
        <SectionTitle>Badges</SectionTitle>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="default">
            <SvgIconClock size="sm" /> With icon
          </Badge>
          <Badge variant="success">
            <SvgIconCheck size="sm" /> Complete
          </Badge>
          <Badge variant="error">
            <SvgIconSkull size="sm" /> Failed
          </Badge>
        </div>
      </Section>

      {/* Input */}
      <Section>
        <SectionTitle>Input</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormControl>
            <InputLabel htmlFor="default">Default</InputLabel>
            <Input id="default" placeholder="Enter text..." />
          </FormControl>
          <FormControl variant="error">
            <InputLabel htmlFor="error">Error</InputLabel>
            <Input id="error" placeholder="Invalid input" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="disabled">Disabled</InputLabel>
            <Input id="disabled" disabled placeholder="Disabled" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="filled">Filled</InputLabel>
            <Input id="filled" variant="filled" placeholder="Filled variant" />
          </FormControl>
        </div>
      </Section>

      {/* CopyInput */}
      <Section>
        <SectionTitle>Copy Input</SectionTitle>
        <div className="max-w-md">
          <CopyInput value="npx claudebin publish" />
        </div>
      </Section>

      {/* Tabs */}
      <Section>
        <SectionTitle>Tabs</SectionTitle>
        <div className="flex flex-col gap-8">
          <div>
            <Typography variant="small" color="neutral" className="mb-3">
              Default
            </Typography>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Overview</TabsTrigger>
                <TabsTrigger value="tab2">Settings</TabsTrigger>
                <TabsTrigger value="tab3">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="pt-4">
                Overview content
              </TabsContent>
              <TabsContent value="tab2" className="pt-4">
                Settings content
              </TabsContent>
              <TabsContent value="tab3" className="pt-4">
                Activity content
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Typography variant="small" color="neutral" className="mb-3">
              Transparent
            </Typography>
            <Tabs defaultValue="tab1" variant="transparent">
              <TabsList>
                <TabsTrigger value="tab1">All</TabsTrigger>
                <TabsTrigger value="tab2">Published</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="pt-4">
                All items
              </TabsContent>
              <TabsContent value="tab2" className="pt-4">
                Published items
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>

      {/* Card */}
      <Section>
        <SectionTitle>Card</SectionTitle>
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
              <CardMeta icon={<SvgIconChat size="sm" color="neutral" />}>89 prompts</CardMeta>
              <CardMeta icon={<SvgIconFile size="sm" color="neutral" />}>2 files</CardMeta>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* List */}
      <Section>
        <SectionTitle>List</SectionTitle>
        <List>
          <ListItem>
            <SvgIconHome size="md" />
            <ListItemLabel>Dashboard</ListItemLabel>
          </ListItem>
          <ListItem variant="active">
            <SvgIconUser size="md" />
            <ListItemLabel variant="active">Profile</ListItemLabel>
          </ListItem>
          <ListItem>
            <SvgIconGear size="md" />
            <ListItemLabel>Settings</ListItemLabel>
          </ListItem>
        </List>
      </Section>

      {/* Steps */}
      <Section>
        <SectionTitle>Steps</SectionTitle>
        <Steps>
          <StepsItem number={1}>Open your terminal</StepsItem>
          <StepsItem number={2}>Run the command</StepsItem>
          <StepsItem number={3}>Share your session</StepsItem>
        </Steps>
      </Section>

      {/* Typography */}
      <Section>
        <SectionTitle>Typography</SectionTitle>
        <div className="flex flex-col gap-4">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="body">Body text</Typography>
          <Typography variant="small">Small text</Typography>
          <Typography variant="caption">Caption text</Typography>
          <Typography variant="small" color="neutral">
            Neutral color
          </Typography>
        </div>
      </Section>

      {/* Divider */}
      <Section>
        <SectionTitle>Divider</SectionTitle>
        <div className="w-full">
          <Typography variant="small" className="mb-4">
            Content above
          </Typography>
          <Divider />
          <Typography variant="small" className="mt-4">
            Content below
          </Typography>
        </div>
      </Section>

      {/* Icons */}
      <section className="flex w-full max-w-4xl flex-col gap-6 pb-12">
        <SectionTitle>Icons</SectionTitle>
        <div className="flex flex-wrap items-center gap-4">
          <SvgIconArrowBottom size="lg" />
          <SvgIconArrowLeft size="lg" />
          <SvgIconArrowLink size="lg" />
          <SvgIconArrowRight size="lg" />
          <SvgIconArrowTop size="lg" />
          <SvgIconBash size="lg" />
          <SvgIconCalendar size="lg" />
          <SvgIconCheck size="lg" />
          <SvgIconChat size="lg" />
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
        <div className="flex items-end gap-6">
          <SvgIconHome size="xs" />
          <SvgIconHome size="sm" />
          <SvgIconHome size="md" />
          <SvgIconHome size="lg" />
          <SvgIconHome size="xl" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
