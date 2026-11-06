import { Photo } from "./Photo";
import { RevealWords } from "./RevealWords";

type Props = {
  label?: string;
  name: string;
  title: string;
  variant?: 1 | 2 | 3 | 4 | 5;
  src?: string;
  alt?: string;
  objectPosition?: string;
  children?: React.ReactNode;
};

const at = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function PageHero({
  label,
  name,
  title,
  variant = 1,
  src,
  alt,
  objectPosition,
  children,
}: Props) {
  return (
    <section className="relative isolate flex min-h-[62svh] items-end text-white">
      <Photo
        variant={variant}
        src={src}
        alt={alt}
        quality={src ? 90 : undefined}
        priority={Boolean(src)}
        objectPosition={objectPosition}
        settle
        className="absolute inset-0 -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
      {src && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/70 via-navy-950/30 to-transparent to-75%" />
      )}
      <div className="container-x pb-16 pt-32 lg:pb-24">
        <div className="flex items-center gap-4">
          {label && (
            <p className="eyebrow rise !text-sand" style={at(400)}>
              {label}
            </p>
          )}
          <span aria-hidden className="line-draw block h-px w-14 bg-sand" />
        </div>
        <p
          className="rise mt-4 text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-white/70"
          style={at(500)}
        >
          {name}
        </p>
        <h1 className="h-display mt-5 max-w-5xl text-[clamp(2.6rem,6.5vw,5.5rem)]">
          <RevealWords text={title} />
        </h1>
        {children && (
          <div className="rise mt-8 max-w-2xl" style={at(1300)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
