"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "prohibited", title: "Prohibited Activities", level: 1 },
  { id: "security", title: "Security Violations", level: 1 },
  { id: "email", title: "Email and Messaging", level: 1 },
  { id: "resources", title: "Resource Usage", level: 1 },
  { id: "enforcement", title: "Enforcement", level: 1 },
  { id: "reporting", title: "Reporting Abuse", level: 1 }
];

export default function AcceptableUsePolicyPage() {
  return (
    <PolicyTemplate
      title="Acceptable Use Policy"
      description="Rules and guidelines for using SKYBER services and platforms responsibly."
      lastUpdated="January 15, 2024"
      readingTime="7 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          This policy ensures safe and lawful use of SKYBER services by all customers and users.
        </p>
      </div>

      <div id="prohibited">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Prohibited Activities</h2>
        <ul>
          <li>Illegal activities or content</li>
          <li>Harassment, hate speech, or incitement of violence</li>
          <li>Distribution of malware, phishing, or fraudulent schemes</li>
          <li>Attempting to bypass security or access other accounts</li>
        </ul>
      </div>

      <div id="security">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Security Violations</h2>
        <p>
          Any attempt to breach security, probe systems, or disrupt services is strictly prohibited and
          may result in suspension or legal action.
        </p>
      </div>

      <div id="email">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Email and Messaging</h2>
        <p>
          Unsolicited bulk messages (spam) are not allowed. Adhere to applicable anti-spam laws (e.g.,
          CAN-SPAM, GDPR ePrivacy).
        </p>
      </div>

      <div id="resources">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Resource Usage</h2>
        <p>
          Do not perform actions that degrade service for others, including excessive API calls or
          abusive automation.
        </p>
      </div>

      <div id="enforcement">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Enforcement</h2>
        <p>
          Violations may result in warnings, suspension, or termination, per the Terms & Conditions.
        </p>
      </div>

      <div id="reporting">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Reporting Abuse</h2>
        <p>
          Report violations to support@skyber.codes with relevant logs, headers, and reproduction steps.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>
    </PolicyTemplate>
  );
}

