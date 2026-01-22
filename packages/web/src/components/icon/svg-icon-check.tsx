import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconCheck = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M7.6,12.5c-0.2,0-0.3-0.1-0.4-0.2L3.6,7.9C3.4,7.7,3.5,7.4,3.7,7.2C3.9,7,4.2,7.1,4.4,7.3l3.1,3.8l4.1-7.4c0.1-0.2,0.4-0.3,0.7-0.2c0.2,0.1,0.3,0.4,0.2,0.7l-4.4,8C7.9,12.4,7.8,12.5,7.6,12.5C7.6,12.5,7.6,12.5,7.6,12.5z" />
    </SvgIcon>
  );
};

export { SvgIconCheck };
