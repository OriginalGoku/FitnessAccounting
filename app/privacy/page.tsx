import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FitBooks",
  description: "FitBooks privacy policy.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: February 2026
      </p>

      <div className="prose prose-gray mt-8 max-w-none text-sm leading-relaxed">
        <h2>1. Information We Collect</h2>
        <p>
          When you use our website, we may collect the following information:
        </p>
        <ul>
          <li>
            <strong>Contact form submissions:</strong> name, email address,
            business type, and any message you provide.
          </li>
          <li>
            <strong>Chat conversations:</strong> messages you send through our
            chat assistant are processed by OpenAI and stored to improve the
            quality of our service.
          </li>
          <li>
            <strong>Usage data:</strong> standard web server logs including IP
            address, browser type, and pages visited.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To respond to your inquiries and provide bookkeeping services.</li>
          <li>To manage leads and follow-ups via our CRM (HubSpot).</li>
          <li>To improve our chat assistant and website experience.</li>
          <li>To protect against spam and abuse (via Cloudflare Turnstile).</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services to operate this website:</p>
        <ul>
          <li>
            <strong>HubSpot</strong> &mdash; customer relationship management
            and form processing.
          </li>
          <li>
            <strong>OpenAI</strong> &mdash; powers our chat assistant. Chat
            messages are sent to OpenAI for processing and may be stored.
          </li>
          <li>
            <strong>Cloudflare</strong> &mdash; security, performance, and bot
            protection.
          </li>
          <li>
            <strong>Sanity</strong> &mdash; content management for our blog.
          </li>
          <li>
            <strong>Vercel</strong> &mdash; website hosting.
          </li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          We retain your contact information for as long as necessary to provide
          our services and follow up on inquiries. Chat conversations may be
          retained by OpenAI in accordance with their data retention policies.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          information at any time by contacting us. We will respond to your
          request within a reasonable timeframe.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have questions about this privacy policy, please reach out
          through our contact form or email us directly.
        </p>
      </div>
    </main>
  );
}
