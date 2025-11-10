"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "integrity", title: "Integrity and Anti-Corruption", level: 1 },
  { id: "privacy", title: "Privacy and Data Ethics", level: 1 },
  { id: "ai-ethics", title: "AI/Technology Ethics", level: 1 },
  { id: "conflicts", title: "Conflicts of Interest", level: 1 },
  { id: "reporting", title: "Reporting Concerns", level: 1 }
];

export default function TransparencyEthicsPolicyPage() {
  return (
    <PolicyTemplate
      title="Transparency & Ethics Policy"
      description="Our standards for ethical conduct, transparency, and responsible technology use."
      lastUpdated="January 15, 2024"
      readingTime="6 minutes"
      category="Trust Building"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER operates with transparency and ethical principles, ensuring accountability and
          trust in all our business practices.
        </p>
      </div>

      <div id="principles">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Ethical Principles</h2>
        <ul>
          <li>Honesty and integrity in all dealings</li>
          <li>Fair treatment of employees, customers, and partners</li>
          <li>Compliance with applicable laws and regulations</li>
          <li>Responsible use of technology and data</li>
        </ul>
      </div>

      <div id="transparency">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Transparency Practices</h2>
        <ul>
          <li>Clear communication about our services and policies</li>
          <li>Open disclosure of data practices and security measures</li>
          <li>Transparent pricing and billing practices</li>
          <li>Regular reporting on our commitments and progress</li>
        </ul>
      </div>

      <div id="governance">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Corporate Governance</h2>
        <p>
          We maintain strong governance practices with clear policies, regular audits, and
          independent oversight where appropriate.
        </p>
      </div>

      <div id="reporting">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Reporting Concerns</h2>
        <p>
          Employees and stakeholders can report ethical concerns confidentially to
          support@skyber.codes without fear of retaliation.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>Ethics and transparency inquiries: support@skyber.codes</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


