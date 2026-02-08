import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://*.hubspot.com https://*.hubspotusercontent.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      isDev ? "'unsafe-eval' " : ""
    }https://challenges.cloudflare.com https://*.hsforms.net`,
    "connect-src 'self' https://api.openai.com https://api.hubapi.com https://api.hsforms.com https://challenges.cloudflare.com https://*.sanity.io wss://*.sanity.io",
    "frame-src 'self' https://challenges.cloudflare.com https://*.hsforms.net",
    "form-action 'self' https://*.hubspot.com https://*.hsforms.com",
    "upgrade-insecure-requests",
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Match all pages but skip static files and API routes
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|fonts|contact).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
