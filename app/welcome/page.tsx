import type { Metadata } from "next";
import { Suspense } from "react";
import { WelcomeFlow } from "../../components/WelcomeFlow";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-xl border border-navy-900/15 bg-white p-6 sm:p-10">
          <Suspense
            fallback={
              <p role="status" className="text-navy-900/70">
                Confirming your payment…
              </p>
            }
          >
            <WelcomeFlow />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
