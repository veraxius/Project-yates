import type { Metadata } from "next";
import { canonicalFor } from "../../lib/site-env";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  alternates: canonicalFor("/privacy"),
  title: "Privacy Policy",
  description: "What personal data YB University collects, why, and what rights you have.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal information YB University collects, why we collect it, who we share it with, how long we keep it, and the rights you have."
      sections={[
        {
          heading: "Who is responsible",
          paragraphs: [
            "[LEGAL ENTITY NAME], [REGISTERED ADDRESS], is responsible for your data. Contact: [PRIVACY CONTACT EMAIL]. [LEGAL REVIEW REQUIRED: add data protection officer details if applicable.]",
          ],
        },
        {
          heading: "Data we collect",
          items: [
            "Contact and account data: name, email address, and the password you choose (it is passed to our learning platform and is not stored on this website).",
            "Payment data: handled by Stripe. We receive confirmation that you paid and your name and email, not your card number.",
            "Learning data: progress, assessment results, assignments and credential status, held in our learning platform.",
            "Portfolio and application data: work you submit and information you provide when you apply for projects, mentorship or other opportunities.",
            "Registration and inquiry data: what you tell us in our registration, inquiry and application forms (for example your interests, professional background, college or content niche), whether you agreed to receive program updates, and the campaign link that brought you to the site.",
            "Messages: what you send us when you contact us.",
            "Chat data: the messages you type into the website assistant and a random identifier of your browser tab. The assistant is automated: please do not share passwords, payment details or other sensitive information in it.",
            "Technical data: basic information such as IP address and browser type, used for security and to keep the service running.",
          ],
        },
        {
          heading: "Why we use it",
          items: [
            "To create your account, take payment and give you access to the course.",
            "To deliver the program, assess your work and issue the educational credential.",
            "To review applications for selected projects and opportunities.",
            "To send service emails (confirmation, access, password help) and answer your questions.",
            "To respond to your registration, inquiry or application and, only if you agreed, to send you program updates. You can unsubscribe at any time.",
            "To protect the site against fraud and abuse and to meet legal obligations.",
          ],
        },
        {
          heading: "Who we share it with",
          paragraphs: [
            "We use service providers who process data on our behalf: Stripe (payments), LearnWorlds (learning platform), [CRM PROVIDER, e.g. Zoho CRM], [EMAIL / AUTOMATION PROVIDER, e.g. n8n and email service], [AI PROVIDER FOR THE WEBSITE ASSISTANT, e.g. OpenAI], and our hosting and security providers (Railway, Cloudflare). [LEGAL REVIEW REQUIRED: confirm the final list, add Palm Beach Yachts if data is shared with it, and describe international transfers.]",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "[RETENTION PERIODS: e.g. account and learning data for the access period plus X years; payment records as required by tax law; application data for X months.]",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Depending on where you live, you may have the right to access, correct, delete or export your data, to object to or restrict some uses, and to complain to a data protection authority. To use these rights, write to [PRIVACY CONTACT EMAIL]. [LEGAL REVIEW REQUIRED: tailor to the laws that apply, such as GDPR or US state privacy laws.]",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This website does not set tracking cookies at the moment. The chat keeps a random identifier in your browser tab's session storage, which disappears when you close the tab. Our learning platform uses cookies to keep you signed in. [LEGAL REVIEW REQUIRED: update if analytics or advertising tools are added.]",
          ],
        },
        {
          heading: "Security, children and changes",
          paragraphs: [
            "We use technical and organizational measures to protect your data, but no system is perfectly secure. The program is not directed to children under [MINIMUM AGE]. We will post changes to this policy on this page. [LEGAL REVIEW REQUIRED]",
          ],
        },
      ]}
    />
  );
}
