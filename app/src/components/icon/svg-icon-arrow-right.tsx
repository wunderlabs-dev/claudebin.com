import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconArrowRight = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M6,13.5c-0.1,0-0.3,0-0.4-0.1c-0.2-0.2-0.2-0.5,0-0.7L10.3,8L5.6,3.4c-0.2-0.2-0.2-0.5,0-0.7s0.5-0.2,0.7,0l5,5c0.2,0.2,0.2,0.5,0,0.7l-5,5C6.3,13.5,6.1,13.5,6,13.5z" />
    </SvgIcon>
  );
};

export { SvgIconArrowRight };
