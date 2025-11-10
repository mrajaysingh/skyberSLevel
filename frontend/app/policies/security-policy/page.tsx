"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "framework", title: "Security Framework", level: 1 },
  { id: "encryption", title: "Encryption", level: 1 },
  { id: "access", title: "Access Control", level: 1 },
  { id: "vuln", title: "Vulnerability Management", level: 1 },
  { id: "incident", title: "Incident Response", level: 1 },
  { id: "third-parties", title: "Third-Party Risk", level: 1 },
  { id: "training", title: "Employee Training", level: 1 },
  { id: "reporting", title: "Reporting Security Issues", level: 1 }
];

export default function SecurityPolicyPage() {
  return (
    <PolicyTemplate
      title="Security Policy"
      description="Overview of SKYBER's security practices, controls, and incident handling."
      lastUpdated="January 15, 2024"
      readingTime="9 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER implements administrative, technical, and physical safeguards to protect data.
        </p>
      </div>

      <div id="framework">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Security Framework</h2>
        <p>
          Our program aligns with industry best practices (e.g., ISO 27001 principles, NIST guidance)
          as appropriate to our risk profile.
        </p>
      </div>

      <div id="encryption">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Encryption</h2>
        <ul>
          <li>Data in transit protected with TLS 1.2+</li>
          <li>Data at rest encrypted using strong algorithms where applicable</li>
        </ul>
      </div>

      <div id="access">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Access Control</h2>
        <ul>
          <li>Principle of least privilege and role-based access</li>
          <li>MFA enforced for privileged access where feasible</li>
          <li>Periodic access reviews</li>
        </ul>
      </div>

      <div id="vuln">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Vulnerability Management</h2>
        <p>
          Regular patching, code reviews, and security assessments. Critical issues are prioritized for
          remediation.
        </p>
      </div>

      <div id="incident">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Incident Response</h2>
        <p>
          We maintain an incident response process including identification, containment, eradication,
          recovery, and post-incident review.
        </p>
      </div>

      <div id="third-parties">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Third-Party Risk</h2>
        <p>
          Vendors handling data are assessed for security and privacy practices and bound by DPAs where
          applicable.
        </p>
      </div>

      <div id="training">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Employee Training</h2>
        <p>
          Personnel receive periodic security awareness and data protection training.
        </p>
      </div>

      <div id="reporting">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Reporting Security Issues</h2>
        <p>
          Report suspected vulnerabilities to support@skyber.codes. We appreciate responsible disclosure.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>
    </PolicyTemplate>
  );
}


