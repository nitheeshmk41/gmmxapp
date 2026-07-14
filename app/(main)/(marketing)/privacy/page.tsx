import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – gmmx.app",
  description: "Learn how GMMX collects, uses, and protects your personal information. Our Privacy Policy covers data handling, cookies, and your rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-bold text-[#FF5C73] uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-12">
          Last updated: July 14, 2026
        </p>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-[#FF5C73] prose-a:no-underline hover:prose-a:underline">
          <h2>1. Introduction</h2>
          <p>
            GMMX (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the gmmx.app platform, a fitness business management service. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account information:</strong> Name, email address, password, phone number</li>
            <li><strong>Business information:</strong> Business name, address, subdomain, business type</li>
            <li><strong>Member data:</strong> Names, phone numbers, email addresses, membership details (entered by business owners)</li>
            <li><strong>Payment information:</strong> Transaction records, payment method details (processed by Razorpay)</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, features used, time spent on the platform</li>
            <li><strong>Device information:</strong> Browser type, operating system, IP address</li>
            <li><strong>Cookies:</strong> Session cookies for authentication, preference cookies for settings</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our platform services</li>
            <li>To process transactions and send related information</li>
            <li>To send administrative notifications (expiry reminders, payment confirmations)</li>
            <li>To respond to customer support requests</li>
            <li>To improve our platform and develop new features</li>
            <li>To detect and prevent fraud and abuse</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li><strong>Razorpay:</strong> For payment processing</li>
            <li><strong>Appwrite:</strong> For data storage and authentication infrastructure</li>
            <li><strong>Email providers:</strong> For sending transactional emails</li>
            <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL/TLS encryption, secure session management, and access controls. All data is stored in secured infrastructure with regular backups.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, we will delete or anonymize your data within 90 days, except where retention is required by law.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability (export your data)</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. These cookies are necessary for the platform to function and cannot be disabled. We do not use advertising or tracking cookies.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:gmmxapp@gmail.com">gmmxapp@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
