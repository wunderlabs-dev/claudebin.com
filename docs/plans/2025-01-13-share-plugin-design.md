# Claudebin Share Plugin Design

**Date:** 13 January 2025
**Status:** Ready for implementation

## Overview

A Claude Code plugin that extracts the current session as raw JSONL for sharing. Prioritizes deterministic behavior - Claude's role is minimal (just passing working directory and outputting results).

## Architecture

```
/share command → Claude calls → MCP tool extract_session → Returns raw JSONL
```

The MCP server does all the work. Claude is a thin pass-through.

## Plugin Structure

```
packages/plugin/
├── .claude-plugin/
│   └── manifest.json       # Plugin metadata
├── commands/
│   └── share.md            # Slash command (thin wrapper)
├── mcp/
│   ├── src/
│   │   └── index.ts        # MCP server entry
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## MCP Server

### Tool: extract_session

**Input:**
```typescript
{ project_path: string }  // Absolute path to project directory
```

**Output:**
- Raw JSONL string (file contents verbatim)
- Error message if session not found

**Session Discovery Logic:**
1. Normalize project path: `/Users/foo/my-project` → `Users-foo-my-project`
2. Look in `~/.claude/projects/[normalized-path]/`
3. Find `.jsonl` files, filter out `agent-*` prefixed ones
4. Return contents of most recently modified file

**Error Cases:**
- No sessions found for project → Error message
- Project path doesn't exist → Error message

## Slash Command

`commands/share.md`:
```markdown
<instructions>
Call the extract_session tool with the current working directory as project_path.
</instructions>

<output>
Output the raw result exactly as returned. Do not summarize, format, or modify it.
</output>
```

## Plugin Manifest

`.claude-plugin/manifest.json`:
```json
{
  "name": "claudebin",
  "description": "Share Claude Code sessions to claudebin.com",
  "version": "0.1.0",
  "commands": ["commands/*.md"],
  "mcpServers": {
    "claudebin": {
      "command": "node",
      "args": ["mcp/dist/index.js"]
    }
  }
}
```

## MCP Package Configuration

`mcp/package.json`:
```json
{
  "name": "claudebin-mcp",
  "type": "module",
  "scripts": {
    "build": "tsup src/index.ts --format esm --clean",
    "dev": "tsup src/index.ts --format esm --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^latest"
  }
}
```

## Root Package Scripts

Add to root `package.json`:
```json
"plugin": "pnpm --filter claudebin-mcp dev"
```

## Future Work (Deferred)

- **Hook for reminders:** Prompt to share after certain events
- **Upload to Claudebin:** Authentication and API upload
- **Formatting options:** Markdown output, filtered JSON
