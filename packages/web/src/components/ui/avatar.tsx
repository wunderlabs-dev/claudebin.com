"use client";

import { createContext, useContext } from "react";
import type * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/utils/helpers";
import { AVATAR_FALLBACK_DELAY_MS } from "@/utils/constants";

const AvatarSizes = ["sm", "md", "lg"] as const;

type AvatarSize = (typeof AvatarSizes)[number];

const AvatarContext = createContext<AvatarSize>("md");

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize;
};

const avatarSizeClassNames: Record<AvatarSize, string> = {
  sm: "size-8",
  md: "size-16",
  lg: "size-24",
} as const;

const Avatar = ({ className, size = "md", ...props }: AvatarProps) => {
  return (
    <AvatarContext.Provider value={size}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          "bg-orange-50/10 outline outline-orange-150",
          avatarSizeClassNames[size],
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
};

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};

const avatarFallbackFontSizeClassNames: Record<AvatarSize, string> = {
  sm: "text-base",
  md: "text-5xl",
  lg: "text-7xl",
} as const;

const AvatarFallback = ({
  className,
  delayMs = AVATAR_FALLBACK_DELAY_MS,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  const size = useContext(AvatarContext);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      delayMs={delayMs}
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        "font-bold text-orange-50 uppercase",
        avatarFallbackFontSizeClassNames[size],
        className,
      )}
      {...props}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
