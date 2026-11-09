import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Educational Credential Disclaimer",
  description:
    "The YB University credential is an educational credential. It is not a government-issued or professional license.",
};

export default function CredentialDisclaimerPage() {
  return (
    <LegalPage
      title="Educational Credential Disclaimer"
      intro="This page explains what the YB University credential is, and what it is not, so that no one is misled about what completing the program means."
      sections={[
        {
          heading: "What the credential is",
          paragraphs: [
            "Participants who successfully complete the program and meet its assessment requirements receive the YB University credential in Yacht Brokerage Professional Foundations. It is an educational credential issued by YB University to recognize completion of a course of study.",
          ],
        },
        {
          heading: "What the credential is not",
          items: [
            "It is not a government-issued license, certification or registration.",
            "It is not a professional or occupational license, and it is not a substitute for any licensing requirements that may apply where you live or work.",
            "It is not issued, and has not been approved, by any government or licensing authority. [LEGAL REVIEW REQUIRED: confirm exact wording and any accreditation statements.]",
          ],
        },
        {
          heading: "Your responsibility",
          paragraphs: [
            "Rules for acting as a yacht broker, selling vessels or handling client funds differ by location. You are responsible for finding out and meeting the licensing, registration and legal requirements that apply to you before offering brokerage services. [LEGAL REVIEW REQUIRED: add jurisdiction-specific language.]",
          ],
        },
        {
          heading: "No guarantee of outcomes",
          items: [
            "Completion of a course does not guarantee employment, commissions, or a brokerage position.",
            "Projects, placements, compensation and mentorship are subject to availability, selection, eligibility, and separate terms.",
            "Experiences, such as yacht visits and events, are offered according to availability, eligibility, permissions and applicable event requirements. Participation is not guaranteed by course enrollment.",
          ],
        },
        {
          heading: "Relationship with Palm Beach Yachts",
          paragraphs: [
            "YB University is connected to Palm Beach Yachts. [LEGAL REVIEW REQUIRED: describe the exact legal relationship between the two entities, and whether the credential is endorsed by Palm Beach Yachts.]",
          ],
        },
      ]}
    />
  );
}
