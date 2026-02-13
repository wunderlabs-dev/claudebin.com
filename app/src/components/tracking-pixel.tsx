// ABOUTME: Renders a 1x1 invisible tracking pixel that hits the view counting API route
const TrackingPixelTypes = ["t", "p"] as const;
type TrackingPixelType = (typeof TrackingPixelTypes)[number];

type TrackingPixelProps = {
  type: TrackingPixelType;
  id: string;
};

export const TrackingPixel = ({ type, id }: TrackingPixelProps) => {
  return (
    // biome-ignore lint/performance/noImgElement: tracking pixel must bypass next/image optimization
    <img
      src={`/api/pixel/${type}/${id}`}
      alt=""
      width={1}
      height={1}
      className="invisible absolute"
      aria-hidden="true"
    />
  );
};
