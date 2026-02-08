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
      body: text,
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

export const hsCrmGet = <T = any>(path: string) =>
  hsFetch<T>("crm", path, { method: "GET" });
export const hsCrmPost = <T = any>(path: string, json: any) =>
  hsFetch<T>("crm", path, { method: "POST", json });
