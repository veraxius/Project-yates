import Image from "next/image";

type Props = {
  src?: string;
  alt?: string;
  variant?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  priority?: boolean;
  quality?: 75 | 90;
  sizes?: string;
  objectPosition?: string;
  settle?: boolean;
  children?: React.ReactNode;
};

const gradients = {
  1: "linear-gradient(160deg, #123f75 0%, #0a2748 50%, #031f3c 100%)",
  2: "linear-gradient(200deg, #0c2d57 0%, #031f3c 55%, #031f3c 100%)",
  3: "linear-gradient(130deg, #1a4f8a 0%, #0c2d57 45%, #031f3c 100%)",
  4: "linear-gradient(220deg, #0f3562 0%, #031f3c 60%, #031f3c 100%)",
  5: "linear-gradient(170deg, #1b4a7d 0%, #0b2850 50%, #031f3c 100%)",
};

// Stand-in for photography until real images are dropped in via `src`.
export function Photo({
  src,
  alt = "",
  variant = 1,
  className = "",
  priority,
  quality,
  sizes = "100vw",
  objectPosition,
  settle,
  children,
}: Props) {
  return (
    <div
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden bg-navy-900 ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          style={{ objectPosition }}
          className={`object-cover ${settle ? "hero-settle" : ""}`}
        />
      ) : (
        <div aria-hidden className={`absolute inset-0 ${settle ? "hero-settle" : ""}`}>
          <div className="absolute inset-0" style={{ background: gradients[variant] }} />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 75% 25%, rgba(91,182,222,0.28), transparent 70%)",
            }}
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-3/5 w-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            fill="none"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M0 ${120 + i * 48} C 200 ${70 + i * 48}, 400 ${190 + i * 48}, 600 ${130 + i * 48} S 1000 ${60 + i * 48}, 1200 ${140 + i * 48}`}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      )}
      {children}
    </div>
  );
}
