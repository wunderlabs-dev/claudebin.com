import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconDot = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <circle cx="8" cy="8" r="2" />
    </SvgIcon>
  );
};

export { SvgIconDot };
