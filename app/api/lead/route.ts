import { NextRequest, NextResponse } from "next/server";
import { HubSpotDirectOrchestrator } from "@/lib/orchestration/hubspotOrchestrator";
import { HubSpotError } from "@/lib/hubspot/client";
import { checkRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import {
  getClientIp,
  parseJsonBodyWithLimit,
} from "@/lib/security/request";

const LEAD_REQUEST_MAX_BYTES = 10_240;

const LEAD_RATE_LIMIT = {
  windowMs: 10 * 60_000,
  maxRequests: 6,
  blockMs: 15 * 60_000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_MAX_AGE_MS = 5 * 60_000;

type LeadRequestBody = {
  email?: unknown;
  name?: unknown;
  businessType?: unknown;
  message?: unknown;
  pageUri?: unknown;
  pageName?: unknown;
  hutk?: unknown;
  captchaToken?: unknown;
};

type TurnstileVerification = {
  success?: boolean;
  hostname?: string;
  action?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

type LeadSuccessCode = "lead_submitted" | "lead_already_exists";
type LeadErrorCode =
  | "invalid_json"
  | "payload_too_large"
  | "invalid_request"
  | "captcha_required"
  | "captcha_failed"
  | "rate_limited"
  | "server_misconfigured"
  | "hubspot_unavailable"
  | "server_error";

type LeadSuccessResponse = {
  ok: true;
  code: LeadSuccessCode;
  existingContact: boolean;
};

type LeadErrorResponse = {
  ok: false;
  code: LeadErrorCode;
};

function normalizeOptionalString(
  value: unknown,
  maxLength: number,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, maxLength);
}

function jsonLeadError(
  status: number,
  code: LeadErrorCode,
  headers: Record<string, string>,
) {
  return NextResponse.json<LeadErrorResponse>(
    { ok: false, code },
    { status, headers },
  );
}

function isTurnstileFresh(challengeTs?: string): boolean {
  if (!challengeTs) {
    return true;
  }

  const challengeAt = Date.parse(challengeTs);
  if (Number.isNaN(challengeAt)) {
    return false;
  }

  return Date.now() - challengeAt <= TURNSTILE_MAX_AGE_MS;
}

function isAllowedTurnstileHostname(hostname?: string): boolean {
  const configured = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  if (!configured) {
    return true;
  }

  const allowedHostnames = configured
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedHostnames.length === 0) {
    return true;
  }

  if (!hostname) {
    return false;
  }

  return allowedHostnames.includes(hostname.toLowerCase());
}

function isAllowedTurnstileAction(action?: string): boolean {
  const expectedAction = process.env.TURNSTILE_EXPECTED_ACTION?.trim();
  if (!expectedAction) {
    return true;
  }

  return action === expectedAction;
}

function isTurnstileAccepted(verification: TurnstileVerification): boolean {
  if (!verification.success) {
    return false;
  }

  if (!isTurnstileFresh(verification.challenge_ts)) {
    return false;
  }

  if (!isAllowedTurnstileHostname(verification.hostname)) {
    return false;
  }

  if (!isAllowedTurnstileAction(verification.action)) {
    return false;
  }

  return true;
}

async function verifyTurnstile(
  secret: string,
  token: string,
  ip?: string,
): Promise<TurnstileVerification> {
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) {
    form.set("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    return { success: false };
  }

  try {
    return (await response.json()) as TurnstileVerification;
  } catch {
    return { success: false };
  }
}

export async function POST(req: NextRequest) {
  const limitResult = checkRateLimit(`lead:${getClientIp(req)}`, LEAD_RATE_LIMIT);
  const headers = rateLimitHeaders(limitResult);

  if (!limitResult.allowed) {
    return jsonLeadError(429, "rate_limited", headers);
  }

  const parsedBody = await parseJsonBodyWithLimit<LeadRequestBody>(
    req,
    LEAD_REQUEST_MAX_BYTES,
  );
  if (!parsedBody.ok) {
    return jsonLeadError(
      parsedBody.code === "payload_too_large" ? 413 : 400,
      parsedBody.code,
      headers,
    );
  }

  const body = parsedBody.data;
  const email = normalizeOptionalString(body.email, 254)?.toLowerCase();
  const name = normalizeOptionalString(body.name, 80);

  if (!email || !EMAIL_PATTERN.test(email) || !name) {
    return jsonLeadError(400, "invalid_request", headers);
  }

  const captchaToken = normalizeOptionalString(body.captchaToken, 2_000);
  if (!captchaToken) {
    return jsonLeadError(400, "captcha_required", headers);
  }

  const turnstileSecret = process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return jsonLeadError(500, "server_misconfigured", headers);
  }

  try {
    const verification = await verifyTurnstile(
      turnstileSecret,
      captchaToken,
      getClientIp(req),
    );

    if (!isTurnstileAccepted(verification)) {
      return jsonLeadError(400, "captcha_failed", headers);
    }

    const orchestrator = new HubSpotDirectOrchestrator();
    const result = await orchestrator.handleLead({
      name,
      email,
      businessType: normalizeOptionalString(body.businessType, 80),
      message: normalizeOptionalString(body.message, 2_000),
      pageUri: normalizeOptionalString(body.pageUri, 500),
      pageName: normalizeOptionalString(body.pageName, 120),
      hutk: normalizeOptionalString(body.hutk, 200),
    });

    const code: LeadSuccessCode = result.existingContact
      ? "lead_already_exists"
      : "lead_submitted";

    return NextResponse.json<LeadSuccessResponse>(
      {
        ok: true,
        code,
        existingContact: result.existingContact,
      },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    if (error instanceof HubSpotError) {
      console.error("[/api/lead] HubSpot request failed", {
        status: error.status,
      });
      return jsonLeadError(502, "hubspot_unavailable", headers);
    }

    console.error("[/api/lead] Unexpected lead handler error");
    return jsonLeadError(500, "server_error", headers);
  }
}
