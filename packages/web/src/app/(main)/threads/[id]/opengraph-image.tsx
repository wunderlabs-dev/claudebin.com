import { ImageResponse } from "next/og";
import { format } from "date-fns";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

export const alt = "Claudebin Thread";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ id: string }>;
};

const Image = async ({ params }: Props) => {
  const { id } = await params;

  const supabase = await createClient();

  const thread = await sessions.getByIdWithAuthor(supabase, id);
  if (!thread || !thread.isPublic) {
    return new Response("Not found", { status: 404 });
  }

  const title = thread.title ?? "Untitled Session";
  const username = thread.profiles?.username ?? "Anonymous";
  const avatarUrl = thread.profiles?.avatarUrl;
  const date = format(new Date(thread.createdAt), "MMM d, yyyy");

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
        backgroundColor: "#0C0C0C",
        backgroundImage: "linear-gradient(to bottom, #141414 0%, #0C0C0C 100%)",
        backgroundRepeat: "no-repeat",
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
        {title}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 24,
          fontSize: 20,
          color: "#8c8c8c",
        }}
      >
        {thread.messageCount ? <span>{thread.messageCount} messages</span> : null}
        {thread.messageCount && thread.fileCount ? <span>•</span> : null}
        {thread.fileCount ? <span>{thread.fileCount} files</span> : null}
        {thread.fileCount && thread.viewCount ? <span>•</span> : null}
        {thread.viewCount ? <span>{thread.viewCount} views</span> : null}
        {thread.viewCount && thread.likeCount ? <span>•</span> : null}
        {thread.likeCount ? <span>{thread.likeCount} likes</span> : null}
      </div>

      {/* Bottom row: author + watermark */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Author */}
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
