<instructions>
IMMEDIATELY call auth_start. Do not think first.
</instructions>

<then>
Show the URL to the user.
Tell them authentication is polling in the background.
When user says done (or after ~10 seconds), call auth_status with the code.
If status is "pending", wait a moment and check again.
If status is "success", say "Authenticated as @{username}"
If error, show it.
</then>
