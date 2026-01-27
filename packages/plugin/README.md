# Claudebin Plugin

A Claude Code plugin for publishing sessions to claudebin.com.

## Installation

Add the plugin to your Claude Code configuration:

```bash
claude plugin add /path/to/packages/plugin
```

## Usage

### /share

Publish the current session to claudebin.com and get a shareable URL.

```
/share
```

Returns a URL like `https://claudebin.com/threads/abc123` that anyone can view.

Automatically authenticates via browser if not logged in.

## Architecture

```
/share → Claude calls → MCP share tool → Auth if needed (opens browser)
                                       → Upload to Supabase
                                       → Background processing
                                       → Poll for completion
                                       → Return URL
```

## Development

Build the MCP server:

```bash
cd mcp
bun build
```

## Files

- `.claude-plugin/plugin.json` - Plugin metadata
- `commands/share.md` - The /share command
- `mcp/` - MCP server implementing the share tool
