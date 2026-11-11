// Campaign landing pages (paid ads, creator referrals, campus QR codes).
//
// They are standalone: instead of the site header, navigation and footer they
// show a minimal header and footer of their own (see components/SiteChrome.tsx
// and components/landing/LandingShell.tsx). To add a page, add its path here,
// its content in lib/landings.ts and a folder in app/.
export const LANDING_PATHS = [
  "/discover",
  "/reinvent",
  "/entrepreneurs",
  "/creators",
  "/campus",
  "/discovery-pass",
] as const;

export function isLandingPath(pathname: string): boolean {
  return (LANDING_PATHS as readonly string[]).includes(pathname);
}
