import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconBin = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M12.5,14.5h-9C3.2,14.5,3,14.3,3,14V4.5h10V14C13,14.3,12.8,14.5,12.5,14.5z M4,13.5h8V5.5H4V13.5z" />
      <path d="M6.5,12c-0.3,0-0.5-0.2-0.5-0.5v-4C6,7.2,6.2,7,6.5,7S7,7.2,7,7.5v4C7,11.8,6.8,12,6.5,12z" />
      <path d="M9.5,12C9.2,12,9,11.8,9,11.5v-4C9,7.2,9.2,7,9.5,7S10,7.2,10,7.5v4C10,11.8,9.8,12,9.5,12z" />
      <path d="M14,4.5H2C1.7,4.5,1.5,4.3,1.5,4S1.7,3.5,2,3.5h12c0.3,0,0.5,0.2,0.5,0.5S14.3,4.5,14,4.5z" />
      <path d="M10,4H6V2.5C6,2.2,6.2,2,6.5,2h3C9.8,2,10,2.2,10,2.5V4z M7,3h2V3H7z" />
    </SvgIcon>
  );
};

export { SvgIconBin };
