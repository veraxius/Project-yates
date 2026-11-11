import Image from "next/image";
import Link from "next/link";

// Header and footer of a campaign landing page.
//
// Deliberately minimal: the logo (the way back to the main site), one button
// that always leads to the form, and a short footer. The header stays in view
// while scrolling, so on a phone the main button is always reachable without
// covering any content.
export function LandingShell({
  cta,
  shortCta,
  children,
}: {
  /** Label of the header button. It jumps to the form (#join). */
  cta: string;
  /** Shorter label for narrow screens. */
  shortCta: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950">
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="YB University, main site"
            className="flex min-h-11 shrink-0 items-center"
          >
            <Image
              src="/yb-university-logo-horizontal-white.png"
              alt="YB University"
              width={160}
              height={38}
              priority
              className="h-auto w-[8.5rem] sm:w-40"
            />
          </Link>
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white md:inline"
            >
              YB University home
            </Link>
            <a
              href="#join"
              className="whitespace-nowrap bg-white px-4 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-colors duration-300 hover:bg-ivory sm:px-6"
            >
              <span className="sm:hidden">{shortCta}</span>
              <span className="hidden sm:inline">{cta}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy-950 text-white">
        <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <Image
              src="/yb-university-logo-horizontal-white.png"
              alt="YB University"
              width={160}
              height={38}
              className="h-auto w-36"
            />
            <p className="mt-4 text-xs text-white/50">
              © YB University. All rights reserved. Connected to Palm Beach Yachts.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
            {[
              { label: "YB University home", href: "/" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Credential Disclaimer", href: "/credential-disclaimer" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
