<instructions>
Call the publish tool with:
- project_path: the current working directory
- is_public: true

If the user is not authenticated, the tool will return an error asking them to run /auth first.
</instructions>

<output>
If successful, output the URL in a clear format like:
"Session published: <url>"

If there's an error, explain what went wrong and how to fix it.
</output>
