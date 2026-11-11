"use client";

import { usePathname } from "next/navigation";
import { isLandingPath } from "../lib/landing-paths";

// Decides what surrounds a page.
//
// Normal pages get the site header, a <main> and the site footer. Campaign
// landing pages (lib/landing-paths.ts) get nothing from here: they bring their
// own minimal header and footer, so a visitor from an ad is not handed the
// whole site navigation and a second set of buttons. For the same reason the
// chat button (`chat`) only appears on the normal pages.
export function SiteChrome({
  header,
  footer,
  chat,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  chat?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (isLandingPath(pathname)) return <>{children}</>;
  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {chat}
    </>
  );
}
