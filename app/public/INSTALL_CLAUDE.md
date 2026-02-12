I need you to install the claudebin plugin for Claude Code. This plugin lets me share my sessions to claudebin.com.

Execute these bash commands in order:

First: claude plugin marketplace add wunderlabs-dev/claudebin
Then: claude plugin install claudebin@claudebin-marketplace

After running both commands, tell me to:
1. Exit this Claude Code session
2. Restart with: claude -r
   (The -r flag re-enters this same session so we don't lose context)

Once restarted, the /claudebin:share command will be available to upload my current session and get a shareable URL.
