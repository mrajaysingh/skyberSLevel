"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "steps", title: "Onboarding Steps", level: 1 },
  { id: "requirements", title: "Client Requirements", level: 1 },
  { id: "communication", title: "Communication Cadence", level: 1 },
  { id: "deliverables", title: "Deliverables and Milestones", level: 1 },
  { id: "handoff", title: "Handoff and Go-Live", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function ClientOnboardingPolicyPage() {
  return (
    <PolicyTemplate
      title="Client Onboarding Policy"
      description="Guidelines for onboarding new clients from kickoff to go-live."
      lastUpdated="January 15, 2024"
      readingTime="7 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          This policy defines the standard onboarding process to ensure a predictable, high-quality start
          to every engagement.
        </p>
      </div>

      <div id="steps">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Onboarding Steps</h2>
        <ol>
          <li>Contract signing and kickoff scheduling</li>
          <li>Discovery and requirements validation</li>
          <li>Environment/setup access and integrations</li>
          <li>Project plan confirmation and milestone alignment</li>
        </ol>
      </div>

      <div id="requirements">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Client Requirements</h2>
        <p>
          Clients should designate a primary point of contact and provide timely access to required
          systems and documentation.
        </p>
      </div>

      <div id="communication">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Communication Cadence</h2>
        <p>
          Weekly status updates and milestone reviews are standard unless otherwise agreed.
        </p>
      </div>

      <div id="deliverables">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Deliverables and Milestones</h2>
        <p>
          Deliverables, acceptance criteria, and timelines are recorded in the Statement of Work.
        </p>
      </div>

      <div id="handoff">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Handoff and Go-Live</h2>
        <p>
          Prior to go-live, a readiness checklist and knowledge transfer session are completed.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>Onboarding questions: support@skyber.codes</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}

