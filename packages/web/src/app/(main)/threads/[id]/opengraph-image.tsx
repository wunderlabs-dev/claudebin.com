import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { format } from "date-fns";
import { isNil, not } from "ramda";

import { createClient } from "@/supabase/server";
import { sessions } from "@/supabase/repos/sessions";

type Props = {
  params: Promise<{ id: string }>;
};

export const alt = "Claudebin";
export const contentType = "image/png";

const hostGroteskRegular = fetch(
  "https://fonts.gstatic.com/s/hostgrotesk/v5/co3UmWBnlCJ3U42vbbfdwMjzqHAXOdFzqU5PuefOzhY.ttf",
).then((result) => result.arrayBuffer());

const hostGroteskBold = fetch(
  "https://fonts.gstatic.com/s/hostgrotesk/v5/co3UmWBnlCJ3U42vbbfdwMjzqHAXOdFzqU5PuWfJzhY.ttf",
).then((result) => result.arrayBuffer());

const assistantSrc = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public/images/assistant.jpg"),
).toString("base64")}`;

const backgroundSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/images/og-image-1200x630.png"),
).toString("base64")}`;

const colors = {
  orange50: "#ff6900",
  gray50: "#474747",
  gray100: "#191919",
  gray200: "#303030",
  gray400: "#a3a3a3",
  white: "#ffffff",
} as const;

const sizes = {
  width: 1200,
  height: 630,
  avatar: 96,
  iconLg: 24,
  iconSm: 20,
  border: 2,
  gapXl: 24,
  gapLg: 16,
  gapMd: 12,
  gapSm: 8,
  radiusFull: "50%",
} as const;

const SvgIconCalendar = () => (
  <svg
    role="img"
    aria-label="Calendar"
    width={sizes.iconLg}
    height={sizes.iconLg}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.gray400}
    strokeWidth={sizes.border}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SvgIconMessage = () => (
  <svg
    role="img"
    aria-label="Message"
    width={sizes.iconSm}
    height={sizes.iconSm}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.gray400}
    strokeWidth={sizes.border}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SvgIconFile = () => (
  <svg
    role="img"
    aria-label="File"
    width={sizes.iconSm}
    height={sizes.iconSm}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.gray400}
    strokeWidth={sizes.border}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const SvgIconEye = () => (
  <svg
    role="img"
    aria-label="Eye"
    width={sizes.iconSm}
    height={sizes.iconSm}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.gray400}
    strokeWidth={sizes.border}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SvgIconBrain = () => (
  <svg
    role="img"
    aria-label="Brain"
    width={sizes.iconSm}
    height={sizes.iconSm}
    viewBox="0 0 16 16"
    fill={colors.gray400}
  >
    <path d="m3.7 10.3 2.8-1.5v-.2H4.3L3 8.4H1.6l-.3-.1-.3-.4v-.2l.3-.2h.4l.9.1 1.3.1 1 .1 1.4.1h.2v-.2h-.1l-1.3-1-1.5-1-.8-.5-.4-.3-.2-.3-.1-.6.4-.4h.6l.5.4 1.1 1 1.5 1 .2.2.1-.1-.1-.2-.8-1.4-.8-1.4-.4-.6-.1-.4c0-.1-.1-.3-.1-.4l.4-.6.3-.1.6.1.2.2.4.8.6 1.3.9 1.8.3.5.1.5v.1h.1l.1-1L8.3 4l.1-1.6V2l.2-.5.4-.3.3.2.3.4v1.3l-.3 1.7-.2 1.1h.1l.1-.1.6-.8 1-1.2.4-.5.5-.5.3-.3h.6l.4.7-.1.7-.6.8-.5.7-.7 1-.5.8v.1h.1l1.7-.4.9-.2 1.1-.2.5.2V7l-.2.5-1.2.3-1.3.2-2 .5.9.1h1.3l1.8.1.4.3.3.4v.3l-.7.4-1-.2-2.2-.5-.8-.2h-.1v.1l.6.6L12 11l1.5 1.4.1.3-.2.3h-.2l-1.3-1-.5-.4-1.1-.9h-.1v.1l.3.4 1.4 2.1.1.6-.1.2-.4.1-.5-.3-.8-1.1-.8-1.3-.7-1.1-.1.1-.4 4.2-.2.2-.4.1-.4-.3-.2-.4.2-.9.2-1.1.2-.9.2-1.1.2-.4h-.1L7 11.1l-1.3 1.7-1 1.1-.2.1-.4-.2v-.4l.3-.4 1.4-1.8.8-1.1.5-.6v-.1l-3.7 2.4-.7.1-.3-.3v-.4l.1-.1 1.2-.8z" />
  </svg>
);

