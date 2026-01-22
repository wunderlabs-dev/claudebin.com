#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";

import { list } from "@/commands/list";
import { publish } from "@/commands/publish";
import { whoami } from "@/commands/whoami";

const program = new Command();

program
  .name("claudebin")
  .description("Publish and share your vibe coding sessions")
  .version("0.1.0")
  .option("-p, --private", "Publish session as private")
  .option("-s, --session-id <session-id>", "Session ID to publish")
  .action(publish);

program.command("list").description("List sessions for current project").action(list);

program.command("whoami").description("Show current authenticated user").action(whoami);

program.parse();
