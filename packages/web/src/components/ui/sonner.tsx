"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import { SvgIconCheck, SvgIconSkull } from "@/components/icon";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <SvgIconCheck size="sm" />,
        error: <SvgIconSkull size="sm" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-white)",
          "--normal-text": "var(--color-gray-800)",
          "--normal-border": "var(--color-gray-250)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
