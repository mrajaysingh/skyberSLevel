"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "data-principles", title: "Data Protection Principles", level: 1 },
  { id: "lawful-basis", title: "Lawful Basis for Processing", level: 1 },
  { id: "data-minimization", title: "Data Minimization", level: 2 },
  { id: "purpose-limitation", title: "Purpose Limitation", level: 2 },
  { id: "storage-limitation", title: "Storage Limitation", level: 2 },
  { id: "data-security", title: "Data Security Measures", level: 1 },
  { id: "technical-measures", title: "Technical Security", level: 2 },
  { id: "organizational-measures", title: "Organizational Security", level: 2 },
  { id: "data-retention", title: "Data Retention and Disposal", level: 1 },
  { id: "retention-periods", title: "Retention Periods", level: 2 },
  { id: "secure-disposal", title: "Secure Disposal", level: 2 },
  { id: "data-subject-rights", title: "Data Subject Rights", level: 1 },
  { id: "access-rights", title: "Access and Portability", level: 2 },
  { id: "rectification", title: "Rectification and Erasure", level: 2 },
  { id: "restriction", title: "Restriction and Objection", level: 2 },
  { id: "data-breaches", title: "Data Breach Response", level: 1 },
  { id: "breach-detection", title: "Breach Detection", level: 2 },
  { id: "breach-notification", title: "Breach Notification", level: 2 },
  { id: "third-party-processors", title: "Third-Party Data Processors", level: 1 },
  { id: "processor-selection", title: "Processor Selection", level: 2 },
  { id: "data-processing-agreements", title: "Data Processing Agreements", level: 2 },
  { id: "international-transfers", title: "International Data Transfers", level: 1 },
  { id: "transfer-safeguards", title: "Transfer Safeguards", level: 2 },
  { id: "adequacy-decisions", title: "Adequacy Decisions", level: 2 },
  { id: "training", title: "Staff Training and Awareness", level: 1 },
  { id: "regular-training", title: "Regular Training Programs", level: 2 },
  { id: "compliance-monitoring", title: "Compliance Monitoring", level: 2 },
  { id: "contact", title: "Contact Information", level: 1 }
] as { id: string; title: string; level: 1 | 2 | 3 }[];

