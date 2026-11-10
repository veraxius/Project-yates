import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy.
//
// Starts from "block everything, then allow only what the site really uses":
//  - scripts/styles/fonts/images/fetches come from this same origin only
//    (next/font self-hosts the Google fonts at build time, so no font CDN)
//  - no iframes, no plugins, the page cannot be framed, forms post to this site
//
// 'unsafe-inline' for scripts/styles is needed because Next.js writes small
// inline <script> tags (the React payload) into statically generated pages. The
// alternative (per-request nonces) forces every page to be rendered on each
// visit and would turn off static generation and caching, so it is not used.
// What keeps that acceptable: this site has no API routes, no forms and no
// accounts (enrollment, payment and sign-in all happen on LearnWorlds), so no
// visitor input is ever written into a page. If that changes (a contact form,
// a search box, anything that shows input back), revisit this policy.
//
// If you later add a third-party service, extend the matching directive:
//   Stripe.js / embedded checkout -> script-src, frame-src, connect-src https://js.stripe.com / https://api.stripe.com
//   LearnWorlds embed / n8n chat   -> frame-src / script-src for that host
//   Analytics (GA, Plausible...)   -> script-src and connect-src for that host
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // eval only for dev tooling
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`, // ws only for hot reload in dev
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HTTPS only, for 2 years, including subdomains.
  // TODO(domain): "preload" is a long-term commitment. Only submit the domain to
  // https://hstspreload.org once the FINAL custom domain (and all its subdomains)
  // serve HTTPS. Removing a domain from the preload list takes months.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Do not advertise the framework in an "X-Powered-By: Next.js" header.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Addresses of the on-site checkout that was removed when enrollment, payment
  // and accounts moved to LearnWorlds. They now lead to the course page, whose
  // "Enroll" buttons go to LearnWorlds. Temporary (307) on purpose, so browsers
  // do not remember them forever.
  async redirects() {
    return [
      { source: "/learn/enroll", destination: "/learn", permanent: false },
      { source: "/welcome", destination: "/learn", permanent: false },
    ];
  },

  images: {
    // No external image hosts are used anywhere in the site, so none are allowed.
    // The optimizer therefore cannot be pointed at a remote URL.
    remotePatterns: [],
    // Only the images that live in /public (flat folder, no query strings).
    localPatterns: [
      { pathname: "/*.png", search: "" },
      { pathname: "/*.jpg", search: "" },
    ],
    // Widths actually needed by the layouts (see the `sizes` props in the code).
    deviceSizes: [640, 828, 1080, 1200, 1920, 3840],
    imageSizes: [128, 256, 384],
    qualities: [75, 90],
    // Optimized images are cached for 31 days.
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: false,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
