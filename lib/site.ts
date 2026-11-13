export const nav = [
  // "The Experience" (/#experience) was removed from the menu: it sat next to
  // "YB EXPERIENCE" and read like the same tab twice. The home page's hero buttons
  // still scroll to that section.
  { label: "YB LEARN", href: "/learn", note: "Broker Certification Experience" },
  { label: "YB EXPERIENCE", href: "/yb-experience", note: "Events & Experiences" },
  { label: "YB NETWORK", href: "/network", note: "Community & Relationships" },
  { label: "YB OPPORTUNITIES", href: "/opportunities", note: "Talent & Business Pipeline" },
  { label: "About YB", href: "/about", note: "Our approach and industry" },
];

// The course lives on LearnWorlds, which owns the accounts, passwords and
// sessions. Members who are already signed in there go straight to their
// course; everyone else sees LearnWorlds' own sign-in. This is a public
// address, not a secret. (The /login page remains as a fallback.)
export const SCHOOL_URL = "https://ybuniversity.learnworlds.com";
// The course page on LearnWorlds: members go in, everyone else sees the course
// with its buy button. Every "Enroll" and "Log In" button on this site goes here.
export const COURSE_URL = `${SCHOOL_URL}/course/the-modern-yacht-broker`;
export const LOGIN_HREF = COURSE_URL;
export const ENROLL_HREF = COURSE_URL;

// Social accounts shown as icons in the footer. An icon appears only once its
// address is filled in, so the footer never shows a dead link.
// TODO(link): the client still has to send the account addresses.
export const socialLinks: { id: "instagram" | "facebook" | "x" | "linkedin" | "youtube" | "tiktok"; label: string; href: string }[] = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/palm_beach_yachts/" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/yachtbrokeruniversity/" },
  { id: "x", label: "X", href: "https://x.com/PBYachtSales" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/yacht-broker-university" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@mYBUniversity" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@yachtbrokeruniversity" },
];

// The parts of the Palm Beach Yachts ecosystem, shown in the footer. Until a logo
// file is added (`logo`: a path in /public, white on transparent) the name is shown
// as text, and it becomes a link once `href` is filled in.
// TODO(link): the client still has to send the logo files and the addresses.
export const ecosystem: { name: string; href?: string; logo?: string; logoWidth?: number; logoHeight?: number }[] = [
  { name: "YB University", href: "/", logo: "/yb-university-logo-horizontal-white.png", logoWidth: 160, logoHeight: 38 },
  { name: "Peanut Island Boat Club" },
  { name: "Palm Beach Yachts" },
];

export const footerColumns = [
  {
    title: "EXPLORE",
    links: [
      { label: "The Experience", href: "/#experience" },
      { label: "YB Learn", href: "/learn" },
      { label: "YB Experience", href: "/yb-experience" },
      { label: "YB Network", href: "/network" },
      { label: "YB Opportunities", href: "/opportunities" },
    ],
  },
  {
    // The campaign landing pages (lib/landing-paths.ts). They are written for ads,
    // QR codes and referrals, and this column is the only place on the site that
    // links to them. They are not in the main menu on purpose.
    title: "FIND YOUR PATH",
    links: [
      { label: "Discover a New Career", href: "/discover" },
      { label: "Reinvent Your Career", href: "/reinvent" },
      { label: "For Entrepreneurs", href: "/entrepreneurs" },
      { label: "Creators Collective", href: "/creators" },
      { label: "Campus Experience", href: "/campus" },
      { label: "Free Discovery Pass", href: "/discovery-pass" },
    ],
  },
  {
    title: "ABOUT",
    links: [
      { label: "About YB University", href: "/about" },
      // TODO(link): point this at the Palm Beach Yachts website once the client confirms the URL.
      { label: "Palm Beach Yachts", href: "/about" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "STUDENT ACCESS",
    links: [
      { label: "Log In", href: LOGIN_HREF },
      { label: "My Learning", href: LOGIN_HREF },
      { label: "Student Network", href: LOGIN_HREF },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Educational Credential Disclaimer", href: "/credential-disclaimer" },
    ],
  },
];
