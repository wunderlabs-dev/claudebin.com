#!/usr/bin/env node
import { Command } from 'commander';

import { whoami } from '@/commands/login';
import { publish } from '@/commands/publish';

const program = new Command();

program
  .name('vibebin')
  .description('Publish and share your vibe coding sessions')
  .version('0.1.0')
  .option('-p, --private', 'Publish session as private')
  .action(publish);

program
  .command('whoami')
  .description('Show current authenticated user')
  .action(whoami);

program.parse();
