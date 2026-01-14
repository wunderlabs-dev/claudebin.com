import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconLine = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M3,14.5c-0.3,0-0.5-0.2-0.5-0.5V3c0-0.3,0.2-0.5,0.5-0.5S3.5,2.7,3.5,3v11C3.5,14.3,3.3,14.5,3,14.5z M10.5,12h-5C5.2,12,5,11.8,5,11.5S5.2,11,5.5,11h5c0.3,0,0.5,0.2,0.5,0.5S10.8,12,10.5,12z M13,9H5.5C5.2,9,5,8.8,5,8.5S5.2,8,5.5,8H13c0.3,0,0.5,0.2,0.5,0.5S13.3,9,13,9z M13,6H5.5C5.2,6,5,5.8,5,5.5S5.2,5,5.5,5H13c0.3,0,0.5,0.2,0.5,0.5S13.3,6,13,6z" />
    </SvgIcon>
  );
};

export { SvgIconLine };
