import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – gmmx.app",
  description: "Read the Terms of Service for using GMMX, the fitness business management platform. Covers account responsibilities, acceptable use, and billing terms.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-bold text-[#FF5C73] uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-12">
          Last updated: July 14, 2026
        </p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-[#FF5C73] prose-a:no-underline hover:prose-a:underline">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the GMMX platform at gmmx.app (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            GMMX is a cloud-based fitness business management platform that enables business owners to manage members, payments, attendance, staff, and generate business websites. The Service is provided on a subscription basis with a free trial period.
          </p>

          <h2>3. Account Registration</h2>
          <ul>
            <li>You must provide accurate and complete information during registration</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must be at least 18 years old to create an account</li>
            <li>One person or legal entity may not create more than one free account</li>
            <li>You are responsible for all activities that occur under your account</li>
          </ul>

          <h2>4. Subscription & Billing</h2>
          <ul>
            <li>The Service offers a 14-day free trial for all new accounts</li>
            <li>After the trial period, you must select a paid subscription plan to continue using the Service</li>
            <li>Subscription fees are billed monthly or annually, depending on the plan selected</li>
            <li>All fees are non-refundable except as described in our Refund Policy</li>
            <li>We reserve the right to change pricing with 30 days advance notice</li>
          </ul>

          <h2>5. Data Ownership</h2>
          <p>
            You retain full ownership of all data you enter into the platform, including member records, payment records, and business information. We do not claim any intellectual property rights over your content.
          </p>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Attempt to gain unauthorized access to other accounts or systems</li>
            <li>Resell or redistribute the Service without authorization</li>
            <li>Use the Service to send unsolicited communications (spam)</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
          </ul>

          <h2>7. Service Availability</h2>
          <p>
            We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may perform maintenance that temporarily affects availability. We will provide reasonable notice for planned maintenance.
          </p>

          <h2>8. Termination</h2>
          <ul>
            <li>You may cancel your subscription at any time from your billing dashboard</li>
            <li>We may suspend or terminate accounts that violate these terms</li>
            <li>Upon termination, your data will be retained for 30 days, after which it may be deleted</li>
            <li>You may request a data export before account termination</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, GMMX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless GMMX, its founders, employees, and affiliates from any claims, damages, or expenses arising from your use of the Service or violation of these terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes via email or through the platform. Continued use of the Service after changes constitutes acceptance of the revised terms.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:gmmxapp@gmail.com">gmmxapp@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
