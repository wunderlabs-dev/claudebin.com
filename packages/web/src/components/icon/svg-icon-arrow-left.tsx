import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconArrowLeft = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M10,13.5c-0.1,0-0.3,0-0.4-0.1l-5-5c-0.2-0.2-0.2-0.5,0-0.7l5-5c0.2-0.2,0.5-0.2,0.7,0s0.2,0.5,0,0.7L5.7,8l4.6,4.6c0.2,0.2,0.2,0.5,0,0.7C10.3,13.5,10.1,13.5,10,13.5z" />
    </SvgIcon>
  );
};

export { SvgIconArrowLeft };
