"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "information-collection", title: "Information We Collect", level: 1 },
  { id: "personal-data", title: "Personal Data", level: 2 },
  { id: "usage-data", title: "Usage Data", level: 2 },
  { id: "cookies", title: "Cookies and Tracking", level: 2 },
  { id: "data-usage", title: "How We Use Your Information", level: 1 },
  { id: "service-provision", title: "Service Provision", level: 2 },
  { id: "communication", title: "Communication", level: 2 },
  { id: "improvement", title: "Service Improvement", level: 2 },
  { id: "legal-compliance", title: "Legal Compliance", level: 2 },
  { id: "data-sharing", title: "Data Sharing and Disclosure", level: 1 },
  { id: "third-parties", title: "Third-Party Services", level: 2 },
  { id: "legal-requirements", title: "Legal Requirements", level: 2 },
  { id: "business-transfers", title: "Business Transfers", level: 2 },
  { id: "data-security", title: "Data Security", level: 1 },
  { id: "security-measures", title: "Security Measures", level: 2 },
  { id: "data-retention", title: "Data Retention", level: 2 },
  { id: "your-rights", title: "Your Rights and Choices", level: 1 },
  { id: "access", title: "Access and Portability", level: 2 },
  { id: "correction", title: "Correction and Deletion", level: 2 },
  { id: "objection", title: "Objection and Restriction", level: 2 },
  { id: "withdrawal", title: "Consent Withdrawal", level: 2 },
  { id: "international-transfers", title: "International Data Transfers", level: 1 },
  { id: "gdpr-compliance", title: "GDPR Compliance", level: 2 },
  { id: "ccpa-compliance", title: "CCPA Compliance", level: 2 },
  { id: "children-privacy", title: "Children's Privacy", level: 1 },
  { id: "coppa-compliance", title: "COPPA Compliance", level: 2 },
  { id: "parental-controls", title: "Parental Controls", level: 2 },
  { id: "policy-updates", title: "Policy Updates", level: 1 },
  { id: "notification", title: "Change Notification", level: 2 },
  { id: "acceptance", title: "Acceptance of Changes", level: 2 },
  { id: "contact", title: "Contact Information", level: 1 },
  { id: "data-protection-officer", title: "Data Protection Officer", level: 2 },
  { id: "complaints", title: "Complaints and Disputes", level: 2 }
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyTemplate
      title="Privacy Policy"
      description="This Privacy Policy explains how SKYBER collects, uses, and protects your personal information when you use our services, website, and applications."
      lastUpdated="January 15, 2024"
      readingTime="15 minutes"
      category="Legal Compliance"
      sections={sections.map(section => ({
        ...section,
        level: section.level as 1 | 2 | 3
      }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          At SKYBER, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy outlines our practices regarding the collection, use, disclosure, and protection of information 
          when you use our services, visit our website, or interact with us in any way.
        </p>
        <p>
          By using our services, you agree to the collection and use of information in accordance with this policy. 
          We will not use or share your information with anyone except as described in this Privacy Policy.
        </p>
      </div>

      <div id="information-collection">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Information We Collect</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our services to you.
        </p>

        <div id="personal-data">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Personal Data</h3>
          <p>
            While using our services, we may ask you to provide us with certain personally identifiable information 
            that can be used to contact or identify you. This may include, but is not limited to:
          </p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Company name and job title</li>
            <li>Billing and payment information</li>
            <li>Address information</li>
          </ul>
        </div>

        <div id="usage-data">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Usage Data</h3>
          <p>
            We may also collect information on how our services are accessed and used. This Usage Data may include:
          </p>
          <ul>
            <li>Your computer&apos;s Internet Protocol address (IP address)</li>
            <li>Browser type and version</li>
            <li>The pages of our service that you visit</li>
            <li>The time and date of your visits</li>
            <li>The time spent on those pages</li>
            <li>Unique device identifiers and other diagnostic data</li>
          </ul>
        </div>

        <div id="cookies">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Cookies and Tracking</h3>
          <p>
            We use cookies and similar tracking technologies to track activity on our services and hold certain information.
            Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
            However, if you do not accept cookies, you may not be able to use some portions of our services.
          </p>
        </div>
      </div>

      <div id="data-usage">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h2>
        <p>
          SKYBER uses the collected data for various purposes to provide and maintain our services, notify you about 
          changes to our services, allow you to participate in interactive features, provide customer support, 
          and gather analysis or valuable information to improve our services.
        </p>

        <div id="service-provision">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Service Provision</h3>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our services</li>
          </ul>
        </div>

        <div id="communication">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Communication</h3>
          <ul>
            <li>To contact you with newsletters, marketing or promotional materials</li>
            <li>To respond to your inquiries and provide support</li>
            <li>To send you important service updates and notifications</li>
          </ul>
        </div>

        <div id="improvement">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Service Improvement</h3>
          <ul>
            <li>To monitor the usage of our services</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To improve our services and develop new features</li>
          </ul>
        </div>

        <div id="legal-compliance">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Legal Compliance</h3>
          <ul>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>To prevent or investigate possible wrongdoing</li>
          </ul>
        </div>
      </div>

      <div id="data-sharing">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Sharing and Disclosure</h2>
        <p>
          We may share your personal information in certain situations described in this policy. 
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as described below.
        </p>

        <div id="third-parties">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Third-Party Services</h3>
          <p>
            We may employ third-party companies and individuals to facilitate our services, provide services 
            on our behalf, perform service-related services, or assist us in analyzing how our services are used.
          </p>
          <p>
            These third parties have access to your Personal Data only to perform these tasks on our behalf 
            and are obligated not to disclose or use it for any other purpose.
          </p>
        </div>

        <div id="legal-requirements">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Legal Requirements</h3>
          <p>
            SKYBER may disclose your Personal Data in the belief that such action is necessary to:
          </p>
          <ul>
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of SKYBER</li>
            <li>Prevent or investigate possible wrongdoing in connection with our services</li>
            <li>Protect the personal safety of users of our services or the public</li>
            <li>Protect against legal liability</li>
          </ul>
        </div>

        <div id="business-transfers">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Business Transfers</h3>
          <p>
            If SKYBER is involved in a merger, acquisition, or asset sale, your Personal Data may be transferred. 
            We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
          </p>
        </div>
      </div>

      <div id="data-security">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Data Security</h2>
        <p>
          The security of your data is important to us. We implement appropriate technical and organizational 
          security measures to protect your personal information against unauthorized access, alteration, 
          disclosure, or destruction.
        </p>

        <div id="security-measures">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Security Measures</h3>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security updates and patches</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
        </div>

        <div id="data-retention">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Data Retention</h3>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. 
            We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, 
            resolve disputes, and enforce our legal agreements and policies.
          </p>
          <p>
            We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter 
            period of time, except when this data is used to strengthen the security or to improve the functionality 
            of our services, or we are legally obligated to retain this data for longer time periods.
          </p>
        </div>
      </div>

      <div id="your-rights">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information. 
          We are committed to ensuring you can exercise these rights effectively.
        </p>

        <div id="access">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Access and Portability</h3>
          <ul>
            <li>Request access to your personal information</li>
            <li>Request a copy of your data in a portable format</li>
            <li>Verify the accuracy of your personal information</li>
          </ul>
        </div>

        <div id="correction">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Correction and Deletion</h3>
          <ul>
            <li>Request correction of inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Request restriction of processing in certain circumstances</li>
          </ul>
        </div>

        <div id="objection">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Objection and Restriction</h3>
          <ul>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
        </div>

        <div id="withdrawal">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Consent Withdrawal</h3>
          <p>
            Where we rely on your consent to process your personal information, you have the right to withdraw 
            that consent at any time. Withdrawing consent will not affect the lawfulness of any processing 
            we conducted prior to your withdrawal.
          </p>
        </div>
      </div>

      <div id="international-transfers">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>International Data Transfers</h2>
        <p>
          Your information, including Personal Data, may be transferred to — and maintained on — computers 
          located outside of your state, province, country, or other governmental jurisdiction where the data 
          protection laws may differ from those of your jurisdiction.
        </p>

        <div id="gdpr-compliance">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>GDPR Compliance</h3>
          <p>
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights. 
            SKYBER aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
          </p>
          <p>
            We ensure that any international transfers of your personal data comply with GDPR requirements 
            through appropriate safeguards such as Standard Contractual Clauses or adequacy decisions.
          </p>
        </div>

        <div id="ccpa-compliance">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>CCPA Compliance</h3>
          <p>
            If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA). 
            These rights include the right to know what personal information is collected, the right to delete 
            personal information, and the right to opt-out of the sale of personal information.
          </p>
        </div>
      </div>

      <div id="children-privacy">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Children&apos;s Privacy</h2>
        <p>
          Our services do not address anyone under the age of 13. We do not knowingly collect personally 
          identifiable information from anyone under the age of 13. If you are a parent or guardian and 
          you are aware that your child has provided us with Personal Data, please contact us.
        </p>

        <div id="coppa-compliance">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>COPPA Compliance</h3>
          <p>
            We comply with the Children&apos;s Online Privacy Protection Act (COPPA) and do not knowingly collect 
            personal information from children under 13 without parental consent. If we become aware that 
            we have collected personal information from a child under 13 without parental consent, 
            we will take steps to delete such information.
          </p>
        </div>

        <div id="parental-controls">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Parental Controls</h3>
          <p>
            Parents and guardians can review, request deletion of, or refuse further collection of their 
            child&apos;s personal information. If you believe we have collected information from a child under 13, 
            please contact us immediately.
          </p>
        </div>
      </div>

      <div id="policy-updates">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Policy Updates</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this policy.
        </p>

        <div id="notification">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Change Notification</h3>
          <p>
            We will notify you of any material changes to this Privacy Policy by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending an email to your registered email address</li>
            <li>Displaying a prominent notice on our services</li>
          </ul>
        </div>

        <div id="acceptance">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Acceptance of Changes</h3>
          <p>
            Your continued use of our services after any changes to this Privacy Policy constitutes 
            acceptance of those changes. We encourage you to review this Privacy Policy periodically 
            to stay informed about how we protect your information.
          </p>
        </div>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>

        <div id="data-protection-officer">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Data Protection Officer</h3>
          <p>
            For privacy-related inquiries and to exercise your data protection rights, 
            you can contact our Data Protection Officer:
          </p>
          <ul>
            <li>Email: support@skyber.codes</li>
            <li>Mobile: +91 62394 35836 (Premium tier only)</li>
            <li>Chat: LUMI - Advanced AI Chat Support</li>
            <li>Address: Mandhana, Kanpur, Uttar Pradesh - 209217</li>
          </ul>
        </div>

        <div id="complaints">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Complaints and Disputes</h3>
          <p>
            If you have concerns about how we handle your personal information, you have the right to:
          </p>
          <ul>
            <li>Contact us directly to resolve the issue</li>
            <li>Lodge a complaint with your local data protection authority</li>
            <li>Seek legal remedies under applicable data protection laws</li>
          </ul>
          <p>
            We are committed to working with you to resolve any privacy concerns you may have.
          </p>
        </div>
      </div>
    </PolicyTemplate>
  );
}

