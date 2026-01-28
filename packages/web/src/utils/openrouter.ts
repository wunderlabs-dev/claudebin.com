import "server-only";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

const TITLE_SYSTEM_PROMPT = `<role>You are a title generator for coding sessions.</role>

<task>Generate a short, descriptive title (max 50 chars) from the user's first message.</task>

<rules>
  <rule>Be concise and descriptive</rule>
  <rule>Focus on the main task or topic</rule>
  <rule>Use title case</rule>
  <rule>No quotes or punctuation at the end</rule>
  <rule>If the message is unclear, extract the key action or topic</rule>
  <rule>Output ONLY the title, nothing else</rule>
</rules>

<examples>
  <example>
    <input>help me fix the login bug</input>
    <output>Fix Login Bug</output>
  </example>
  <example>
    <input>I want to add dark mode to my app</input>
    <output>Add Dark Mode Feature</output>
  </example>
  <example>
    <input>refactor the auth module</input>
    <output>Refactor Auth Module</output>
  </example>
</examples>`;

export const generateTitle = async (firstMessage: string): Promise<string | null> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY not set, falling back to simple title");
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://claudebin.com",
        "X-Title": "Claudebin",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: TITLE_SYSTEM_PROMPT },
          { role: "user", content: firstMessage.slice(0, 500) },
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim();

    if (!title) {
      return null;
    }

    // Clean up the title
    return title
      .replace(/^["']|["']$/g, "") // Remove quotes
      .replace(/\.+$/, "") // Remove trailing dots
      .slice(0, 60); // Ensure max length
  } catch (error) {
    console.error("Title generation failed:", error);
    return null;
  }
};
