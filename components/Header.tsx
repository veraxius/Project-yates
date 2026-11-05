"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ENROLL_HREF, nav } from "../lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Hide on scroll down, show on scroll up. Always visible near the top.
  useEffect(() => {
    const TOP_ZONE = 80;
    const THRESHOLD = 6;
    let lastY = window.scrollY;

    // Scroll events already fire at most once per frame, so no rAF is needed.
    const onScroll = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;

      if (y < TOP_ZONE) {
        setHidden(false);
        lastY = y;
        return;
      }
      if (Math.abs(delta) <= THRESHOLD) return;

      if (delta > 0) {
        // Keep the bar while a link or button inside it has keyboard focus.
        if (!headerRef.current?.contains(document.activeElement)) setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The brief asks for the primary CTA to switch on the course page.
  const onCourse = pathname.startsWith("/learn");
  const ctaLabel = onCourse ? "ENROLL NOW" : "EXPLORE THE EXPERIENCE";
  const ctaHref = onCourse ? ENROLL_HREF : "/#experience";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b border-white/10 bg-navy-950 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] motion-reduce:duration-0 ${
        hidden && !open
          ? "pointer-events-none opacity-0 [transform:translate3d(0,-100%,0)]"
          : "opacity-100 [transform:translate3d(0,0,0)]"
      }`}
    >
      <div className="nav-fade container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="YB University, home" onClick={() => setOpen(false)}>
          <Image
            src="/YB University LOGO HORIZONTAL MONOCHROME-03.png"
            alt="YB University"
            width={160}
            height={38}
            priority
            className="h-auto w-[8.5rem] sm:w-40"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 whitespace-nowrap xl:flex">
          {nav.map((item) => {
            const active = item.href.startsWith("/#")
              ? false
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-white ${
                  active ? "text-white underline decoration-sand decoration-2 underline-offset-8" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={ctaHref}
            className="whitespace-nowrap bg-white px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-[color,background-color,transform] duration-300 hover:bg-ivory motion-safe:hover:-translate-y-0.5 sm:px-6 sm:text-[0.68rem]"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center xl:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-full bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t border-white/10 bg-navy-950 text-white xl:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 py-5"
              >
                <span className="h-display text-3xl">{item.label}</span>
                <span className="hidden text-right text-xs text-white/50 sm:block">{item.note}</span>
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 bg-white px-7 py-4 text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-900"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
