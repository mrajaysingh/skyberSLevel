"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "lawful", title: "Lawful Basis for Processing", level: 1 },
  { id: "rights", title: "Data Subject Rights", level: 1 },
  { id: "transfers", title: "International Data Transfers", level: 1 },
  { id: "dpo", title: "Data Protection Officer", level: 1 },
  { id: "requests", title: "Submitting Requests", level: 1 }
];

export default function GdprCompliancePage() {
  return (
    <PolicyTemplate
      title="GDPR Compliance Statement"
      description="How SKYBER complies with the EU General Data Protection Regulation (GDPR)."
      lastUpdated="January 15, 2024"
      readingTime="7 minutes"
      category="Compliance"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER processes personal data in compliance with GDPR principles of lawfulness, fairness,
          transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity,
          and confidentiality.
        </p>
      </div>

      <div id="lawful">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Lawful Basis for Processing</h2>
        <ul>
          <li>Consent</li>
          <li>Contractual necessity</li>
          <li>Legitimate interests (balanced test)</li>
          <li>Legal obligation</li>
        </ul>
      </div>

      <div id="rights">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Subject Rights</h2>
        <ul>
          <li>Access, rectification, erasure</li>
          <li>Restriction and objection</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </div>

      <div id="transfers">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>International Data Transfers</h2>
        <p>
          Transfers outside the EEA are protected by appropriate safeguards, such as SCCs or adequacy
          decisions.
        </p>
      </div>

      <div id="dpo">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Protection Officer</h2>
        <p>
          Contact our DPO at support@skyber.codes for GDPR-related inquiries.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>

      <div id="requests">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Submitting Requests</h2>
        <p>
          To exercise your rights, submit a request to privacy@skyber.com with sufficient details to
          verify your identity.
        </p>
      </div>
    </PolicyTemplate>
  );
}


