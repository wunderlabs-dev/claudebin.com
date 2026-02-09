import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconCircleLine = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M7.9,13.8C4.7,13.8,2,11.1,2,7.9S4.7,2,7.9,2s5.9,2.6,5.9,5.9S11.2,13.8,7.9,13.8z M7.9,3.8 c-2.3,0-4.1,1.9-4.1,4.1S5.6,12,7.9,12S12,10.2,12,7.9S10.2,3.8,7.9,3.8z" />
    </SvgIcon>
  );
};

export { SvgIconCircleLine };
