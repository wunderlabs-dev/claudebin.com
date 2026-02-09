import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconHome = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M10.4,12.5H5.6c-1.2,0-2.1-0.9-2.1-2V7.5l-1.2,1C2.1,8.7,1.8,8.7,1.6,8.5C1.4,8.3,1.5,7.9,1.7,7.8l6-5.1c0.2-0.2,0.5-0.2,0.7,0l6,5.1c0.2,0.2,0.2,0.5,0.1,0.7c-0.2,0.2-0.5,0.2-0.7,0.1l-1.2-1v2.9C12.5,11.6,11.6,12.5,10.4,12.5z M4.5,6.7v3.8c0,0.6,0.5,1,1.1,1h4.8c0.6,0,1.1-0.5,1.1-1V6.7L8,3.7L4.5,6.7z" />
    </SvgIcon>
  );
};

export { SvgIconHome };
