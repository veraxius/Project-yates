import Image from "next/image";
import Link from "next/link";
import { ecosystem, footerColumns, socialLinks } from "../lib/site";

function SocialIcon({ id }: { id: (typeof socialLinks)[number]["id"] }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true } as const;
  switch (id) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" strokeLinejoin="round" />
        </svg>
      );
    case "x":
      return (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 10v7M8 7v.01M12 17v-7m0 3a3 3 0 0 1 6 0v4" strokeLinecap="round" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1fr_2.6fr]">
        <div>
          <Image
            src="/yb-university-logo-horizontal-white.png"
            alt="YB University"
            width={180}
            height={42}
            className="h-auto w-44"
          />
          <p className="h-display mt-8 max-w-xs text-2xl text-white/80">
            Discover a World. Make It Yours.
          </p>
          {/* Q&As: kept in the footer for now, but as a clear button so it is easy to spot. */}
          <Link
            href="/faq"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-sand px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-navy-950 transition-colors hover:bg-white"
          >
            Have questions? Click here
          </Link>
          {socialLinks.some((s) => s.href) && (
            <ul aria-label="Social media" className="mt-8 flex gap-3">
              {socialLinks
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`YB University on ${s.label}`}
                      className="flex h-11 w-11 items-center justify-center border border-white/25 text-white/80 transition-colors hover:border-sand hover:text-sand"
                    >
                      <SocialIcon id={s.id} />
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow !text-sand">{col.title}</h2>
              <ul className="mt-3 lg:mt-5 lg:space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      // External address (the LearnWorlds course): a plain link that opens in the same tab.
                      <a
                        href={link.href}
                        className="inline-block py-3 text-sm text-white/70 transition-colors hover:text-white lg:inline lg:py-0"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-block py-3 text-sm text-white/70 transition-colors hover:text-white lg:inline lg:py-0"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-10">
          <h2 className="eyebrow !text-sand">THE PALM BEACH YACHTS ECOSYSTEM</h2>
          <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6">
            {ecosystem.map((item) => {
              const mark = item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={item.logoWidth ?? 160}
                  height={item.logoHeight ?? 40}
                  className="h-auto w-36 opacity-90"
                />
              ) : (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{item.name}</span>
              );
              const cls = "inline-flex min-h-11 items-center transition-opacity hover:opacity-100";
              if (!item.href) return <li key={item.name} className={cls}>{mark}</li>;
              return (
                <li key={item.name}>
                  {item.href.startsWith("http") ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {mark}
                    </a>
                  ) : (
                    <Link href={item.href} className={cls}>
                      {mark}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© YB University. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:text-sand"
            >
              FAQ
            </Link>
            <p>Connected to Palm Beach Yachts.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
