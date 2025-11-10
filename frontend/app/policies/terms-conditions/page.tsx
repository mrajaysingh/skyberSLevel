"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections: Array<{ id: string; title: string; level: 1 | 2 | 3 }> = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "acceptance", title: "Acceptance of Terms", level: 1 },
  { id: "services", title: "Description of Services", level: 1 },
  { id: "user-accounts", title: "User Accounts", level: 1 },
  { id: "acceptable-use", title: "Acceptable Use", level: 1 },
  { id: "intellectual-property", title: "Intellectual Property", level: 1 },
  { id: "privacy", title: "Privacy", level: 1 },
  { id: "payment", title: "Payment Terms", level: 1 },
  { id: "limitations", title: "Limitations of Liability", level: 1 },
  { id: "termination", title: "Termination", level: 1 },
  { id: "governing-law", title: "Governing Law", level: 1 },
  { id: "contact", title: "Contact Information", level: 1 }
];

export default function TermsConditionsPage() {
  return (
    <PolicyTemplate
      title="Terms & Conditions"
      description="These Terms and Conditions govern your use of SKYBER's services, website, and applications."
      lastUpdated="January 15, 2024"
      readingTime="15 minutes"
      category="Legal Compliance"
      sections={sections}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          Welcome to SKYBER. These Terms and Conditions govern your use of our website, 
          services, and applications. By accessing or using our Services, you agree to be bound 
          by these Terms and all applicable laws and regulations.
        </p>
      </div>

      <div id="acceptance">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Acceptance of Terms</h2>
        <p>
          By accessing and using our Services, you accept and agree to be bound by these Terms. 
          These Terms constitute a legally binding agreement between you and SKYBER.
        </p>
      </div>

      <div id="services">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Description of Services</h2>
        <p>
          SKYBER provides cybersecurity solutions, web development, mobile app development, 
          3D modeling, game development, and technical consulting services.
        </p>
      </div>

      <div id="user-accounts">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account information 
          and for all activities that occur under your account. You must be at least 18 years old 
          to create an account.
        </p>
      </div>

      <div id="acceptable-use">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Acceptable Use</h2>
        <p>
          You agree to use our Services only for lawful purposes and in accordance with these Terms. 
          You agree not to use our Services in any way that violates applicable laws or regulations.
        </p>
      </div>

      <div id="intellectual-property">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Intellectual Property</h2>
        <p>
          Our Services and their original content are the exclusive property of SKYBER and its licensors. 
          By submitting content, you grant us a worldwide, non-exclusive license to use such content.
        </p>
      </div>

      <div id="privacy">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Privacy</h2>
        <p>
          Your privacy is important to us. Our collection and use of personal information is governed 
          by our Privacy Policy, which is incorporated into these Terms by reference.
        </p>
      </div>

      <div id="payment">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Payment Terms</h2>
        <p>
          By using paid Services, you agree to pay all applicable fees and charges. We reserve the 
          right to modify our pricing at any time with notice.
        </p>
      </div>

      <div id="limitations">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Limitations of Liability</h2>
        <p>
          To the maximum extent permitted by law, SKYBER shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages.
        </p>
      </div>

      <div id="termination">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Termination</h2>
        <p>
          These Terms will remain in effect until terminated by either you or us. We may terminate 
          your access immediately for any violation of these Terms.
        </p>
      </div>

      <div id="governing-law">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the jurisdiction in which SKYBER is incorporated. 
          Disputes will be resolved through informal resolution or binding arbitration.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact Information</h2>
        <p>
          For questions about these Terms, contact us at support@skyber.codes or +91 62394 35836 (Premium tier only).
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>
    </PolicyTemplate>
  );
}

