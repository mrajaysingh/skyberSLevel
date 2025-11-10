"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "ownership", title: "Ownership of Content", level: 1 },
  { id: "trademarks", title: "Trademarks and Branding", level: 1 },
  { id: "licensing", title: "Licensing and Permitted Use", level: 1 },
  { id: "user-content", title: "User-Generated Content", level: 1 },
  { id: "infringement", title: "Infringement Notices (DMCA)", level: 1 },
  { id: "restrictions", title: "Prohibited Uses", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function IntellectualPropertyPolicyPage() {
  return (
    <PolicyTemplate
      title="Intellectual Property Rights Policy"
      description="This policy explains the ownership and permitted use of SKYBER content, trademarks, and intellectual property."
      lastUpdated="January 15, 2024"
      readingTime="8 minutes"
      category="Legal Compliance"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          All content on SKYBER websites and services, including text, graphics, logos, icons, images,
          audio clips, software, and code, is owned by SKYBER or its licensors and is protected by
          intellectual property laws.
        </p>
      </div>

      <div id="ownership">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Ownership of Content</h2>
        <p>
          Unless otherwise stated in a written agreement, SKYBER retains all rights, title, and interest
          in and to the content, software, and deliverables created by SKYBER.
        </p>
      </div>

      <div id="trademarks">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Trademarks and Branding</h2>
        <p>
          The SKYBER name, logo, and related marks are trademarks of SKYBER. You may not use our marks
          without our prior written consent.
        </p>
      </div>

      <div id="licensing">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Licensing and Permitted Use</h2>
        <p>
          Subject to payment and contract terms, customers may be granted a limited, non-exclusive,
          non-transferable license to use deliverables solely for internal business purposes.
        </p>
      </div>

      <div id="user-content">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>User-Generated Content</h2>
        <p>
          By submitting content to our platforms, you grant SKYBER a worldwide, royalty-free license to
          host, store, reproduce, and display such content solely to provide the services.
        </p>
      </div>

      <div id="infringement">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Infringement Notices (DMCA)</h2>
        <p>
          If you believe your IP rights are infringed, please send a notice including your contact
          information, identification of the work, and alleged infringing material to
          legal@skyber.com.
        </p>
      </div>

      <div id="restrictions">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Prohibited Uses</h2>
        <ul>
          <li>Reverse engineering, decompiling, or attempting to derive source code</li>
          <li>Removing proprietary notices from SKYBER materials</li>
          <li>Reselling, sublicensing, or distributing SKYBER content without consent</li>
        </ul>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>For IP-related inquiries, contact support@skyber.codes.</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


