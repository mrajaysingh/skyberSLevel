"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "standards", title: "Standards and Guidelines", level: 1 },
  { id: "features", title: "Accessibility Features", level: 1 },
  { id: "feedback", title: "Feedback and Assistance", level: 1 },
  { id: "continuous", title: "Continuous Improvement", level: 1 }
];

export default function AccessibilityPolicyPage() {
  return (
    <PolicyTemplate
      title="Accessibility Policy"
      description="Our commitment to making SKYBER websites and services accessible to all users."
      lastUpdated="January 15, 2024"
      readingTime="5 minutes"
      category="Compliance"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER is committed to ensuring accessibility for people with disabilities by following
          recognized guidelines and best practices.
        </p>
      </div>

      <div id="standards">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Standards and Guidelines</h2>
        <p>
          We strive to conform to WCAG 2.1 AA standards where practical and continuously improve
          accessibility across our digital experiences.
        </p>
      </div>

      <div id="features">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Accessibility Features</h2>
        <ul>
          <li>Semantic HTML and ARIA attributes</li>
          <li>Keyboard navigability</li>
          <li>Color contrast considerations and scalable text</li>
        </ul>
      </div>

      <div id="feedback">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Feedback and Assistance</h2>
        <p>
          If you encounter accessibility barriers, contact support@skyber.codes. We aim to respond
          promptly and provide alternatives if needed.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>

      <div id="continuous">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Continuous Improvement</h2>
        <p>
          We regularly review our sites for accessibility improvements and incorporate user feedback
          into our roadmap.
        </p>
      </div>
    </PolicyTemplate>
  );
}

