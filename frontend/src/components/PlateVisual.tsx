interface Props {
  blobs: [string, string, string, string];
  size?: number;
  className?: string;
}

export default function PlateVisual({ blobs, size = 150, className = "" }: Props) {
  const vars = {
    ["--b1" as string]: blobs[0],
    ["--b2" as string]: blobs[1],
    ["--b3" as string]: blobs[2],
    ["--b4" as string]: blobs[3],
  };

  return (
    <div
      className={`plate relative rounded-full bg-white flex-shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, ...vars }}
    >
      <div className="blob" />
      <div className="blob" />
      <div className="blob" />
      <div className="blob" />
    </div>
  );
}