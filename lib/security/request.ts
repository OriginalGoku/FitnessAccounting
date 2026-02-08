export type JsonBodyParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: "invalid_json" | "payload_too_large" };

export async function parseJsonBodyWithLimit<T>(
  request: Request,
  maxBytes: number,
): Promise<JsonBodyParseResult<T>> {
  const raw = await request.text();
  const size = new TextEncoder().encode(raw).length;

  if (size > maxBytes) {
    return { ok: false, code: "payload_too_large" };
  }

  if (!raw.trim()) {
    return { ok: false, code: "invalid_json" };
  }

  try {
    return { ok: true, data: JSON.parse(raw) as T };
  } catch {
    return { ok: false, code: "invalid_json" };
  }
}

export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp?.trim()) {
    return cfConnectingIp.trim();
  }

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor?.trim()) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp?.trim()) {
    return xRealIp.trim();
  }

  return "unknown";
}
