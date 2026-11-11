export const nav = [
  { label: "The Experience", href: "/#experience", note: "Overview of the four components" },
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
