import { SvgIcon, type SvgIconProps } from "@/components/icon/svg-icon";

const SvgIconClaudebinXs = (props: Omit<SvgIconProps, "children" | "viewBox">) => {
  return (
    <SvgIcon viewBox="0 0 60 23" {...props}>
      <path d="M53.2,8.7h-3.7V6.1c0-4-2.2-6.1-6.1-6.1H29.7h-0.1H6.1C2.2,0,0,2.2,0,6.1v10.1c0,4,2.2,6.1,6.1,6.1h23.5h0.1 c0.1,0,23.5,0,23.5,0c4,0,6.1-2.2,6.1-6.1v-1.4C59.3,10.8,57.2,8.7,53.2,8.7z M51.9,17.4H29.7h-0.1H7.4c-1.6,0-1.8-0.2-1.8-1.8V6.9 C5.6,5.3,5.8,5,7.4,5h22.2h0.1h12.4c1.6,0,1.8,0.2,1.8,1.8v1.8h-14v5h22c1.6,0,1.8,0.3,1.8,1.8C53.7,17.1,53.5,17.4,51.9,17.4z" />
    </SvgIcon>
  );
};

export { SvgIconClaudebinXs };
