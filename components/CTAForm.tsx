// /components/CTAForm.tsx
// Client form component (calls the Hubspot API)

"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

type LeadApiSuccessCode = "lead_submitted" | "lead_already_exists";
type LeadApiErrorCode =
  | "invalid_json"
  | "payload_too_large"
  | "invalid_request"
  | "captcha_required"
  | "captcha_failed"
  | "rate_limited"
  | "server_misconfigured"
  | "hubspot_unavailable"
  | "server_error";

type LeadApiSuccess = {
  ok: true;
  code: LeadApiSuccessCode;
  existingContact: boolean;
};

type LeadApiError = {
  ok: false;
  code: LeadApiErrorCode;
};

type LeadApiResponse = LeadApiSuccess | LeadApiError;

const errorMessageByCode: Record<LeadApiErrorCode, string> = {
  invalid_json: "Invalid request. Please try again.",
  payload_too_large: "Message is too long. Please shorten it and try again.",
  invalid_request: "Please check your name and email, then try again.",
  captcha_required: "Please complete the captcha challenge.",
  captcha_failed: "Captcha verification failed. Please try again.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
  server_misconfigured: "Service is temporarily unavailable.",
  hubspot_unavailable: "Unable to submit right now. Please try again shortly.",
  server_error: "Unexpected error. Please try again shortly.",
};

export default function CTAForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    setSuccessMessage("");

    if (!captchaToken) {
      setStatus("error");
      setError(errorMessageByCode.captcha_required);
      return;
    }

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      businessType: String(form.get("businessType") ?? ""), // can be removed if not used
      message: String(form.get("message") ?? ""),
      pageUri: typeof window !== "undefined" ? window.location.href : undefined,
      pageName: "CTA Form",
      captchaToken,
    };

    let response: Response;

    try {
      response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      return;
    }

    let data: LeadApiResponse | null = null;
    try {
      data = (await response.json()) as LeadApiResponse;
    } catch {
      data = null;
    }

    if (!data) {
      setStatus("error");
      setError("Unexpected response. Please try again.");
      return;
    }

    if (!response.ok || !data.ok) {
      const code = data.ok ? "server_error" : data.code;
      setStatus("error");
      setError(errorMessageByCode[code]);

      if (code === "captcha_failed") {
        setCaptchaToken("");
      }
      return;
    }

    const message =
      data.code === "lead_already_exists"
        ? "We already received your request and will contact you shortly."
        : "Submitted. A member of our team will respond as soon as possible.";

    setSuccessMessage(message);
    setStatus("sent");
    setCaptchaToken(""); // reset token after success
    formEl.reset();
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="businessType"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Type of Business
        </label>
        <select
          id="businessType"
          name="businessType"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
        >
          <option value="">Select your business type</option>
          <option value="personal-trainer">Personal Trainer (1-on-1)</option>
          <option value="online-coach">Online Coach / Hybrid</option>
          <option value="group-fitness">Group Fitness Instructor</option>
          <option value="studio-owner">Studio / Gym Owner</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Tell us about your situation (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none"
          placeholder="Current pain points, how long you've been in business, etc."
        />
      </div>
      {/* CAPTCHA */}

      <div className="pt-2">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          options={{ action: "lead_submit" }}
          onSuccess={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken("")}
          onError={() => setCaptchaToken("")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full btn-primary text-lg py-4"
      >
        {status === "sending" ? "Sending..." : "Request Free Consultation"}
      </button>

      {status === "sent" ? (
        <p className="text-center text-sm text-green-700">{successMessage}</p>
      ) : null}

      {status === "error" ? (
        <p className="text-center text-sm text-red-700">{error}</p>
      ) : null}

      {/*<p className="text-center text-sm text-slate-500">
        Disclaimer: Information on this website is general information and
        bookkeeping education and not tax advice.
      </p>*/}
    </form>
  );
}
