import { ImageResponse } from "next/og";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";
import { messages } from "@/supabase/repos/messages";
import { formatModelName } from "@/utils/helpers";

export const alt = "Claudebin Thread";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ id: string }>;
};

const getFirstUserMessage = (messageList: { role: string; content: unknown }[]): string => {
  const userMessage = messageList.find((m) => m.role === "user");
  if (!userMessage) return "";

  const content = userMessage.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const textBlock = content.find((b) => b.type === "text");
    return textBlock?.text ?? "";
  }
  return "";
};

const truncate = (text: string, maxLength: number): string => {
  const cleaned = text.replace(/<[^>]*>/g, "").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
};

const Image = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  const thread = await sessions.getByIdWithAuthor(supabase, id);
  if (!thread || !thread.isPublic) {
    return new Response("Not found", { status: 404 });
  }

  const { messages: messageList } = await messages.getBySessionId(supabase, id, {
    excludeMeta: true,
    excludeSidechain: true,
    limit: 10,
  });

  const firstMessage = getFirstUserMessage(messageList as { role: string; content: unknown }[]);
  const preview = truncate(firstMessage, 120);

  const title = thread.title ?? "Untitled Session";
  const username = thread.profiles?.username ?? "Anonymous";
  const avatarUrl = thread.profiles?.avatarUrl;
  const model = formatModelName(thread.modelName);
  const promptCount = thread.messageCount ?? 0;
  const date = new Date(thread.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const avatarElement = avatarUrl ? (
    // biome-ignore lint/a11y/useAltText: OG images use Satori which requires native img
    // biome-ignore lint/performance/noImgElement: Satori doesn't support next/image
    <img src={avatarUrl} width={44} height={44} style={{ borderRadius: "50%" }} />
  ) : (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "#ff6900",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        backgroundColor: "#191919",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 52,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          maxWidth: "90%",
        }}
      >
        {truncate(title, 80)}
      </div>

      {/* Preview */}
      {preview && (
        <div
          style={{
            display: "flex",
            padding: "24px 28px",
            backgroundColor: "#252525",
            borderRadius: 12,
            border: "1px solid #3a3a3a",
            fontSize: 22,
            color: "#a3a3a3",
            fontFamily: "monospace",
            lineHeight: 1.5,
          }}
        >
          "{preview}"
        </div>
      )}

      {/* Bottom row: metadata + watermark */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            color: "#8c8c8c",
          }}
        >
          {avatarElement}
          <span style={{ color: "#ffffff", fontWeight: 500 }}>{username}</span>
          <span>•</span>
          <span>{model}</span>
          <span>•</span>
          <span>{promptCount} prompts</span>
          <span>•</span>
          <span>{date}</span>
        </div>

        {/* Watermark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            color: "rgba(255, 105, 0, 0.25)",
            fontWeight: 600,
          }}
        >
          claudebin.com
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
};

export default Image;
