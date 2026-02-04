"use client";

import { useState } from "react";

import {
  SvgIconGlobe,
  SvgIconGear,
  SvgIconShield,
  SvgIconCircle,
  SvgIconCheck,
  SvgIconLoading,
  SvgIconCalendar,
  SvgIconEye,
  SvgIconHeart,
} from "@/components/icon";

import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardSection,
  CardActions,
} from "@/components/ui/card";
import { Chat, ChatItem, ChatContent } from "@/components/ui/chat";
import { Todo, TodoItem, TodoItemIcon, TodoItemLabel } from "@/components/ui/todo";
import { Code } from "@/components/ui/code";
import { Nav, NavLink, NavLabel } from "@/components/ui/nav";

import { ChatPageChatContentText } from "@/components/chat-page-chat-content-text";
import { ChatPageChatContentBash } from "@/components/chat-page-chat-content-bash";
import { ChatPageChatContentFileRead } from "@/components/chat-page-chat-content-file-read";
import { ChatPageChatContentFileWrite } from "@/components/chat-page-chat-content-file-write";
import { ChatPageChatContentFileEdit } from "@/components/chat-page-chat-content-file-edit";
import { ChatPageChatContentGlob } from "@/components/chat-page-chat-content-glob";
import { ChatPageChatContentGrep } from "@/components/chat-page-chat-content-grep";
import { ChatPageChatContentTask } from "@/components/chat-page-chat-content-task";
import { ChatPageChatContentTasks } from "@/components/chat-page-chat-content-tasks";
import { ChatPageChatContentQuestions } from "@/components/chat-page-chat-content-questions";
import { ChatPageChatContentWebFetch } from "@/components/chat-page-chat-content-web-fetch";
import { ChatPageChatContentWebSearch } from "@/components/chat-page-chat-content-web-search";
import { ChatPageChatContentToolUse } from "@/components/chat-page-chat-content-tool-use";
import { ChatPageChatContentMcp } from "@/components/chat-page-chat-content-mcp";
import { Steps, StepsItem } from "@/components/ui/steps";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { List, ListItem } from "@/components/ui/list";
import { CopyInput } from "@/components/ui/copy-input";
import { FormControl, Input, InputLabel, Textarea } from "@/components/ui/form-control";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Divider } from "@/components/ui/divider";
import { Backdrop } from "@/components/ui/backdrop";

const CODE_SNIPPET = `import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["plastic"],
  langs: ["typescript"],
});

const html = highlighter.codeToHtml(code, {
  lang: "typescript",
  theme: "plastic",
});`;

