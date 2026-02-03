import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconCheck = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M7.4,13.8c-0.3,0-0.5-0.1-0.7-0.3L2.2,8C1.9,7.6,2,7.1,2.4,6.8c0.4-0.3,0.9-0.2,1.2,0.1l3.6,4.5l4.9-8.9 c0.2-0.4,0.8-0.6,1.2-0.3c0.4,0.2,0.6,0.8,0.3,1.2l-5.6,10C8,13.6,7.7,13.8,7.4,13.8C7.4,13.8,7.4,13.8,7.4,13.8z" />
    </SvgIcon>
  );
};

export { SvgIconCheck };
