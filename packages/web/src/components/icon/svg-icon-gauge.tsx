import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconGauge = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M7.7,13.9c-3.2,0-5.9-2.6-5.9-5.9s2.6-5.9,5.9-5.9s5.9,2.6,5.9,5.9S11,13.9,7.7,13.9z M6.7,12 c0.6,0.2,1.4,0.2,2,0H6.7z M4.3,10.2h6.9c0.2-0.2,0.3-0.5,0.4-0.8H3.9C4,9.8,4.1,10,4.3,10.2z M3.6,7.7h8.2 c-0.1-2.2-1.9-3.9-4.1-3.9S3.8,5.6,3.6,7.7z" />
    </SvgIcon>
  );
};

export { SvgIconGauge };