const UiPage = () => {
  const [inputValue, setInputValue] = useState("claudebin");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Container size="sm" spacing="lg">
      <div className="flex flex-col gap-6">
        <Typography variant="h1">Component Showcase</Typography>
        <Typography variant="body" color="neutral">
          Browse all UI components and their variants.
        </Typography>
      </div>

      <Divider className="my-12" />

      {/* Typography */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Typography</Typography>
        <div className="flex flex-col gap-4">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="body">Body text</Typography>
          <Typography variant="small">Small text</Typography>
          <Typography variant="overline">Overline text</Typography>
          <Typography variant="caption">Caption text</Typography>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Font weights
          </Typography>
          <div className="flex flex-wrap items-center gap-6">
            <Typography variant="body">Default</Typography>
            <Typography variant="body" fontWeight="semibold">
              Semibold
            </Typography>
            <Typography variant="body" fontWeight="bold">
              Bold
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Colors
          </Typography>
          <div className="flex flex-wrap items-center gap-6">
            <Typography variant="body">Default</Typography>
            <Typography variant="body" color="neutral">
              Neutral
            </Typography>
            <Typography variant="body" color="muted">
              Muted
            </Typography>
            <Typography variant="body" color="accent">
              Accent
            </Typography>
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Button */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Button</Typography>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="icon">
            <SvgIconGear />
          </Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">
            <ButtonText>Link Button</ButtonText>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Outline + Success
          </Typography>
          <div className="flex items-center gap-4">
            <Button variant="outline" color="success">
              <SvgIconCheck />
              Success
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Disabled
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default" disabled>
              Default
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Badge */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Badge</Typography>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Chip */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Chip</Typography>
        <div className="flex flex-wrap items-center gap-4">
          <Chip icon={<SvgIconGlobe size="sm" />} label="Public" />
          <Chip icon={<SvgIconShield size="sm" />} label="Secure" />
          <Chip icon={<SvgIconGear size="sm" />} label="Settings" />
        </div>
      </section>

      <Divider className="my-12" />

      {/* Avatar */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Avatar</Typography>
        <div className="flex flex-wrap items-center gap-6">
          <Avatar size="sm">
            <AvatarImage src="https://github.com/balajmarius.png" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage src="https://github.com/balajmarius.png" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/balajmarius.png" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Fallback
          </Typography>
          <div className="flex flex-wrap items-center gap-6">
            <Avatar size="sm">
              <AvatarFallback delayMs={0}>A</AvatarFallback>
            </Avatar>
            <Avatar size="md">
              <AvatarFallback delayMs={0}>B</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback delayMs={0}>C</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Card */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Card</Typography>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Card variant
          </Typography>
          <Card variant="card">
            <CardBody>
              <CardHeader>
                <CardTitle>Session Title</CardTitle>
                <CardDescription>A sample card description</CardDescription>
              </CardHeader>
            </CardBody>
            <CardSection className="p-4">
              <CardActions />
            </CardSection>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            List variant
          </Typography>
          <Card variant="list">
            <CardBody>
              <CardHeader>
                <CardTitle>List Item Title</CardTitle>
              </CardHeader>
              <CardDescription>Description for list card</CardDescription>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Grid variant
          </Typography>
          <Card variant="grid">
            <CardBody>
              <CardHeader>
                <CardTitle>Grid Card Title</CardTitle>
                <CardDescription>Grid card description</CardDescription>
              </CardHeader>
            </CardBody>
          </Card>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Chat */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Chat</Typography>
        <Chat>
          <ChatItem variant="user">
            <ChatContent>
              <ChatPageChatContentText
                block={{
                  type: "text",
                  text: "Add a `publishSession` function to the CLI that uploads the session to the API.",
                }}
              />
            </ChatContent>
          </ChatItem>
          <ChatItem variant="assistant">
            <ChatContent>
              <ChatPageChatContentText
                block={{
                  type: "text",
                  text: "## Publishing Sessions\n\nI'll add the `publishSession` function to the CLI. Here's the plan:\n\n1. **Read** the current session file\n2. **Upload** it to the API endpoint\n3. **Return** the shareable URL\n\nThe function accepts a `sessionId` parameter and returns a `Promise<string>` with the URL.\n\n> This will use the existing `supabase` client for authentication.\n\nLet me start by reading the existing code:\n\n| File | Purpose |\n|---|---|\n| `src/lib/session.ts` | Session discovery |\n| `src/lib/api.ts` | API client |\n| `src/commands/publish.ts` | Publish command |\n\n---\n\nHere's the implementation:",
                }}
              />
              <ChatPageChatContentFileRead
                block={{
                  type: "file_read",
                  id: "read-1",
                  file_path: "src/lib/session.ts",
                }}
              />
              <ChatPageChatContentFileRead
                block={{
                  type: "file_read",
                  id: "read-2",
                  file_path: "src/lib/api.ts",
                }}
              />
              <ChatPageChatContentGlob
                block={{
                  type: "glob",
                  id: "glob-1",
                  pattern: "src/commands/**/*.ts",
                }}
              />
              <ChatPageChatContentGrep
                block={{
                  type: "grep",
                  id: "grep-1",
                  pattern: "export const publish",
                  path: "src/commands",
                }}
              />
              <ChatPageChatContentFileWrite
                block={{
                  type: "file_write",
                  id: "write-1",
                  file_path: "src/lib/publish.ts",
                  content: `import { createClient } from "@supabase/supabase-js";\nimport type { Session } from "./types";\n\nexport const publishSession = async (session: Session): Promise<string> => {\n  const supabase = createClient(\n    process.env.SUPABASE_URL!,\n    process.env.SUPABASE_KEY!\n  );\n\n  const { data, error } = await supabase\n    .from("sessions")\n    .insert({ content: session, published: true })\n    .select("id")\n    .single();\n\n  if (error) throw new Error(error.message);\n\n  return \`https://claudebin.com/threads/\${data.id}\`;\n};`,
                }}
              />
              <ChatPageChatContentFileEdit
                block={{
                  type: "file_edit",
                  id: "edit-1",
                  file_path: "src/commands/publish.ts",
                  old_string: `  const result = await uploadSession(id);\n  console.log("Uploaded:", result);\n  return result;`,
                  new_string: `  const result = await publishSession(id);\n  const url = \`https://claudebin.com/threads/\${result.id}\`;\n  await clipboard.copy(url);\n  console.log("Published:", url);\n  return url;`,
                }}
              />
              <ChatPageChatContentBash
                block={{
                  type: "bash",
                  id: "bash-1",
                  command: "bun test src/lib/publish.test.ts",
                  description: "Run publish tests",
                }}
              />
              <ChatPageChatContentWebSearch
                block={{
                  type: "web_search",
                  id: "search-1",
                  query: "supabase storage upload file typescript",
                }}
              />
              <ChatPageChatContentWebFetch
                block={{
                  type: "web_fetch",
                  id: "fetch-1",
                  url: "https://supabase.com/docs/reference/javascript/storage-from-upload",
                  prompt: "How to upload a file to Supabase Storage",
                }}
              />
              <ChatPageChatContentTask
                block={{
                  type: "task",
                  id: "task-1",
                  description: "Explore upload patterns",
                  prompt: "Find how files are uploaded in the codebase",
                  subagent_type: "Explore",
                }}
              />
              <ChatPageChatContentTasks
                block={{
                  type: "tasks",
                  tasks: [
                    { id: "1", subject: "Read existing session code", status: "completed" },
                    {
                      id: "2",
                      subject: "Implement publishSession function",
                      status: "in_progress",
                    },
                    { id: "3", subject: "Add error handling", status: "pending" },
                  ],
                }}
              />
              <ChatPageChatContentQuestions
                block={{
                  type: "question",
                  id: "question-1",
                  questions: [
                    {
                      question: "Should the session be public by default?",
                      header: "Visibility",
                      options: [
                        { label: "Public", description: "Anyone with the link can view" },
                        { label: "Private", description: "Only you can view" },
                        { label: "Unlisted", description: "Not indexed, but accessible via link" },
                      ],
                      multiSelect: false,
                    },
                  ],
                }}
              />
              <ChatPageChatContentToolUse
                block={{
                  type: "tool_use",
                  id: "tool-1",
                  name: "NotebookEdit",
                  input: { notebook_path: "/docs/api.ipynb", cell_number: 3 },
                }}
              />
              <ChatPageChatContentMcp
                block={{
                  type: "mcp",
                  id: "mcp-1",
                  server: "claudebin",
                  tool: "share",
                  input: { project_path: "/Users/dev/project", is_public: true },
                }}
              />
            </ChatContent>
          </ChatItem>
        </Chat>
      </section>

      <Divider className="my-12" />

      {/* Todo */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Todo</Typography>
        <Todo>
          <TodoItem variant="pending">
            <TodoItemIcon variant="pending">
              <SvgIconCircle size="sm" />
            </TodoItemIcon>
            <TodoItemLabel>Set up the project</TodoItemLabel>
          </TodoItem>
          <TodoItem variant="in_progress">
            <TodoItemIcon variant="in_progress">
              <SvgIconLoading size="sm" />
            </TodoItemIcon>
            <TodoItemLabel>Build components</TodoItemLabel>
          </TodoItem>
          <TodoItem variant="completed">
            <TodoItemIcon variant="completed">
              <SvgIconCheck size="sm" />
            </TodoItemIcon>
            <TodoItemLabel>Initialize repository</TodoItemLabel>
          </TodoItem>
        </Todo>
      </section>

      <Divider className="my-12" />

      {/* Code */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Code</Typography>
        <Code code={CODE_SNIPPET} lang="typescript" />
      </section>

      <Divider className="my-12" />

      {/* Nav */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Nav</Typography>
        <Nav>
          <NavLink href="#" variant="default">
            <NavLabel variant="default">Home</NavLabel>
          </NavLink>
          <NavLink href="#" variant="active">
            <NavLabel variant="active">Threads</NavLabel>
          </NavLink>
          <NavLink href="#" variant="default">
            <NavLabel variant="default">Profile</NavLabel>
          </NavLink>
        </Nav>
      </section>

      <Divider className="my-12" />

      {/* Steps */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Steps</Typography>
        <Steps>
          <StepsItem>Install the CLI globally</StepsItem>
          <StepsItem>Run a Claude Code session</StepsItem>
          <StepsItem>Share your conversation</StepsItem>
        </Steps>
      </section>

      <Divider className="my-12" />

      {/* Table */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Table</Typography>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Session Alpha</TableCell>
              <TableCell>Public</TableCell>
              <TableCell>1,204</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Session Beta</TableCell>
              <TableCell>Private</TableCell>
              <TableCell>342</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Session Gamma</TableCell>
              <TableCell>Public</TableCell>
              <TableCell>8,912</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Divider className="my-12" />

      {/* List */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">List</Typography>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Row direction
          </Typography>
          <List direction="row">
            <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>Jan 15, 2026</ListItem>
            <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>1,204 views</ListItem>
            <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>42 likes</ListItem>
          </List>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Column direction
          </Typography>
          <List direction="column">
            <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>Jan 15, 2026</ListItem>
            <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>1,204 views</ListItem>
            <ListItem icon={<SvgIconHeart size="sm" color="neutral" />}>42 likes</ListItem>
          </List>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            Align between
          </Typography>
          <List direction="row" align="between">
            <ListItem icon={<SvgIconCalendar size="sm" color="neutral" />}>Jan 15, 2026</ListItem>
            <ListItem icon={<SvgIconEye size="sm" color="neutral" />}>1,204 views</ListItem>
          </List>
        </div>
      </section>

      <Divider className="my-12" />

      {/* CopyInput */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">CopyInput</Typography>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Terminal
            </Typography>
            <CopyInput value="npm i -g claudebin" variant="terminal" />
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Link
            </Typography>
            <CopyInput value="https://claudebin.com/threads/abc123" variant="link" />
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Snippet
            </Typography>
            <CopyInput value={'const greeting = "Hello, Claudebin!";'} variant="snippet" />
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* FormControl */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">FormControl</Typography>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Default
            </Typography>
            <FormControl>
              <InputLabel>Username</InputLabel>
              <Input
                placeholder="Enter your username"
                value={inputValue}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Error
            </Typography>
            <FormControl variant="error">
              <InputLabel>Email</InputLabel>
              <Input placeholder="Enter your email" />
            </FormControl>
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Filled Input
            </Typography>
            <Input variant="filled" value="Read-only filled input" readOnly />
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Textarea
            </Typography>
            <Textarea placeholder="Write a description..." rows={3} />
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Accordion */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Accordion</Typography>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Claudebin?</AccordionTrigger>
            <AccordionContent>
              A pastebin for vibes. Publish and share your Claude Code sessions with a single
              command.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Install the CLI globally with npm, run a Claude Code session, then share it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it open source?</AccordionTrigger>
            <AccordionContent>
              Yes, Claudebin is fully open source and available on GitHub.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Divider className="my-12" />

      {/* Tabs */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Tabs</Typography>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Default
            </Typography>
            <Tabs defaultValue="overview" variant="default">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-4">
                <Typography variant="small" color="neutral">
                  Overview tab content
                </Typography>
              </TabsContent>
              <TabsContent value="features" className="pt-4">
                <Typography variant="small" color="neutral">
                  Features tab content
                </Typography>
              </TabsContent>
              <TabsContent value="pricing" className="pt-4">
                <Typography variant="small" color="neutral">
                  Pricing tab content
                </Typography>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="small" color="neutral">
              Transparent
            </Typography>
            <Tabs defaultValue="code" variant="transparent">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="pt-4">
                <Typography variant="small" color="neutral">
                  Code tab content
                </Typography>
              </TabsContent>
              <TabsContent value="preview" className="pt-4">
                <Typography variant="small" color="neutral">
                  Preview tab content
                </Typography>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Divider */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Divider</Typography>
        <Divider />
      </section>

      <Divider className="my-12" />

      {/* Container */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Container</Typography>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            sm (max-w-xl)
          </Typography>
          <Container size="sm" className="rounded-lg border border-gray-250 p-4">
            <Typography variant="caption" color="neutral">
              Container sm
            </Typography>
          </Container>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            md (max-w-7xl)
          </Typography>
          <Container size="md" className="rounded-lg border border-gray-250 p-4">
            <Typography variant="caption" color="neutral">
              Container md
            </Typography>
          </Container>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="small" color="neutral">
            lg (max-w-container)
          </Typography>
          <Container size="lg" className="rounded-lg border border-gray-250 p-4">
            <Typography variant="caption" color="neutral">
              Container lg
            </Typography>
          </Container>
        </div>
      </section>

      <Divider className="my-12" />

      {/* Backdrop */}
      <section className="flex flex-col gap-8">
        <Typography variant="h3">Backdrop</Typography>
        <div className="relative h-48 overflow-hidden rounded-lg border border-gray-250">
          <Backdrop size="half">
            <div className="flex h-48 items-center justify-center">
              <Typography variant="small" color="neutral">
                Backdrop (half)
              </Typography>
            </div>
          </Backdrop>
        </div>
      </section>
    </Container>
  );
};

export default UiPage;
