type TrackingPixelProps = {
  type: "t" | "p";
  id: string;
};

export const TrackingPixel = ({ type, id }: TrackingPixelProps) => {
  return (
    // biome-ignore lint/performance/noImgElement: tracking pixel must bypass next/image optimization
    <img
      alt=""
      aria-hidden="true"
      src={`/api/pixel/${type}/${id}`}
      className="invisible absolute size-0"
    />
  );
};
