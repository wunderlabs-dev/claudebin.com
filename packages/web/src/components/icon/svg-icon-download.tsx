import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconDownload = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M8,1C8.6,1,9,1.4,9,2v7.6l2.3-2.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-4,4c-0.4,0.4-1,0.4-1.4,0l-4-4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0L7,9.6V2C7,1.4,7.4,1,8,1z M2,11c0.6,0,1,0.4,1,1v1h10v-1c0-0.6,0.4-1,1-1s1,0.4,1,1v2c0,0.6-0.4,1-1,1H2c-0.6,0-1-0.4-1-1v-2C1,11.4,1.4,11,2,11z" />
    </SvgIcon>
  );
};

export { SvgIconDownload };
