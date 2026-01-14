import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconCalendar = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M12,14H4c-1.4,0-2.5-1.1-2.5-2.5v-6C1.5,4.1,2.6,3,4,3h1V2c0-0.3,0.2-0.5,0.5-0.5S6,1.7,6,2v1h4V2c0-0.3,0.2-0.5,0.5-0.5S11,1.7,11,2v1h1c1.4,0,2.5,1.1,2.5,2.5v6C14.5,12.9,13.4,14,12,14z M4,4C3.2,4,2.5,4.7,2.5,5.5v6C2.5,12.3,3.2,13,4,13h8c0.8,0,1.5-0.7,1.5-1.5v-6C13.5,4.7,12.8,4,12,4h-1v1c0,0.3-0.2,0.5-0.5,0.5S10,5.3,10,5V4H6v1c0,0.3-0.2,0.5-0.5,0.5S5,5.3,5,5V4H4z" />
    </SvgIcon>
  );
};

export { SvgIconCalendar };
