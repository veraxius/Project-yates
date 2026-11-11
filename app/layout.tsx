import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "../components/chat/ChatWidget";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SiteChrome } from "../components/SiteChrome";
import { allowIndexing, chatEnabled } from "../lib/site-env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // <meta name="robots">: noindex, nofollow unless ROBOTS_ALLOW_INDEX=true
  robots: allowIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  title: {
    default: "YB University | Discover a World. Make It Yours.",
    template: "%s | YB University",
  },
  description:
    "YB University is the education and professional development platform connected to Palm Beach Yachts: professional learning, real-world experiences, industry connections, and selected opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteChrome header={<Header />} footer={<Footer />} chat={<ChatWidget ready={chatEnabled()} />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
