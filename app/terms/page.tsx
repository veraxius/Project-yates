import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to using YB University and enrolling in its programs.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These terms apply when you use the YB University website and enroll in its programs. By enrolling you agree to them."
      sections={[
        {
          heading: "Who we are",
          paragraphs: [
            "YB University is operated by [LEGAL ENTITY NAME], [REGISTERED ADDRESS], and is connected to Palm Beach Yachts. You can contact us at [CONTACT EMAIL].",
          ],
        },
        {
          heading: "The program",
          paragraphs: [
            "YB University offers professional learning for people interested in yacht brokerage, including the YB Broker Certification Experience (16 modules, practical assignments, competency assessments and a final challenge), and access to related experiences, a community and selected opportunities.",
            "Course content is delivered through the LearnWorlds learning platform. [LEGAL REVIEW REQUIRED: confirm program description and access period.]",
          ],
        },
        {
          heading: "Enrollment and payment",
          items: [
            "Payments are processed by Stripe. YB University does not see or store your card details.",
            "The price is shown before you pay. [PRICE AND CURRENCY]. Taxes: [TAX TREATMENT].",
            "Access period: [ACCESS PERIOD]. Refund and cancellation policy: [REFUND POLICY].",
            "You must provide accurate information and keep your account details confidential.",
          ],
        },
        {
          heading: "Your account",
          paragraphs: [
            "You choose your own password. You are responsible for activity on your account and for keeping your password secret. Tell us promptly if you think someone else has used your account.",
          ],
        },
        {
          heading: "Educational credential, not a license",
          paragraphs: [
            "The credential issued by YB University is an educational credential. It is not a government-issued license and does not replace any licensing requirement. See the Educational Credential Disclaimer for details.",
          ],
        },
        {
          heading: "No guarantee of results",
          paragraphs: [
            "Completing the program does not guarantee employment, commissions, placement or any brokerage position. Experiences, projects and opportunities depend on availability, selection and eligibility, and may have separate terms.",
          ],
        },
        {
          heading: "Acceptable use and intellectual property",
          items: [
            "Course materials belong to YB University or its licensors and are for your personal learning only. Do not copy, resell or share them.",
            "Do not share your login, interfere with the platform, or use the content to mislead others.",
            "Content you submit (for example portfolio work) remains yours; you give us permission to use it to run the program and review your applications. [LEGAL REVIEW REQUIRED]",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "[LEGAL REVIEW REQUIRED: limitation of liability, disclaimers and mandatory consumer rights that cannot be excluded, according to the applicable law.]",
          ],
        },
        {
          heading: "Changes and governing law",
          paragraphs: [
            "We may update these terms; the version on this page applies. These terms are governed by the laws of [JURISDICTION], and disputes will be handled in [COURTS / ARBITRATION]. [LEGAL REVIEW REQUIRED]",
          ],
        },
      ]}
    />
  );
}
