import type { Metadata } from "next";
import { LandingShell } from "../../components/landing/LandingShell";
import { LeadForm } from "../../components/landing/LeadForm";
import { Photo } from "../../components/Photo";
import { leadForms } from "../../lib/lead-forms";
import { canonicalFor } from "../../lib/site-env";

export const metadata: Metadata = {
  alternates: canonicalFor("/discovery-pass"),
  title: "The YB Discovery Pass",
  description:
    "Your world starts here. Discover introductory learning, explore upcoming experiences, and find the YB path that fits your interests.",
};

// The shared free registration, for people who arrive without a campaign page.
// The answer to "What interests you most?" decides how the CRM classifies them.
// Registering never enrolls anyone in the paid course.
export default function DiscoveryPassPage() {
  return (
    <LandingShell cta={leadForms["discovery-pass"].submitLabel} shortCta="Get My Pass">
      <section className="relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-24 lg:py-32">
        <Photo
          src="/luxury-yacht-golden-horizon.png"
          alt="A yacht cruising across open water toward the sun on the horizon"
          objectPosition="35% 55%"
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 -z-10"
        />
        {/* Navy veil, strongest on the left where the text sits, so the words stay readable on the bright sky. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/25" />
        <div className="container-x">
          <div className="flex items-center gap-4">
            <p className="eyebrow !text-sky">FREE REGISTRATION</p>
            <span aria-hidden className="block h-px w-14 bg-sky" />
          </div>
          <h1 className="h-display mt-6 text-[clamp(2.5rem,6vw,4.5rem)]">The YB Discovery Pass</h1>
          <p className="h-display mt-5 text-2xl text-white/90 sm:text-3xl">Your world starts here.</p>
          <p className="mt-6 max-w-xl leading-relaxed text-white/75">
            Discover introductory learning, explore upcoming experiences, and find the YB path that
            fits your interests.
          </p>
        </div>
      </section>

      <section id="join" className="bg-ivory py-16 lg:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-xl border border-navy-900/15 bg-white p-6 sm:p-10">
            <LeadForm formId="discovery-pass" />
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
