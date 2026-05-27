type TrackingPixelProps = {
  type: "t" | "p";
  id: string;
};

export const TrackingPixel = ({ type, id }: TrackingPixelProps) => {
  return (
    <img
      aria-hidden="true"
      src={`/api/pixel/${type}/${id}`}
      className="invisible absolute size-0"
    />
  );
};
