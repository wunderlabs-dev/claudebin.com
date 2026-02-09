import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconMagnifier = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M11.2,12c-1.2,1-2.7,1.6-4.4,1.6C3,13.6,0,10.6,0,6.8S3,0,6.8,0c3.8,0,6.8,3,6.8,6.8c0,1.7-0.6,3.2-1.6,4.4l3.8,3.8c0.1,0.1,0.2,0.3,0.2,0.4c0,0.5-0.4,0.6-0.6,0.6c-0.2,0-0.3-0.1-0.4-0.2L11.2,12z M6.8,1.2c-3.1,0-5.6,2.5-5.6,5.6s2.5,5.6,5.6,5.6c3.1,0,5.6-2.5,5.6-5.6S9.9,1.2,6.8,1.2z" />
    </SvgIcon>
  );
};

export { SvgIconMagnifier };
