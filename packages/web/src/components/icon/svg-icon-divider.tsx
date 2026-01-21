import { cn } from "@/utils/helpers";

const SvgIconDividerVariants = ["left", "right", "top", "bottom"] as const;
type SvgIconDividerVariant = (typeof SvgIconDividerVariants)[number];

type SvgIconDividerProps = {
  variant?: SvgIconDividerVariant;
  className?: string;
};

const variantClassNames: Record<SvgIconDividerVariant, string> = {
  left: "w-16 h-px bg-gradient-to-l from-gray-250 to-transparent",
  right: "w-16 h-px bg-gradient-to-r from-gray-250 to-transparent",
  top: "h-16 w-px bg-gradient-to-t from-gray-250 to-transparent",
  bottom: "h-16 w-px bg-gradient-to-b from-gray-250 to-transparent",
};

const SvgIconDivider = ({ variant = "left", className }: SvgIconDividerProps) => {
  return <div className={cn(variantClassNames[variant], className)} />;
};

export { SvgIconDivider, SvgIconDividerVariants, type SvgIconDividerVariant };