export default function DataProtectionPolicyPage() {
  return (
    <PolicyTemplate
      title="Data Protection Policy"
      description="This policy outlines how SKYBER protects and manages personal data in compliance with data protection laws and regulations."
      lastUpdated="January 15, 2024"
      readingTime="12 minutes"
      category="Legal Compliance"
      sections={sections}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          SKYBER is committed to protecting the privacy and personal data of all individuals 
          who interact with our services. This Data Protection Policy outlines our approach 
          to data protection and our compliance with applicable data protection laws, 
          including the General Data Protection Regulation (GDPR) and other relevant legislation.
        </p>
        <p>
          We recognize that personal data is valuable and sensitive information that requires 
          careful handling. This policy ensures that all personal data is processed lawfully, 
          fairly, and transparently, with appropriate security measures in place.
        </p>
      </div>

      <div id="data-principles">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Protection Principles</h2>
        <p>
          Our data protection practices are based on fundamental principles that ensure 
          personal data is handled responsibly and ethically. These principles guide all 
          our data processing activities and decision-making processes.
        </p>
        <p>
          We are committed to upholding these principles in all aspects of our operations:
        </p>
        <ul>
          <li><strong>Lawfulness, Fairness, and Transparency:</strong> We process personal data lawfully, fairly, and in a transparent manner</li>
          <li><strong>Purpose Limitation:</strong> We collect personal data for specified, explicit, and legitimate purposes</li>
          <li><strong>Data Minimization:</strong> We only collect personal data that is adequate, relevant, and limited to what is necessary</li>
          <li><strong>Accuracy:</strong> We ensure personal data is accurate and kept up to date</li>
          <li><strong>Storage Limitation:</strong> We retain personal data only for as long as necessary</li>
          <li><strong>Integrity and Confidentiality:</strong> We process personal data securely and confidentially</li>
          <li><strong>Accountability:</strong> We take responsibility for our data protection practices</li>
        </ul>
      </div>

      <div id="lawful-basis">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Lawful Basis for Processing</h2>
        <p>
          We only process personal data when we have a lawful basis to do so. 
          We ensure that our data processing activities are justified under one 
          or more of the following legal grounds:
        </p>

        <div id="data-minimization">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Data Minimization</h3>
          <p>
            We collect and process only the minimum amount of personal data necessary 
            to achieve our specified purposes. We regularly review our data collection 
            practices to ensure we are not collecting excessive or unnecessary information.
          </p>
          <p>
            Before collecting any personal data, we ask ourselves:
          </p>
          <ul>
            <li>Do we really need this information?</li>
            <li>Can we achieve our purpose with less data?</li>
            <li>Is this data relevant to our stated purpose?</li>
          </ul>
        </div>

        <div id="purpose-limitation">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Purpose Limitation</h3>
          <p>
            We clearly define the purposes for which we collect personal data and 
            ensure that data is not used for purposes that are incompatible with 
            the original collection purpose.
          </p>
          <p>
            If we need to use personal data for a new purpose, we will:
          </p>
          <ul>
            <li>Assess whether the new purpose is compatible with the original purpose</li>
            <li>Obtain additional consent if required</li>
            <li>Update our privacy notices accordingly</li>
          </ul>
        </div>

        <div id="storage-limitation">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Storage Limitation</h3>
          <p>
            We establish clear retention periods for different types of personal data 
            and regularly review and delete data that is no longer needed. 
            We do not keep personal data indefinitely.
          </p>
        </div>
      </div>

      <div id="data-security">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Security Measures</h2>
        <p>
          We implement comprehensive security measures to protect personal data 
          against unauthorized access, alteration, disclosure, and destruction. 
          Our security approach combines technical, organizational, and physical measures.
        </p>

        <div id="technical-measures">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Technical Security</h3>
          <p>
            We employ state-of-the-art technical security measures including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest using industry-standard algorithms</li>
            <li>Multi-factor authentication for all system access</li>
            <li>Regular security updates and patches for all systems</li>
            <li>Intrusion detection and prevention systems</li>
            <li>Secure coding practices and regular security testing</li>
            <li>Network segmentation and access controls</li>
          </ul>
        </div>

        <div id="organizational-measures">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Organizational Security</h3>
          <p>
            We implement organizational security measures including:
          </p>
          <ul>
            <li>Access control policies and procedures</li>
            <li>Regular security awareness training for all staff</li>
            <li>Incident response procedures and escalation protocols</li>
            <li>Regular security audits and assessments</li>
            <li>Background checks for employees with access to sensitive data</li>
            <li>Clear desk and clear screen policies</li>
          </ul>
        </div>
      </div>

      <div id="data-retention">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Retention and Disposal</h2>
        <p>
          We have established clear data retention policies that specify how long 
          different types of personal data are kept and when they should be deleted 
          or anonymized.
        </p>

        <div id="retention-periods">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Retention Periods</h3>
          <p>
            Our retention periods are based on:
          </p>
          <ul>
            <li>Legal and regulatory requirements</li>
            <li>Business needs and operational requirements</li>
            <li>Data subject consent and preferences</li>
            <li>Risk assessment and data sensitivity</li>
          </ul>
          <p>
            We regularly review our retention schedules and update them as necessary 
            to ensure compliance with changing legal requirements.
          </p>
        </div>

        <div id="secure-disposal">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Secure Disposal</h3>
          <p>
            When personal data reaches the end of its retention period, we ensure 
            it is disposed of securely and completely. Our disposal methods include:
          </p>
          <ul>
            <li>Secure deletion of electronic data</li>
            <li>Physical destruction of paper records</li>
            <li>Verification of disposal completion</li>
            <li>Documentation of disposal activities</li>
          </ul>
        </div>
      </div>

      <div id="data-subject-rights">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Subject Rights</h2>
        <p>
          We respect and facilitate the exercise of data subject rights. 
          We have established procedures to handle requests from individuals 
          regarding their personal data.
        </p>

        <div id="access-rights">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Access and Portability</h3>
          <p>
            Data subjects have the right to:
          </p>
          <ul>
            <li>Request access to their personal data</li>
            <li>Receive a copy of their data in a portable format</li>
            <li>Verify the accuracy of their personal data</li>
            <li>Understand how their data is being processed</li>
          </ul>
        </div>

        <div id="rectification">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Rectification and Erasure</h3>
          <p>
            Data subjects can request:
          </p>
          <ul>
            <li>Correction of inaccurate or incomplete data</li>
            <li>Deletion of their personal data (right to be forgotten)</li>
            <li>Restriction of processing in certain circumstances</li>
          </ul>
        </div>

        <div id="restriction">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Restriction and Objection</h3>
          <p>
            Data subjects have the right to:
          </p>
          <ul>
            <li>Object to processing of their personal data</li>
            <li>Request restriction of processing</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
        </div>
      </div>

      <div id="data-breaches">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Breach Response</h2>
        <p>
          We have established comprehensive procedures for detecting, reporting, 
          and responding to data breaches. Our incident response plan ensures 
          swift and effective action in the event of a security incident.
        </p>

        <div id="breach-detection">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Breach Detection</h3>
          <p>
            We employ multiple methods to detect potential data breaches:
          </p>
          <ul>
            <li>Automated monitoring and alerting systems</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Employee reporting procedures</li>
            <li>Third-party security monitoring services</li>
          </ul>
        </div>

        <div id="breach-notification">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Breach Notification</h3>
          <p>
            In the event of a data breach, we will:
          </p>
          <ul>
            <li>Immediately assess the scope and impact of the breach</li>
            <li>Notify relevant supervisory authorities within required timeframes</li>
            <li>Inform affected data subjects when necessary</li>
            <li>Take immediate steps to contain and remediate the breach</li>
            <li>Document all actions taken and lessons learned</li>
          </ul>
        </div>
      </div>

      <div id="third-party-processors">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Third-Party Data Processors</h2>
        <p>
          When we engage third-party service providers to process personal data 
          on our behalf, we ensure they meet our high standards for data protection 
          and security.
        </p>

        <div id="processor-selection">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Processor Selection</h3>
          <p>
            We carefully select our data processors based on:
          </p>
          <ul>
            <li>Their data protection and security practices</li>
            <li>Compliance with relevant regulations</li>
            <li>Technical capabilities and security measures</li>
            <li>Reputation and track record</li>
          </ul>
        </div>

        <div id="data-processing-agreements">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Data Processing Agreements</h3>
          <p>
            We enter into formal data processing agreements with all third-party 
            processors that include:
          </p>
          <ul>
            <li>Clear instructions on data processing</li>
            <li>Security and confidentiality obligations</li>
            <li>Data breach notification requirements</li>
            <li>Sub-processor restrictions and approvals</li>
            <li>Data return and deletion obligations</li>
          </ul>
        </div>
      </div>

      <div id="international-transfers">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>International Data Transfers</h2>
        <p>
          When we transfer personal data outside of the European Economic Area (EEA), 
          we ensure that appropriate safeguards are in place to protect the data 
          in accordance with applicable data protection laws.
        </p>

        <div id="transfer-safeguards">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Transfer Safeguards</h3>
          <p>
            We implement appropriate safeguards for international transfers including:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Binding Corporate Rules (BCRs) for intra-group transfers</li>
            <li>Adequacy decisions by the European Commission</li>
            <li>Additional technical and organizational measures as needed</li>
          </ul>
        </div>

        <div id="adequacy-decisions">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Adequacy Decisions</h3>
          <p>
            We prioritize transfers to countries that have received adequacy decisions 
            from the European Commission, as these countries are deemed to provide 
            an adequate level of data protection.
          </p>
        </div>
      </div>

      <div id="training">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Staff Training and Awareness</h2>
        <p>
          We recognize that our employees are our first line of defense in data protection. 
          We provide comprehensive training and maintain a culture of security awareness 
          throughout our organization.
        </p>

        <div id="regular-training">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Regular Training Programs</h3>
          <p>
            We provide regular training on:
          </p>
          <ul>
            <li>Data protection principles and requirements</li>
            <li>Security best practices and procedures</li>
            <li>Incident response and reporting</li>
            <li>Data subject rights and how to handle requests</li>
            <li>Updates to relevant laws and regulations</li>
          </ul>
        </div>

        <div id="compliance-monitoring">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Compliance Monitoring</h3>
          <p>
            We regularly monitor and assess our compliance with data protection 
            requirements through:
          </p>
          <ul>
            <li>Internal audits and assessments</li>
            <li>External security reviews and penetration testing</li>
            <li>Employee performance evaluations</li>
            <li>Regular policy reviews and updates</li>
          </ul>
        </div>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact Information</h2>
        <p>
          If you have any questions about this Data Protection Policy or wish to 
          exercise your data protection rights, please contact us:
        </p>
        <ul>
          <li>Email: support@skyber.codes</li>
          <li>Mobile: +91 62394 35836 (Premium tier only)</li>
          <li>Chat: LUMI - Advanced AI Chat Support</li>
          <li>Address: Mandhana, Kanpur, Uttar Pradesh - 209217</li>
        </ul>
        <p>
          For urgent data protection matters or suspected data breaches, 
          please contact our Data Protection Officer directly at support@skyber.codes.
        </p>
      </div>
    </PolicyTemplate>
  );
}
