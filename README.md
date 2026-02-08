# FitBooks Website

Production website for FitBooks, built with Next.js App Router and deployed to Vercel.

This project includes:
- Marketing site pages
- Lead capture flow to HubSpot
- AI chat powered by OpenAI
- Blog powered by Sanity
- Security hardening for API abuse and response leakage

## Stack

- `Next.js 16` (App Router)
- `React 19` + `TypeScript`
- `Tailwind CSS`
- `Sanity` (content + Studio)
- `HubSpot` (contacts/deals/forms integration)
- `OpenAI Responses API` (chat assistant)
- `Cloudflare Turnstile` (lead form bot protection)

## Features

### 1. Marketing Site

Main landing page and content sections are rendered from `app/page.tsx` and `components/*`.

### 2. Lead Capture -> HubSpot

Frontend form:
- `components/CTAForm.tsx`

API route:
- `app/api/lead/route.ts`

Flow:
1. Validates payload shape and size
2. Enforces per-IP rate limiting
3. Verifies Turnstile token with Cloudflare
4. Submits lead to HubSpot orchestration
5. Returns safe response codes only (no raw upstream error bodies)

HubSpot orchestration and clients:
- `lib/orchestration/hubspotOrchestrator.ts`
- `lib/hubspot/*.ts`

### 3. AI Chat Assistant

Frontend widget:
- `components/ChatWidget.tsx`

API route:
- `app/api/chat/route.ts`

Flow:
1. Validates payload shape and size
2. Enforces per-IP rate limiting
3. Calls OpenAI Responses API server-side
4. Returns safe response codes plus assistant answer

### 4. Blog + Sanity

Blog routes:
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`

Sanity config and schema:
- `sanity.config.ts`
- `sanity/schemaTypes/post.ts`
- `sanity/lib/client.ts`
- `sanity/lib/queries.ts`

Studio route:
- `app/studio/[[...tool]]/page.tsx`

In production, Studio is disabled by default unless `ENABLE_STUDIO=true`.

### 5. Contact Obfuscation

Email/phone are rendered as SVG paths from server routes:
- `app/contact/email.svg/route.ts`
- `app/contact/phone.svg/route.ts`

Values come from server env vars (`CONTACT_EMAIL`, `CONTACT_PHONE`).

## Security Controls (Implemented)

### API abuse protection

Shared limiter:
- `lib/security/rate-limit.ts`

Client IP extraction + body size parsing:
- `lib/security/request.ts`

Current limits:
- `/api/chat`: 20 requests / 5 minutes per IP, then temporary block
- `/api/lead`: 6 requests / 10 minutes per IP, then temporary block

### Input and response hardening

- Strict payload checks and max lengths on API routes
- Safe `code`-based API error contracts (no raw provider body leakage)
- Reduced logging of sensitive user payloads

### Browser security headers

Configured in `next.config.js`:
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

## Environment Variables

Create `.env.local` with the following keys.

### Required for runtime

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (example: `gpt-5-nano`)
- `HUBSPOT_PRIVATE_APP_TOKEN`
- `NEXT_PUBLIC_TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `CONTACT_EMAIL`
- `CONTACT_PHONE`

### Required for HubSpot form/deal behavior

- `HUBSPOT_PORTAL_ID`
- `HUBSPOT_FORM_GUID`
- `HUBSPOT_BUSINESS_TYPE_PROPERTY` (default internal name: `business_type`)

### Optional hardening / behavior controls

- `TURNSTILE_EXPECTED_ACTION` (recommended: `lead_submit`)
- `TURNSTILE_ALLOWED_HOSTNAMES` (comma-separated list of allowed hostnames)
- `ENABLE_STUDIO` (`true` to enable `/studio` in production)

### Optional helper script vars

- `HUBSPOT_ACCESS_TOKEN`
- `HUBSPOT_DEALS_PIPELINE_LABEL`
- `HUBSPOT_PIPELINE_MAP_FILE`

## Local Development

Install:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Type check:

```bash
npm run lint
```

Production build:

```bash
npm run build
npm run start
```

## API Contracts (Current)

### `POST /api/chat`

Success:
- `{ ok: true, code: "ok", answer: string, responseId: string | null }`

Error:
- `{ ok: false, code: "..." }`
- Possible codes: `server_misconfigured`, `invalid_json`, `payload_too_large`, `invalid_request`, `message_required`, `message_too_long`, `rate_limited`, `provider_unavailable`, `server_error`

### `POST /api/lead`

Success:
- `{ ok: true, code: "lead_submitted" | "lead_already_exists", existingContact: boolean }`

Error:
- `{ ok: false, code: "..." }`
- Possible codes: `invalid_json`, `payload_too_large`, `invalid_request`, `captcha_required`, `captcha_failed`, `rate_limited`, `server_misconfigured`, `hubspot_unavailable`, `server_error`

## Deployment Notes (Vercel + Cloudflare)

1. Deploy on Vercel with all required env vars.
2. Keep `ENABLE_STUDIO` unset in production unless needed.
3. Keep Cloudflare protections enabled:
- WAF managed rules
- Rate limiting for `/api/chat` and `/api/lead`
- Turnstile on lead form

## Utility Script

Generate HubSpot pipeline/stage mapping:

```bash
node scripts/hubspotPipelineMap.mjs
```

---
Built with ❤️ for fitness professionals who'd rather focus on their clients than their spreadsheets.
