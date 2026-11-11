import PlateVisual from "./PlateVisual";

type Blobs = [string, string, string, string];

// Shows a photo when there is one, otherwise the drawn plate.
//   shape="circle": a round image `size` pixels wide (lists, search, cart)
//   shape="tile":   fills its container's width as a rounded square (cards)
export default function FoodImage({
  src,
  alt,
  blobs,
  shape,
  size = 150,
  className = "",
}: {
  src?: string;
  alt: string;
  blobs: Blobs;
  shape: "circle" | "tile";
  size?: number;
  className?: string;
}) {
  if (shape === "circle") {
    return src ? (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 shadow-[0_6px_14px_rgba(27,42,32,0.14)] ${className}`}
        style={{ width: size, height: size }}
      />
    ) : (
      <PlateVisual blobs={blobs} size={size} className={className} />
    );
  }

  return (
    <div className={`w-full aspect-square rounded-[22px] overflow-hidden bg-cream-deep ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <PlateVisual blobs={blobs} size={Math.round(size * 0.8)} />
        </div>
      )}
    </div>
  );
}