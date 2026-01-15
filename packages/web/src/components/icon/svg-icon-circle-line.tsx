import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconCircleLine = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line
        x1="5"
        y1="8"
        x2="11"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
};

export { SvgIconCircleLine };
