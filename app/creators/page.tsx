import type { Metadata } from "next";
import { LandingPage } from "../../components/landing/LandingPage";
import { landings } from "../../lib/landings";
import { canonicalFor } from "../../lib/site-env";

// Campaign landing page. Its content lives in lib/landings.ts.
const page = landings.creators;

export const metadata: Metadata = {
  alternates: canonicalFor(page.path),
  title: page.metaTitle,
  description: page.metaDescription,
};

export default function CreatorsPage() {
  return <LandingPage page={page} />;
}
