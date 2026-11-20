import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ChatWidget } from "../components/chat/ChatWidget";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SiteChrome } from "../components/SiteChrome";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  allowIndexing,
  chatEnabled,
  publicSiteUrl,
} from "../lib/site-env";
import { socialLinks } from "../lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Used so relative image paths in `metadata.openGraph.images` resolve to full
// URLs. Falls back to a placeholder when NEXT_PUBLIC_SITE_URL isn't set yet
// (Next.js requires *some* valid absolute URL here, even one nobody will hit).
const siteUrl = publicSiteUrl() ?? "https://ybuniversity.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // <meta name="robots">: noindex, nofollow unless ROBOTS_ALLOW_INDEX=true
  robots: allowIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  title: {
    default: DEFAULT_TITLE,
    template: "%s | YB University",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/joyful-couple-sunset-marina.png",
        width: 1792,
        height: 878,
        alt: "A couple smiling together at sunset on a marina dock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/joyful-couple-sunset-marina.png"],
  },
};

// Organization markup, the same facts already on the About/Credential pages:
// connected to Palm Beach Yachts, an educational platform, not itself a
// government or professional licensing body. One copy, site-wide, in the root
// layout — a page-specific schema (e.g. FAQPage on /faq) is added separately on
// top of this, never instead of it.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: siteUrl,
  logo: `${siteUrl}/yb-university-logo-horizontal-color.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: socialLinks.filter((s) => s.href).map((s) => s.href),
};

const GTM_ID = "GTM-PHVRS29F";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="gtm-base" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());`}
        </Script>
        <Script id="gtm" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
        {/* Fixed, build-time JSON authored above, not visitor input. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteChrome header={<Header />} footer={<Footer />} chat={<ChatWidget ready={chatEnabled()} />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
