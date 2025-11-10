"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections: Array<{ id: string; title: string; level: 1 | 2 | 3 }> = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "what-are-cookies", title: "What Are Cookies", level: 1 },
  { id: "how-we-use-cookies", title: "How We Use Cookies", level: 1 },
  { id: "types-of-cookies", title: "Types of Cookies We Use", level: 1 },
  { id: "essential-cookies", title: "Essential Cookies", level: 2 },
  { id: "functional-cookies", title: "Functional Cookies", level: 2 },
  { id: "analytics-cookies", title: "Analytics Cookies", level: 2 },
  { id: "marketing-cookies", title: "Marketing Cookies", level: 2 },
  { id: "third-party-cookies", title: "Third-Party Cookies", level: 1 },
  { id: "cookie-management", title: "Managing Your Cookie Preferences", level: 1 },
  { id: "browser-settings", title: "Browser Settings", level: 2 },
  { id: "opt-out", title: "Opt-Out Options", level: 2 },
  { id: "updates", title: "Policy Updates", level: 1 },
  { id: "contact", title: "Contact Information", level: 1 }
];

export default function CookiePolicyPage() {
  return (
    <PolicyTemplate
      title="Cookie Policy"
      description="This Cookie Policy explains how SKYBER uses cookies and similar technologies on our website and applications."
      lastUpdated="January 15, 2024"
      readingTime="10 minutes"
      category="Legal Compliance"
      sections={sections}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          This Cookie Policy explains how SKYBER uses cookies and similar tracking technologies 
          when you visit our website or use our applications. It describes what cookies are, 
          how we use them, and how you can manage your cookie preferences.
        </p>
        <p>
          By continuing to use our website, you consent to our use of cookies in accordance 
          with this policy. If you do not agree to our use of cookies, you should set your 
          browser settings accordingly or refrain from using our website.
        </p>
      </div>

      <div id="what-are-cookies">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
          when you visit a website. They help websites remember information about your visit, such as 
          your preferred language and other settings, which can make your next visit easier and more useful.
        </p>
        <p>
          Cookies can be set by the website you are visiting (first-party cookies) or by third-party 
          services that the website uses (third-party cookies). They can remain on your device for 
          different periods of time, from the duration of your browsing session to several years.
        </p>
      </div>

      <div id="how-we-use-cookies">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Cookies</h2>
        <p>
          We use cookies for several purposes, including:
        </p>
        <ul>
          <li>Making our website work properly and efficiently</li>
          <li>Remembering your preferences and settings</li>
          <li>Analyzing how our website is used to improve it</li>
          <li>Providing personalized content and advertisements</li>
          <li>Ensuring the security of our website</li>
        </ul>
        <p>
          The specific cookies we use and their purposes are detailed in the sections below.
        </p>
      </div>

      <div id="types-of-cookies">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Types of Cookies We Use</h2>
        <p>
          We use different types of cookies for different purposes. Each type of cookie serves 
          a specific function and helps us provide you with the best possible experience.
        </p>

        <div id="essential-cookies">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable basic 
            functions like page navigation, access to secure areas, and form submissions. 
            The website cannot function properly without these cookies.
          </p>
          <p>
            Examples include:
          </p>
          <ul>
            <li>Authentication cookies that keep you logged in</li>
            <li>Security cookies that protect against fraud</li>
            <li>Session cookies that maintain your browsing session</li>
          </ul>
        </div>

        <div id="functional-cookies">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering 
            your preferences, language settings, and region. They may be set by us or by third-party 
            providers whose services we have added to our pages.
          </p>
          <p>
            Examples include:
          </p>
          <ul>
            <li>Language preference cookies</li>
            <li>Theme and layout preference cookies</li>
            <li>Form auto-fill cookies</li>
          </ul>
        </div>

        <div id="analytics-cookies">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. This helps us improve our website and services.
          </p>
          <p>
            Examples include:
          </p>
          <ul>
            <li>Google Analytics cookies that track page views and user behavior</li>
            <li>Performance monitoring cookies</li>
            <li>Error tracking cookies</li>
          </ul>
        </div>

        <div id="marketing-cookies">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites to display relevant and 
            engaging advertisements. They may also be used to limit the number of times you see 
            an advertisement and measure the effectiveness of advertising campaigns.
          </p>
          <p>
            Examples include:
          </p>
          <ul>
            <li>Social media advertising cookies</li>
            <li>Retargeting cookies</li>
            <li>Conversion tracking cookies</li>
          </ul>
        </div>
      </div>

      <div id="third-party-cookies">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report 
          usage statistics, deliver advertisements, and provide other services on our website.
        </p>
        <p>
          These third-party cookies include:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
          <li><strong>Social Media Platforms:</strong> For social media integration and sharing</li>
          <li><strong>Advertising Networks:</strong> For displaying relevant advertisements</li>
          <li><strong>Payment Processors:</strong> For secure payment processing</li>
        </ul>
        <p>
          These third parties have their own privacy policies and cookie policies. We encourage 
          you to review their policies to understand how they use cookies and your information.
        </p>
      </div>

      <div id="cookie-management">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Managing Your Cookie Preferences</h2>
        <p>
          You have several options for managing cookies and similar technologies. You can choose 
          to accept or decline cookies, and you can modify your browser settings to automatically 
          reject cookies or to notify you when a cookie is being set.
        </p>

        <div id="browser-settings">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. 
            To learn more about how to manage cookies, visit the help section of your browser.
          </p>
          <p>
            Common browser settings include:
          </p>
          <ul>
            <li>Blocking all cookies</li>
            <li>Blocking only third-party cookies</li>
            <li>Deleting cookies when you close your browser</li>
            <li>Being notified before a cookie is set</li>
          </ul>
        </div>

        <div id="opt-out">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Opt-Out Options</h3>
          <p>
            For certain types of cookies, you can opt out through third-party services:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Use the Google Analytics Opt-out Browser Add-on</li>
            <li><strong>Advertising:</strong> Visit the Digital Advertising Alliance or Network Advertising Initiative</li>
            <li><strong>Social Media:</strong> Adjust your privacy settings on social media platforms</li>
          </ul>
          <p>
            Please note that if you choose to opt out of certain cookies, some features of our 
            website may not function properly.
          </p>
        </div>
      </div>

      <div id="updates">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Policy Updates</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our practices 
          or for other operational, legal, or regulatory reasons. We will notify you of any material 
          changes by posting the updated policy on our website.
        </p>
        <p>
          Your continued use of our website after any changes to this Cookie Policy constitutes 
          acceptance of those changes. We encourage you to review this policy periodically to 
          stay informed about how we use cookies.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact Information</h2>
        <p>
          If you have any questions about this Cookie Policy or our use of cookies, please contact us:
        </p>
        <ul>
          <li>Email: support@skyber.codes</li>
          <li>Mobile: +91 62394 35836 (Premium tier only)</li>
          <li>Chat: LUMI - Advanced AI Chat Support</li>
          <li>Address: Mandhana, Kanpur, Uttar Pradesh - 209217</li>
        </ul>
        <p>
          For technical support or questions about our website functionality, please contact 
          our support team at support@skyber.codes.
        </p>
      </div>
    </PolicyTemplate>
  );
}

