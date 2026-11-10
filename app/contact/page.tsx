import type { Metadata } from "next";
import { canonicalFor } from "../../lib/site-env";
import Link from "next/link";
import { Reveal } from "../../components/Reveal";

export const metadata: Metadata = {
  alternates: canonicalFor("/contact"),
  title: "Contact",
  description: "Get in touch with YB University.",
};

// TODO(contact): set CONTACT_EMAIL in the environment (before building) with
// the address the client wants to receive messages on. No address is invented.
// A contact form can replace the mailto link later. It would be the first
// thing on this site that accepts input, so it needs spam protection and a
// rate limit that does not trust client-sent headers for the visitor's address.
const email = process.env.CONTACT_EMAIL;

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow !text-sand">GET IN TOUCH</p>
          <h1 className="h-display mt-5 text-[clamp(2.5rem,8vw,5rem)]">CONTACT</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            Questions about the program, enrollment, experiences or opportunities.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl border border-navy-900/15 bg-ivory p-8 sm:p-12">
            <p className="eyebrow">WRITE TO US</p>
            {email ? (
              <>
                <p className="mt-4 leading-relaxed text-navy-900/75">
                  Send us a message and we will get back to you.
                </p>
                <a
                  href={`mailto:${email}`}
                  className="h-display mt-6 inline-block break-all text-2xl underline decoration-sand underline-offset-8 sm:text-3xl"
                >
                  {email}
                </a>
              </>
            ) : (
              <p className="mt-4 leading-relaxed text-navy-900/75">
                Contact details will be published here soon. In the meantime, see the{" "}
                <Link href="/faq" className="underline underline-offset-4">
                  frequently asked questions
                </Link>
                .
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
