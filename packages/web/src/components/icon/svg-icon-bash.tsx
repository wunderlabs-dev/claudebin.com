import { SvgIcon, type SvgIconProps } from "./svg-icon";

const SvgIconBash = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M14.3,14.2H7.7c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h6.7c0.3,0,0.5,0.2,0.5,0.5S14.6,14.2,14.3,14.2z M2,12.5c-0.1,0-0.3,0-0.4-0.1c-0.2-0.2-0.2-0.5,0-0.7L6.3,7L1.6,2.4c-0.2-0.2-0.2-0.5,0-0.7s0.5-0.2,0.7,0l5,5c0.2,0.2,0.2,0.5,0,0.7l-5,5C2.3,12.5,2.1,12.5,2,12.5z" />
    </SvgIcon>
  );
};

export { SvgIconBash };