const Image = async ({ params }: Props) => {
  const { id } = await params;

  const supabase = await createClient();
  const thread = await sessions.getByIdWithAuthor(supabase, id);

  if (isNil(thread) || not(thread.isPublic)) {
    return new Response("Not found", { status: 404 });
  }

  const image = (
    <div
      tw="flex flex-col justify-center p-25 w-full h-full"
      style={{
        color: colors.white,
        backgroundImage: `url(${backgroundSrc})`,
        backgroundSize: "cover",
        gap: sizes.gapXl,
      }}
    >
      <div
        tw="flex items-center"
        style={{
          gap: sizes.gapLg,
        }}
      >
        <div
          tw="flex items-center text-xl"
          style={{
            gap: sizes.gapMd,
            color: colors.gray400,
          }}
        >
          <span style={{ color: colors.orange50 }}>{thread.profiles?.username}</span>
          <span style={{ color: colors.white }}>/</span>
          <div
            tw="flex items-center"
            style={{
              gap: sizes.gapSm,
            }}
          >
            <SvgIconCalendar />
            <span>{format(new Date(thread.createdAt), "dd/MM/yyyy")}</span>
          </div>
        </div>
      </div>

      <div
        tw="flex items-start"
        style={{
          gap: sizes.gapXl,
        }}
      >
        <div
          tw="font-bold text-7xl p-6 rounded-3xl rounded-tr-none"
          style={{
            borderStyle: "solid",
            borderWidth: sizes.border,
            borderColor: colors.gray50,
            backgroundColor: colors.gray100,
          }}
        >
          {thread.title}
        </div>

        {/* biome-ignore lint/a11y/useAltText: OG images use Satori */}
        {/* biome-ignore lint/performance/noImgElement: Satori doesn't support next/image */}
        <img
          src={assistantSrc}
          width={sizes.avatar}
          height={sizes.avatar}
          style={{
            borderRadius: sizes.radiusFull,
            borderStyle: "solid",
            borderWidth: sizes.border,
            borderColor: colors.orange50,
          }}
        />
      </div>

      <div
        tw="flex flex-col"
        style={{
          gap: sizes.gapMd,
        }}
      >
        <div
          tw="flex items-center text-xl"
          style={{
            gap: sizes.gapLg,
            color: colors.gray400,
          }}
        >
          <div tw="flex items-center" style={{ gap: sizes.gapSm }}>
            <SvgIconMessage />
            <span>{thread.messageCount} messages</span>
          </div>
          <span style={{ color: colors.white }}>/</span>
          <div tw="flex items-center" style={{ gap: sizes.gapSm }}>
            <SvgIconFile />
            <span>{thread.fileCount} files</span>
          </div>
          <span style={{ color: colors.white }}>/</span>
          <div tw="flex items-center" style={{ gap: sizes.gapSm }}>
            <SvgIconEye />
            <span>{thread.viewCount} views</span>
          </div>
          <span style={{ color: colors.white }}>/</span>
          <div tw="flex items-center" style={{ gap: sizes.gapSm }}>
            <SvgIconBrain />
            <span>{thread.modelName}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return new ImageResponse(image, {
    width: sizes.width,
    height: sizes.height,
    fonts: [
      { name: "Host Grotesk", data: await hostGroteskRegular, weight: 400, style: "normal" },
      { name: "Host Grotesk", data: await hostGroteskBold, weight: 800, style: "normal", },
    ],
  });
};

export default Image;
