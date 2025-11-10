"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "age-limits", title: "Age Limits and Consent", level: 1 },
  { id: "parental-rights", title: "Parental Rights and Controls", level: 1 },
  { id: "data-use", title: "Data Collection and Use", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function ChildrenPrivacyPolicyPage() {
  return (
    <PolicyTemplate
      title="Children's Privacy Policy"
      description="Our practices regarding the personal information of children and COPPA compliance."
      lastUpdated="January 15, 2024"
      readingTime="5 minutes"
      category="Compliance"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER does not knowingly collect personal information from children under 13 without
          parental consent, in compliance with COPPA.
        </p>
      </div>

      <div id="collection">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Information Collection</h2>
        <p>
          We do not intentionally collect personal information from children under 13. If we become
          aware of such collection, we will delete it promptly.
        </p>
      </div>

      <div id="parental">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Parental Rights</h2>
        <ul>
          <li>Review collected information</li>
          <li>Request deletion</li>
          <li>Refuse further collection</li>
          <li>Revoke consent</li>
        </ul>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>
          Parents with concerns about children&apos;s data should contact support@skyber.codes.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>
    </PolicyTemplate>
  );
}

