# Claudebin Share Plugin

A Claude Code plugin that extracts the current session as raw JSONL for sharing to claudebin.com.

## Installation

Add the plugin to your Claude Code configuration:

```bash
claude plugin add /path/to/packages/plugin
```

## Usage

In a Claude Code session:

```
/share
```

This extracts the current session's JSONL and outputs it for sharing.

## Architecture

The plugin uses an MCP server to handle session extraction. Claude acts as a thin pass-through:

```
/share command → Claude calls → MCP tool extract_session → Returns raw JSONL
```

## Development

Build the MCP server:

```bash
cd mcp
pnpm build
```

## Files

- `.claude-plugin/manifest.json` - Plugin metadata and MCP server configuration
- `commands/share.md` - Slash command definition
- `mcp/` - MCP server that implements the extract_session tool
