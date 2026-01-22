import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconArrowBottom = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M8,12c-0.1,0-0.3-0.1-0.4-0.1l-5-5c-0.2-0.2-0.2-0.5,0-0.7s0.5-0.2,0.7,0L8,10.8l4.6-4.6c0.2-0.2,0.5-0.2,0.7,0s0.2,0.5,0,0.7l-5,5C8.3,11.9,8.1,12,8,12z" />
    </SvgIcon>
  );
};

export { SvgIconArrowBottom };
