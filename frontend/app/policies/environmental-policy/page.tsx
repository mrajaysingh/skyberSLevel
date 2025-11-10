"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "commitments", title: "Our Environmental Commitments", level: 1 },
  { id: "operations", title: "Sustainable Operations", level: 1 },
  { id: "partners", title: "Vendors and Partners", level: 1 },
  { id: "measurement", title: "Measurement and Reporting", level: 1 }
];

export default function EnvironmentalPolicyPage() {
  return (
    <PolicyTemplate
      title="Environmental and Sustainability Policy"
      description="SKYBER’s approach to minimizing environmental impact and promoting sustainability."
      lastUpdated="January 15, 2024"
      readingTime="5 minutes"
      category="Trust Building"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER is committed to minimizing our environmental impact through sustainable practices
          and responsible resource management.
        </p>
      </div>

      <div id="commitment">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Environmental Commitment</h2>
        <ul>
          <li>Reduce carbon footprint through energy-efficient operations</li>
          <li>Minimize waste and promote recycling</li>
          <li>Choose sustainable suppliers and partners</li>
          <li>Support remote work to reduce commuting emissions</li>
        </ul>
      </div>

      <div id="practices">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Sustainable Practices</h2>
        <ul>
          <li>Cloud-based services to reduce hardware waste</li>
          <li>Digital-first approach to minimize paper usage</li>
          <li>Energy-efficient office practices</li>
          <li>Green hosting providers where possible</li>
        </ul>
      </div>

      <div id="goals">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Environmental Goals</h2>
        <p>
          We continuously work to improve our environmental performance and set measurable targets
          for reducing our impact.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>Environmental inquiries: support@skyber.codes</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


