import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconClock = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M8,14.5c-3.6,0-6.5-2.9-6.5-6.5c0-3.6,2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5C14.5,11.6,11.6,14.5,8,14.5z M8,2.5C5,2.5,2.5,5,2.5,8S5,13.5,8,13.5c3,0,5.5-2.5,5.5-5.5S11,2.5,8,2.5z M8,7.6c-0.3,0-0.5-0.2-0.5-0.5V3.7c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v3.4C8.5,7.4,8.3,7.6,8,7.6z" />
    </SvgIcon>
  );
};

export { SvgIconClock };
