# Claudebin Web App - Design Brief

**Date:** 18 December 2025
**Status:** Ready for design

## Product Overview

Claudebin is "pastebin for AI coding sessions." Developers publish their Claude conversations with one CLI command (`npx claudebin publish`) and get a shareable link. The web app displays these conversations and allows copying them for context reuse.

**Core principle:** Get out of the user's way. Content (conversations) is the focus, UI should be nearly invisible.

## Design Direction

**The vibe:** Minimal, fast, functional. A tool developers actually want to use, not a flashy product.

**Visual references:**
- Linear (clean, minimal)
- Vercel (fast, simple)
- AmpCode threads (conversation display)

**Aesthetic:** Blend of technical and approachable - not sterile, not playful. Developer-focused but welcoming.

**Theme:** Dark mode only

## The Three Pages

### 1. Landing Page (`claudebin.link/`)

**Purpose:** Quickly explain the concept and show how it works.

**Elements:**

1. **Hero section:**
   - Headline: "Share your AI coding sessions" (or similar)
   - One-line explanation: "Pastebin for Claude conversations"

2. **Demo video:**
   - Short video (30-60 seconds) showing:
     - Terminal: `npx claudebin publish`
     - CLI output with link
     - Browser opening to session page
   - Autoplay, muted, looping

3. **Install command:**
   - Show: `npx claudebin publish`
   - Copy button to copy the install command
   - No "Sign up" button - let the CLI handle auth

**Layout:** Center-aligned, single column, 2-3 screen heights max. Video is prominent. Keep it super simple.

---

### 2. Session Page (`claudebin.link/@username/session-id`)

**Purpose:** Display a published conversation. The main content page.

**Elements:**

1. **Header bar (minimal):**
   - Username + avatar (left)
   - Publish date/timestamp
   - Session title if available

2. **Main content - The conversation:**
   - Chronological display of messages
   - User messages, assistant responses, tool calls/outputs
   - Similar to AmpCode threads - simple, readable, chronological
   - Syntax highlighting for code blocks
   - Tool outputs can be collapsed if long

3. **Copy conversation button:**
   - Prominent button: "Copy conversation"
   - Clicking copies entire conversation to clipboard in markdown format
   - Ready to paste into Claude or other agents
   - Shows feedback: "Copied!" after click

**Layout:** Single column, max-width for readability (not full screen), conversation flows top to bottom.

**What's NOT included:** No comments, reactions, or social features. Just read and copy.

**States:**

- **Loading:** Simple skeleton loader or spinner with "Loading conversation..." message
- **Session not found (404):** Clean page with "Session not found" + CTA to homepage or show install command
- **Network error:** "Failed to load conversation. Please refresh the page." + Retry button
- **Corrupted data:** "This session appears to be corrupted." + Contact support option

---

### 3. CLI Auth Page (`claudebin.link/cli/auth`)

**Purpose:** Handle GitHub OAuth for CLI authentication.

**The flow:**
1. User runs CLI command that needs auth
2. CLI opens this page in browser
3. User authenticates
4. Returns to terminal

**Elements:**

**Before authentication:**
- Simple centered layout
- Message: "Authenticate Claudebin CLI"
- "Sign in with GitHub" button
- Small note: "This will allow the CLI to publish sessions on your behalf"

**After successful authentication:**
- Success message: "✓ Authenticated!"
- Instruction: "Return to your terminal to continue"

**Layout:** Centered card/box, minimal. This is a utility page, not a destination.

**States:**

- **Loading (during OAuth):** Spinner with "Connecting to GitHub..." message
- **OAuth failed:** "Authentication failed. Please try again." + Retry button
- **Network error:** "Connection error. Check your internet and try again." + Retry button
- **Generic error:** "Something went wrong. Please try again or contact support."

All errors show clear message + action (retry button or back to homepage).

---

## Key Design Principles

1. **Minimal and functional** - Every element serves a purpose
2. **Dark mode only** - Single theme, done right
3. **Developer-focused** - No marketing fluff, just utility
4. **Fast and responsive** - Works on mobile, but desktop is primary
5. **Typography-focused** - Code and conversation are the content
6. **Copy-first** - The main action is copying conversation context

## Technical Constraints

- Built with Next.js 15 (for developer reference)
- Code blocks need syntax highlighting
- Responsive design (desktop primary, mobile secondary)
- Must handle long conversations (potentially 100+ messages)
- Copy to clipboard functionality required

## What Success Looks Like

A developer lands on a session page and immediately understands the conversation without friction. Copying the conversation is obvious and instant. The landing page makes them want to try the CLI. The whole experience feels fast and invisible.
