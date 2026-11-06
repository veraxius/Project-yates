import Image from "next/image";
import Link from "next/link";
import { footerColumns } from "../lib/site";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Image
            src="/YB University LOGO HORIZONTAL MONOCHROME-03.png"
            alt="YB University"
            width={180}
            height={42}
            className="h-auto w-44"
          />
          <p className="h-display mt-8 max-w-xs text-2xl text-white/80">
            Discover a World. Make It Yours.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow !text-sand">{col.title}</h2>
              <ul className="mt-3 lg:mt-5 lg:space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-3 text-sm text-white/70 transition-colors hover:text-white lg:inline lg:py-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© YB University. All rights reserved.</p>
          <p>Connected to Palm Beach Yachts.</p>
        </div>
      </div>
    </footer>
  );
}
