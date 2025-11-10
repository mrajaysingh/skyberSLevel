"use client";

import { PolicyTemplate } from "@/components/ui/policy-template";

const sections = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "methods", title: "Payment Methods (Online & Offline)", level: 1 },
  { id: "invoicing", title: "Invoicing and Billing Cycles", level: 1 },
  { id: "taxes", title: "Taxes and Currency", level: 1 },
  { id: "late-fees", title: "Late Payments and Fees", level: 1 },
  { id: "refunds", title: "Refunds & Cancellations", level: 1 },
  { id: "disputes", title: "Payment Disputes", level: 1 },
  { id: "contact", title: "Contact", level: 1 }
];

export default function PaymentBillingPolicyPage() {
  return (
    <PolicyTemplate
      title="Payment & Billing Policy"
      description="Details our accepted payment methods (online and offline), invoicing, taxes, and billing practices."
      lastUpdated="January 15, 2024"
      readingTime="8 minutes"
      category="Service Delivery"
      sections={sections.map(s => ({ ...s, level: s.level as 1 | 2 | 3 }))}
    >
      <div id="overview">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Overview</h2>
        <p>
          This policy explains how payments are processed, invoiced, and managed for SKYBER services.
        </p>
      </div>

      <div id="methods">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Payment Methods (Online & Offline)</h2>
        <ul>
          <li>Online: Credit/Debit Cards, Net Banking, UPI, PayPal (where supported)</li>
          <li>Offline: Bank Transfer (NEFT/RTGS/SWIFT), Cheque/Demand Draft, Purchase Orders where agreed</li>
        </ul>
        <p>
          Offline payments must reference the invoice number. Services may commence upon receipt or as
          defined in the contract.
        </p>
      </div>

      <div id="invoicing">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Invoicing and Billing Cycles</h2>
        <p>
          Invoices are issued per the order form or statement of work. Payment terms are typically
          Net 15/30 unless otherwise specified.
        </p>
      </div>

      <div id="taxes">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Taxes and Currency</h2>
        <p>
          Prices are exclusive of applicable taxes (e.g., GST/VAT). Currency and tax treatment are as
          stated in the invoice.
        </p>
      </div>

      <div id="late-fees">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Late Payments and Fees</h2>
        <p>
          Late payments may incur interest or late fees as allowed by law and contract. We may suspend
          service for accounts overdue beyond the grace period.
        </p>
      </div>

      <div id="refunds">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Refunds & Cancellations</h2>
        <p>
          See our Refund & Cancellation Policy for detailed terms. Eligible refunds are processed to the
          original payment method where possible.
        </p>
      </div>

      <div id="disputes">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Payment Disputes</h2>
        <p>
          Disputes must be raised within 10 days of invoice receipt. Contact support@skyber.codes with
          your invoice number and details.
        </p>
        <p>
          For immediate assistance, use LUMI - Advanced AI Chat Support.
        </p>
      </div>

      <div id="contact">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>Contact</h2>
        <p>Billing inquiries: support@skyber.codes</p>
        <p>For immediate assistance, use LUMI - Advanced AI Chat Support.</p>
      </div>
    </PolicyTemplate>
  );
}


