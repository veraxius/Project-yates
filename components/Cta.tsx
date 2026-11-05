import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "light" | "outline" | "outline-light";
  className?: string;
};

const variants = {
  solid:
    "bg-navy-900 text-white border-navy-900 hover:bg-navy-700 hover:border-navy-700",
  light:
    "bg-white text-navy-900 border-white hover:bg-ivory hover:border-ivory",
  outline:
    "bg-transparent text-navy-900 border-navy-900/40 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  "outline-light":
    "bg-transparent text-white border-white/50 hover:border-white hover:bg-white hover:text-navy-900",
};

export function Cta({ href, children, variant = "solid", className = "" }: Props) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-3 border px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-[color,background-color,border-color,transform] duration-300 motion-safe:hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {children}
      <svg
        aria-hidden
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </Link>
  );
}
