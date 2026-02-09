import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconArrowTop = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M13,10c-0.1,0-0.3,0-0.4-0.1L8,5.2L3.4,9.9C3.2,10,2.8,10,2.6,9.9s-0.2-0.5,0-0.7l5-5C7.8,4,8.2,4,8.4,4.1l5,5c0.2,0.2,0.2,0.5,0,0.7C13.3,10,13.1,10,13,10z" />
    </SvgIcon>
  );
};

export { SvgIconArrowTop };
