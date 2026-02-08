export class HubSpotError extends Error {
  status: number;
  bodyText: string;

  constructor(message: string, status: number, bodyText: string) {
    super(message);
    this.name = "HubSpotError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

type HubSpotBase = "crm" | "forms";

const BASE_URL: Record<HubSpotBase, string> = {
  crm: "https://api.hubapi.com",
  forms: "https://api.hsforms.com",
};

// Private App token is used as: Authorization: Bearer <token> for HubSpot APIs.  [oai_citation:0‡HubSpot Developers](https://developers.hubspot.com/blog/a-developers-guide-to-hubspot-crm-objects-company-object)
function crmAuthHeaders() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) throw new Error("Missing HUBSPOT_PRIVATE_APP_TOKEN in env");
  return { Authorization: `Bearer ${token}` };
}

export async function hsFetch<T = any>(
  base: HubSpotBase,
  path: string,
  init: RequestInit & { json?: any; auth?: boolean } = {},
): Promise<T> {
  const url = `${BASE_URL[base]}${path}`;

  const auth = init.auth ?? base === "crm"; // default: CRM needs auth, forms submit usually doesn't
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as any),
    ...(auth ? crmAuthHeaders() : {}),
  };

  let body: any = init.body;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[hsFetch] HubSpot request failed", {
      base,
      path,
      status: res.status,
      correlationId: res.headers.get("x-hubspot-correlation-id"),
    });
    throw new HubSpotError(
      `HubSpot ${path} failed ${res.status}`,
      res.status,
      text,
    );
  }

  // Some endpoints return empty body. Try JSON, fallback to text.
  try {
    return (text ? JSON.parse(text) : ({} as any)) as T;
  } catch {
    return text as any as T;
  }
}

// Optional convenience wrappers if you want them
export const hsCrmGet = <T = any>(path: string) =>
  hsFetch<T>("crm", path, { method: "GET" });
export const hsCrmPost = <T = any>(path: string, json: any) =>
  hsFetch<T>("crm", path, { method: "POST", json });
// export class HubSpotError extends Error {
//   status: number;
//   body: string;
//   url: string;

//   constructor(message: string, status: number, body: string, url: string) {
//     super(message);
//     this.status = status;
//     this.body = body;
//     this.url = url;
//   }
// }

// const HUBSPOT_FORMS_BASE = "https://api.hsforms.com"; // IMPORTANT
// const HUBSPOT_CRM_BASE = "https://api.hubapi.com";

// function getToken() {
//   const t = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
//   if (!t) throw new Error("Missing env HUBSPOT_PRIVATE_APP_TOKEN");
//   return t;
// }

// export async function hsFormsPost(path: string, payload: any) {
//   const url = `${HUBSPOT_FORMS_BASE}${path}`;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`, // secure/submit expects auth  [oai_citation:1‡Webflow](https://webflow.com/blog/hubspot-webflow-client-campaign-workflows)
//     },
//     body: JSON.stringify(payload),
//   });

//   const text = await res.text();

//   if (!res.ok) {
//     throw new HubSpotError(`HubSpot FORMS failed ${res.status}`, res.status, text, url);
//   }

//   // forms API often returns JSON, but we keep it flexible
//   try {
//     return text ? JSON.parse(text) : {};
//   } catch {
//     return { raw: text };
//   }
// }

// // Keep CRM calls separate so you don’t mix domains by accident
// export async function hsCrmGet(path: string) {
//   const url = `${HUBSPOT_CRM_BASE}${path}`;

//   const res = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });

//   const text = await res.text();

//   if (!res.ok) {
//     throw new HubSpotError(`HubSpot CRM failed ${res.status}`, res.status, text, url);
//   }

//   return text ? JSON.parse(text) : {};
// }

// // Low-level HubSpot HTTP client
// export class HubSpotError extends Error {
//   status: number;
//   body: any;
//   constructor(message: string, status: number, body: any) {
//     super(message);
//     this.status = status;
//     this.body = body;
//   }
// }

// const BASE = "https://api.hubapi.com";

// function getToken() {
//   const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
//   if (!token) throw new Error("Missing HUBSPOT_PRIVATE_APP_TOKEN");
//   return token;
// }

// export async function hsFetch<T>(
//   path: string,
//   init: RequestInit & { json?: any } = {},
// ): Promise<T> {
//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${getToken()}`,
//     "Content-Type": "application/json",
//     ...(init.headers as Record<string, string> | undefined),
//   };

//   const res = await fetch(`${BASE}${path}`, {
//     ...init,
//     headers,
//     body: init.json ? JSON.stringify(init.json) : init.body,
//   });

//   const text = await res.text();
//   const body = text ? safeJsonParse(text) : null;

//   if (!res.ok) {
//     throw new HubSpotError(
//       `HubSpot ${path} failed ${res.status}`,
//       res.status,
//       body,
//     );
//   }

//   return body as T;
// }

// function safeJsonParse(s: string) {
//   try {
//     return JSON.parse(s);
//   } catch {
//     return s;
//   }
// }
