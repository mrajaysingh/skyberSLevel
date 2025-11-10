import { PolicyTemplate } from "@/components/ui/policy-template";

const sections: Array<{ id: string; title: string; level: 1 | 2 | 3 }> = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "refund-policy", title: "Refund Policy", level: 1 },
  { id: "cancellation-policy", title: "Cancellation Policy", level: 1 },
  { id: "refund-process", title: "Refund Process", level: 1 },
  { id: "cancellation-process", title: "Cancellation Process", level: 1 },
  { id: "exceptions", title: "Exceptions", level: 1 },
  { id: "contact-information", title: "Contact Information", level: 1 }
];

export default function RefundCancellationPolicy() {
  return (
    <PolicyTemplate
      title="Refund & Cancellation Policy"
      description="Our policies for refunds and service cancellations"
      lastUpdated="December 2024"
      readingTime="5 min read"
      category="Business & Service-Specific Policies"
      sections={sections}
    >
      <div className="space-y-8">
        <section id="overview">
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            At SKYBER, we strive to provide exceptional service and value to our clients. 
            This policy outlines our refund and cancellation procedures to ensure transparency 
            and fair treatment for all parties involved.
          </p>
        </section>

        <section id="refund-policy">
          <h2 className="text-2xl font-bold text-foreground mb-4">Refund Policy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Service-Based Refunds</h3>
              <p className="text-muted-foreground leading-relaxed">
                Refunds are provided based on the type of service and the stage of completion:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Web Development: 100% refund if cancelled within 48 hours of project initiation</li>
                <li>Cybersecurity Services: 75% refund if cancelled before security assessment completion</li>
                <li>Consultation Services: 100% refund if cancelled 24 hours before scheduled session</li>
                <li>Software Development: Refund based on project completion percentage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Digital Product Refunds</h3>
              <p className="text-muted-foreground leading-relaxed">
                Digital products and downloadable content are non-refundable unless defective 
                or not as described. In such cases, we will provide a replacement or full refund.
              </p>
            </div>
          </div>
        </section>

        <section id="cancellation-policy">
          <h2 className="text-2xl font-bold text-foreground mb-4">Cancellation Policy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Project Cancellation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Clients may cancel ongoing projects at any time with written notice. 
                Cancellation fees apply based on the work completed and resources allocated.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Subscription Cancellation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monthly and annual subscriptions can be cancelled at any time. 
                Cancellation takes effect at the end of the current billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Maintenance Contract Cancellation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Maintenance contracts require 30 days written notice for cancellation. 
                Services will continue until the end of the notice period.
              </p>
            </div>
          </div>
        </section>

        <section id="refund-process">
          <h2 className="text-2xl font-bold text-foreground mb-4">Refund Process</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Request Submission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Refund requests must be submitted in writing to our support team 
                with detailed explanation of the reason for the refund.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Review Period</h3>
              <p className="text-muted-foreground leading-relaxed">
                All refund requests are reviewed within 5-7 business days. 
                We may request additional information or documentation if needed.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Processing Time</h3>
              <p className="text-muted-foreground leading-relaxed">
                Approved refunds are processed within 10-15 business days. 
                The refund will be issued to the original payment method used.
              </p>
            </div>
          </div>
        </section>

        <section id="cancellation-process">
          <h2 className="text-2xl font-bold text-foreground mb-4">Cancellation Process</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Written Notice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cancellation requests must be submitted in writing via email or 
                through our client portal with at least 30 days advance notice.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Project Handover</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upon cancellation, we will provide a comprehensive handover package 
                including all project files, documentation, and progress reports.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Final Settlement</h3>
              <p className="text-muted-foreground leading-relaxed">
                A final invoice will be issued for completed work and any applicable 
                cancellation fees. Payment is due within 15 days of cancellation.
              </p>
            </div>
          </div>
        </section>

        <section id="exceptions">
          <h2 className="text-2xl font-bold text-foreground mb-4">Exceptions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Force Majeure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Refunds and cancellations may be affected by circumstances beyond our control, 
                including natural disasters, government actions, or technical failures.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Contract Violations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Refunds may be denied if the client has violated the terms of service 
                or engaged in fraudulent activities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Special Circumstances</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to make exceptions to this policy in special circumstances 
                on a case-by-case basis.
              </p>
            </div>
          </div>
        </section>

        <section id="contact-information">
          <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            For questions about our refund and cancellation policy, or to submit a request, 
            please contact us:
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p>Email: support@skyber.codes</p>
            <p>Phone: +91 89574 76865</p>
            <p>Response Time: Within 24 hours during business days</p>
          </div>
        </section>
      </div>
    </PolicyTemplate>
  );
}
