import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconFileSearch = (props: Omit<SvgIconProps, "children">) => {
  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5,0.7C5.6,0.6,5.8,0.5,6,0.5h5.5c1.1,0,2,0.9,2,2v2.7c0,0.4-0.3,0.7-0.7,0.7s-0.7-0.3-0.7-0.7V2.5c0-0.4-0.3-0.7-0.7-0.7H6.6v3.4C6.6,5.6,6.3,6,6,6H2.5v7.5c0,0.4,0.3,0.7,0.7,0.7H6c0.4,0,0.7,0.3,0.7,0.7S6.3,15.5,6,15.5H3.2c-1.1,0-2-0.9-2-2V5.3c0-0.2,0.1-0.4,0.2-0.5L5.5,0.7z M3.5,4.6h1.8V2.8L3.5,4.6z M12.9,12.6c0.4-0.5,0.6-1.2,0.6-1.9c0-1.9-1.5-3.4-3.4-3.4s-3.4,1.5-3.4,3.4s1.5,3.4,3.4,3.4c0.7,0,1.3-0.2,1.9-0.6l1.7,1.7c0.3,0.3,0.7,0.3,1,0c0.3-0.3,0.3-0.7,0-1L12.9,12.6z M8,10.7c0-1.1,0.9-2,2-2s2,0.9,2,2s-0.9,2-2,2S8,11.9,8,10.7z"
      />
    </SvgIcon>
  );
};

export { SvgIconFileSearch };
