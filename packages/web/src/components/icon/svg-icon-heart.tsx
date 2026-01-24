import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconHeart = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path d="M8 13.5C8 13.5 2 10 2 5.5C2 3.5 3.5 2 5.5 2C6.8 2 7.9 2.7 8 3.5C8.1 2.7 9.2 2 10.5 2C12.5 2 14 3.5 14 5.5C14 10 8 13.5 8 13.5Z" />
    </SvgIcon>
  );
};

export { SvgIconHeart };
