import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconCircle = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </SvgIcon>
  );
};

export { SvgIconCircle };
