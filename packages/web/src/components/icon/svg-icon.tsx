import type { ReactNode, HTMLAttributes } from "react";

import { cn } from "@/utils/helpers";

const SvgIconSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const SvgIconColors = ["default", "neutral", "primary"] as const;

type SvgIconSize = (typeof SvgIconSizes)[number];
type SvgIconColor = (typeof SvgIconColors)[number];

type SvgIconProps = {
  children: ReactNode;
  size?: SvgIconSize;
  color?: SvgIconColor;
  viewBox?: string;
  className?: HTMLAttributes<SVGSVGElement>["className"];
} & HTMLAttributes<SVGSVGElement>;

const svgIconSizeClassNames: Record<SvgIconSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

const svgIconColorClassNames: Record<SvgIconColor, string> = {
  default: "text-current",
  neutral: "text-gray-350",
  primary: "text-orange-50",
} as const;

const SvgIcon = ({
  children,
  className,
  size = "md",
  color = "default",
  viewBox = "0 0 16 16",
  ...props
}: SvgIconProps) => {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="currentColor"
      className={cn(svgIconSizeClassNames[size], svgIconColorClassNames[color], className)}
      {...props}
    >
      {children}
    </svg>
  );
};

export {
  SvgIcon,
  SvgIconSizes,
  SvgIconColors,
  type SvgIconSize,
  type SvgIconColor,
  type SvgIconProps,
};
