"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "no-warranties", title: "No Warranties", level: 1 },
  { id: "limitation-liability", title: "Limitation of Liability", level: 1 },
  { id: "external-links", title: "External Links", level: 1 },
  { id: "professional-advice", title: "No Professional Advice", level: 1 },
  { id: "changes", title: "Changes to This Disclaimer", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function DisclaimerPage() {
  return (
    <PolicyTemplate
      title="Disclaimer"
      description="This Disclaimer outlines the limitations of liability and warranties related to the information and services provided by SKYBER."
      lastUpdated="January 15, 2024"
      readingTime="6 minutes"
      category="Legal Compliance"
      sections={sections.map(section => ({ ...section, level: section.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          The information provided by SKYBER on our website and through our services is for general
          informational purposes only. All information is provided in good faith; however, we make no
          representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability,
          availability, or completeness of any information.
        </p>
      </div>

      <div id="no-warranties">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>No Warranties</h2>
        <p>
          Your use of the site and our services is at your sole risk. The site and services are
          provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, whether
          express or implied, including implied warranties of merchantability, fitness for a
          particular purpose, and non-infringement.
        </p>
      </div>

      <div id="limitation-liability">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Limitation of Liability</h2>
        <p>
          In no event shall SKYBER, its affiliates, or its licensors be liable for any indirect,
          incidental, special, consequential, or punitive damages arising out of or related to your
          use of the site or services, even if advised of the possibility of such damages.
        </p>
      </div>

      <div id="external-links">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>External Links</h2>
        <p>
          Our site may contain links to third-party websites. Such links are provided solely as a
          convenience. SKYBER does not control and is not responsible for the content or policies of
          these websites and does not endorse or make any representations about them.
        </p>
      </div>

      <div id="professional-advice">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>No Professional Advice</h2>
        <p>
          Nothing on this site constitutes professional advice (including legal, financial, or
          technical advice). You should consult qualified professionals for advice tailored to your
          situation.
        </p>
      </div>

      <div id="changes">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Changes to This Disclaimer</h2>
        <p>
          We may update this Disclaimer from time to time. Changes will be posted on this page with
          the updated effective date.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>
          If you have questions about this Disclaimer, contact us at support@skyber.codes.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>
    </PolicyTemplate>
  );
}


