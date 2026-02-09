"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import { SvgIconCheck } from "@/components/icon/svg-icon-check";
import { SvgIconSkull } from "@/components/icon/svg-icon-skull";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <SvgIconCheck size="sm" color="accent" />,
        error: <SvgIconSkull size="sm" color="accent" />,
      }}
      toastOptions={{
        classNames: {
          title: "text-sm font-sans font-normal leading-6",
        },
      }}
      style={
        {
          "--normal-text": "var(--color-white)",
          "--normal-bg": "var(--color-gray-100)",
          "--normal-border": "var(--color-gray-250)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
