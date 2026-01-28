import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconHeartSolid = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M4.8,1.9C3,1.9,1.2,3.1,1.2,5.4c0,2.5,2.9,5.2,6.3,8.5C7.7,14,7.8,14.1,8,14.1c0.2,0,0.3-0.1,0.5-0.2 c3.4-3.3,6.3-6,6.3-8.5c0-2.3-1.7-3.5-3.5-3.5C10,1.9,8.8,2.5,8,3.6C7.2,2.5,6,1.9,4.8,1.9z" />
    </SvgIcon>
  );
};

export { SvgIconHeartSolid };
