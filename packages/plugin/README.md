# Claudebin Plugin

A Claude Code plugin for publishing sessions to claudebin.com.

## Installation

Add the plugin to your Claude Code configuration:

```bash
claude plugin add /path/to/packages/plugin
```

## Commands

### /share

Publish the current session to claudebin.com and get a shareable URL.

```
/share
```

Returns a URL like `https://claudebin.com/s/abc123` that anyone can view.

**Note:** Requires authentication. Run `/auth` first if not logged in.

### /auth

Authenticate with claudebin.com via GitHub OAuth.

```
/auth
```

Opens browser for GitHub sign-in, then saves credentials locally.

### /whoami

Check current authentication status.

```
/whoami
```

### /logout

Clear saved credentials.

```
/logout
```

## Architecture

```
/share → Claude calls → MCP publish tool → Upload to Supabase
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
- `commands/` - Slash command definitions
- `mcp/` - MCP server implementing tools
