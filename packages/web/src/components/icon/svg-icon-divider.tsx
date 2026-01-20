import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconDividerVariants = ["left", "right", "top", "bottom"] as const;
type SvgIconDividerVariant = (typeof SvgIconDividerVariants)[number];

type SvgIconDividerProps = {
  variant?: SvgIconDividerVariant;
} & Omit<SvgIconProps, "children" | "viewBox">;


const paths: Record<SvgIconDividerVariant, JSX.Element> = {
  left: (
    <path d="M64 1C64 0.666667 64 0.333333 64 0C62.9333 0.00833324 61.8667 0.0166665 60.8 0.0249997C41.6 0.174998 22.4 0.324996 3.2 0.474995C2.13334 0.483328 1.06666 0.491661 0 0.499994C1.06666 0.508328 2.13334 0.516661 3.2 0.524995C22.4 0.674996 41.6 0.824998 60.8 0.975C61.8667 0.983333 62.9333 0.991667 64 1Z" />
  ),
  right: (
    <path d="M0 0C0 0.333333 0 0.666667 0 1C1.06667 0.991667 2.13333 0.983333 3.2 0.975C22.4 0.825002 41.6 0.675004 60.8 0.525005C61.8667 0.516672 62.9333 0.508339 64 0.500006C62.9333 0.491672 61.8667 0.483339 60.8 0.475005C41.6 0.325004 22.4 0.175002 3.2 0.025C2.13333 0.0166667 1.06667 0.00833333 0 0Z" />
  ),
  top: (
    <path d="M1 64C0.666667 64 0.333333 64 0 64C0.00833324 62.9333 0.0166665 61.8667 0.0249997 60.8C0.174998 41.6 0.324996 22.4 0.474995 3.2C0.483328 2.13334 0.491661 1.06666 0.499994 0C0.508328 1.06666 0.516661 2.13334 0.524995 3.2C0.674996 22.4 0.824998 41.6 0.975 60.8C0.983333 61.8667 0.991667 62.9333 1 64Z" />
  ),
  bottom: (
    <path d="M0 0C0.333333 0 0.666667 0 1 0C0.991667 1.06667 0.983333 2.13333 0.975 3.2C0.825002 22.4 0.675004 41.6 0.525005 60.8C0.516672 61.8667 0.508339 62.9333 0.500006 64C0.491672 62.9333 0.483339 61.8667 0.475005 60.8C0.325004 41.6 0.175002 22.4 0.025 3.2C0.0166667 2.13333 0.00833333 1.06667 0 0Z" />
  ),
};

const SvgIconDivider = ({ variant = "left", ...props }: SvgIconDividerProps) => {
  return (
    <SvgIcon viewBox={variant === "left" || variant === "right" ? "0 0 64 1" : "0 0 1 64"} size="auto" className="text-gray-250 h-px" {...props}>
      {paths[variant]}
    </SvgIcon>
  );
};

export { SvgIconDivider, SvgIconDividerVariants, type SvgIconDividerVariant };
