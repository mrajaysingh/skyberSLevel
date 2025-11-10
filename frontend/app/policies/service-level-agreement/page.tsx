"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "definitions", title: "Definitions", level: 1 },
  { id: "uptime", title: "Uptime Commitment", level: 1 },
  { id: "support", title: "Support Tiers", level: 1 },
  { id: "response", title: "Response and Resolution Targets", level: 1 },
  { id: "maintenance", title: "Maintenance Windows", level: 1 },
  { id: "exclusions", title: "Service Exclusions", level: 1 },
  { id: "credits", title: "Service Credits", level: 1 },
  { id: "reporting", title: "Incident Reporting", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function ServiceLevelAgreementPage() {
  return (
    <PolicyTemplate
      title="Service Level Agreement (SLA)"
      description="Our commitment to availability, performance, and support responsiveness."
      lastUpdated="January 15, 2024"
      readingTime="10 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          This SLA outlines the service levels provided by SKYBER for subscribed services, including
          uptime commitments and support response targets.
        </p>
      </div>

      <div id="definitions">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Definitions</h2>
        <ul>
          <li><strong>Uptime</strong>: Percentage of time services are available.</li>
          <li><strong>Incident</strong>: Unplanned interruption or degradation of service.</li>
          <li><strong>Business Hours</strong>: 9:00–18:00 local time, Monday–Friday (excluding holidays).</li>
        </ul>
      </div>

      <div id="uptime">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Uptime Commitment</h2>
        <p>
          We target 99.9% monthly uptime for production services, excluding scheduled maintenance and
          circumstances beyond our reasonable control.
        </p>
      </div>

      <div id="support">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Support Tiers</h2>
        <ul>
          <li>Standard: Email and ticketing during business hours</li>
          <li>Premium: Extended hours and priority routing</li>
          <li>Enterprise: 24/7 critical incident support</li>
        </ul>
      </div>

      <div id="response">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Response and Resolution Targets</h2>
        <ul>
          <li>Severity 1 (Critical): Response within 1 hour, work continuously until resolution</li>
          <li>Severity 2 (High): Response within 4 business hours</li>
          <li>Severity 3 (Medium): Response within 1 business day</li>
          <li>Severity 4 (Low): Response within 2 business days</li>
        </ul>
      </div>

      <div id="maintenance">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Maintenance Windows</h2>
        <p>
          Scheduled maintenance will be announced at least 48 hours in advance and performed during
          low-traffic windows when feasible.
        </p>
      </div>

      <div id="exclusions">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Service Exclusions</h2>
        <ul>
          <li>Issues caused by customer infrastructure or third-party services</li>
          <li>Force majeure events and network provider outages</li>
          <li>Beta features or experimental functionality</li>
        </ul>
      </div>

      <div id="credits">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Service Credits</h2>
        <p>
          In the event of missed uptime targets, customers may be eligible for service credits as
          described in their contract. Credits must be requested within 30 days of the incident.
        </p>
      </div>

      <div id="reporting">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Incident Reporting</h2>
        <p>
          Report incidents via the client portal or email support@skyber.com with details including
          timestamps, impact, and affected components.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>For SLA-related queries, contact support@skyber.codes.</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


