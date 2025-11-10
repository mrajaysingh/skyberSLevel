"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "hours", title: "Support Hours", level: 1 },
  { id: "channels", title: "Support Channels", level: 1 },
  { id: "severity", title: "Severity Levels", level: 1 },
  { id: "sla", title: "Response SLAs", level: 1 },
  { id: "escalation", title: "Escalation Process", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function SupportPolicyPage() {
  return (
    <PolicyTemplate
      title="Support Policy"
      description="Details support availability, channels, severity levels, and response targets."
      lastUpdated="January 15, 2024"
      readingTime="6 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          We provide multi-channel support to help you quickly resolve issues and questions.
        </p>
      </div>

      <div id="hours">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Support Hours</h2>
        <p>
          Standard: Monday–Friday, 9:00–18:00. Premium tiers may include extended or 24/7 coverage.
        </p>
      </div>

      <div id="channels">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Support Channels</h2>
        <ul>
          <li>Client Portal (preferred)</li>
          <li>Email: support@skyber.com</li>
          <li>Phone: for Premium/Enterprise contracts</li>
        </ul>
      </div>

      <div id="severity">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Severity Levels</h2>
        <ul>
          <li>Critical: System down or major business impact</li>
          <li>High: Significant degradation</li>
          <li>Medium: Limited impact workaround exists</li>
          <li>Low: Minor issue or question</li>
        </ul>
      </div>

      <div id="sla">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Response SLAs</h2>
        <p>
          Response targets align with our SLA. See Service Level Agreement for details.
        </p>
      </div>

      <div id="escalation">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Escalation Process</h2>
        <p>
          If an issue remains unresolved, it is escalated to senior engineers and management per our
          internal process.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>Support contact: support@skyber.codes</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


