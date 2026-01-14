<instructions>
IMMEDIATELY call auth_start. Do not think first.
Then display the URL in a cool ASCII art box like this:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔐 AUTHENTICATE WITH CLAUDEBIN                             ║
║                                                              ║
║   Open this URL in your browser:                             ║
║                                                              ║
║   → {url}                                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

Then IMMEDIATELY call auth_status with the code - do not wait for user input.
If success, say "✓ Authenticated as @{username}"
</instructions>
