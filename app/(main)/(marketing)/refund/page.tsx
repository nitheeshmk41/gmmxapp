import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy – gmmx.app",
  description: "GMMX refund policy for subscription payments. Learn about eligibility, process, and timelines for refund requests.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-bold text-[#FF5C73] uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Refund Policy
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-12">
          Last updated: July 14, 2026
        </p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-[#FF5C73] prose-a:no-underline hover:prose-a:underline">
          <h2>1. Free Trial</h2>
          <p>
            All new accounts receive a 14-day free trial with full access to platform features. No payment information is required during the trial period. If you choose not to subscribe after the trial, your account will be downgraded automatically with no charges.
          </p>

          <h2>2. Subscription Refunds</h2>
          <p>
            We want you to be satisfied with GMMX. If you are not happy with the Service, you may request a refund under the following conditions:
          </p>
          <ul>
            <li><strong>Within 7 days of payment:</strong> Full refund, no questions asked</li>
            <li><strong>After 7 days:</strong> Refunds are considered on a case-by-case basis</li>
            <li><strong>Annual plans:</strong> Pro-rated refund for unused months within the first 30 days</li>
          </ul>

          <h2>3. Non-Refundable Items</h2>
          <ul>
            <li>Add-on purchases (SMS credits, WhatsApp messaging credits)</li>
            <li>Custom domain registration fees</li>
            <li>Data migration services</li>
            <li>Staff onboarding services</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>
            To request a refund, email us at <a href="mailto:gmmxapp@gmail.com">gmmxapp@gmail.com</a> with:
          </p>
          <ul>
            <li>Your registered email address</li>
            <li>Business name on your account</li>
            <li>Reason for the refund request</li>
            <li>Transaction ID or payment receipt (if available)</li>
          </ul>

          <h2>5. Refund Processing</h2>
          <ul>
            <li>Refund requests are processed within 5-7 business days</li>
            <li>Refunds are issued to the original payment method</li>
            <li>Bank processing time may add an additional 5-10 business days</li>
          </ul>

          <h2>6. Cancellation</h2>
          <p>
            You can cancel your subscription at any time from your billing dashboard. After cancellation:
          </p>
          <ul>
            <li>You retain access until the end of your current billing period</li>
            <li>Your data is preserved for 30 days after the subscription expires</li>
            <li>You may reactivate your account at any time during the 30-day grace period</li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            For refund-related questions, contact us at:{" "}
            <a href="mailto:gmmxapp@gmail.com">gmmxapp@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
