/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.hubspot.com https://*.hubspotusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src 'self' 'unsafe-inline' ${
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

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
