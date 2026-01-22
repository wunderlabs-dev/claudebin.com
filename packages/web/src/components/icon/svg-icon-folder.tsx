import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconFolder = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M12,13.5H4c-1.7,0-3-1.3-3-3V7.3c0-0.1,0-0.2,0-0.2l0,0c0,0,0-0.1,0-0.2V5.5c0-1.7,1.3-3,3-3h3c1.2,0,2.3,0.7,2.7,1.8H12c1.7,0,3,1.3,3,3v3.2C15,12.2,13.7,13.5,12,13.5z M4,3.5c-1.1,0-2,0.9-2,2v1.4C2,7,2,7,2,7.1c0,0.1,0,0.2,0,0.2v3.2c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7.3c0-1.1-0.9-2-2-2H9.4C9.2,5.3,9,5.2,8.9,4.9C8.7,4.1,7.9,3.5,7,3.5H4z" />
    </SvgIcon>
  );
};

export { SvgIconFolder };
