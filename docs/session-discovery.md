# Session Discovery Design

## Problem

When a user closes a Claude Code session and returns to the terminal later, they need to publish that specific session. The CLI must intelligently identify which session to publish based on the current working directory.

## Solution

Use **most recent session in current working directory within the last hour**.

## Assumptions

- User publishes immediately or shortly after closing the session
- If multiple sessions exist, the most recent one is the one to publish
- Sessions older than 1 hour are considered stale

## Behavior

### Time Window
- Search for sessions in the **last 1 hour** only
- Sessions older than 1 hour are not considered
- This ensures recent work while avoiding stale sessions

### Discovery Process

When user runs `npx vibelink`:

1. **Get current project path** from `process.cwd()`
2. **Find all sessions** for this project path in `~/.claude/projects/[normalized-path]/`
3. **Filter by time:** Only sessions modified in last 1 hour
4. **Sort by recency:** Most recent first
5. **Pick the first one** (most recent)

### Behavior

**If no sessions found in last hour:**
```bash
[ERROR]: No recent sessions found in last hour
```

**If session found:**
Auto-publish the most recent one:
```bash
✓ Publishing session from 11:43 AM
```

## Implementation Details

### Project Path Normalization
Claude Code stores sessions in directories with normalized paths:
- `/Users/foo/bar` → `-Users-foo-bar`
- Convert slashes to dashes for directory lookup

### Session File Format
- Sessions are stored as `[session-id].jsonl` files
- Agent sessions (prefixed with `agent-`) are excluded
- File modification time indicates last activity

### Time Filtering
- Use file system `mtime` (modification time)
- Compare against `Date.now() - (60 * 60 * 1000)` (1 hour ago)

## Edge Cases

### Multiple sessions in same project within last hour
- Always picks the most recent one (by file modification time)
- User is assumed to publish right after closing the session

### Session closed hours ago but terminal still open
- Time filter (1 hour) prevents publishing stale sessions
- User sees "No recent sessions found" error
- Must pass session ID explicitly: `npx vibelink [session-id]`

### Multiple terminal tabs in same project
- All tabs share the same project directory
- Always publishes the most recent session regardless of which tab it came from

## Alternative: Explicit Session ID

User can always bypass auto-discovery:
```bash
npx vibelink a0222035-9e81-4469-b188-33677de1519a
```

This is useful for:
- Publishing old sessions (>1 hour ago)
- Publishing from different directory
- Scripting/automation
