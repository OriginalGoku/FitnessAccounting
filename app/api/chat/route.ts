import { NextRequest, NextResponse } from "next/server";
import { FITBOOKS_SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { checkRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { getClientIp, parseJsonBodyWithLimit } from "@/lib/security/request";

export const runtime = "nodejs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-nano";
const CHAT_REQUEST_MAX_BYTES = 8_192;
const CHAT_MESSAGE_MAX_LENGTH = 2_000;

const CHAT_RATE_LIMIT = {
  windowMs: 5 * 60_000,
  maxRequests: 20,
  blockMs: 10 * 60_000,
} as const;

type ChatRequestBody = {
  message?: unknown;
  previousResponseId?: unknown;
};

type OpenAIResponseOutputChunk = {
  type?: string;
  text?: string;
};

type OpenAIResponseOutputItem = {
  type?: string;
  content?: OpenAIResponseOutputChunk[];
};

type OpenAIResponseBody = {
  id?: string;
  output_text?: string;
  output?: OpenAIResponseOutputItem[];
};

type ChatSuccessResponse = {
  ok: true;
  code: "ok";
  answer: string;
  responseId: string | null;
};

type ChatErrorCode =
  | "server_misconfigured"
  | "invalid_json"
  | "payload_too_large"
  | "invalid_request"
  | "message_required"
  | "message_too_long"
  | "rate_limited"
  | "provider_unavailable"
  | "server_error";

type ChatErrorResponse = {
  ok: false;
  code: ChatErrorCode;
};

function extractResponseText(payload: OpenAIResponseBody): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks: string[] = [];
  for (const item of payload.output ?? []) {
    if (item.type !== "message" || !Array.isArray(item.content)) {
      continue;
    }

    for (const piece of item.content) {
      if (piece.type === "output_text" && typeof piece.text === "string") {
        chunks.push(piece.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function jsonError(
  status: number,
  code: ChatErrorCode,
  headers: Record<string, string>,
) {
  return NextResponse.json<ChatErrorResponse>(
    { ok: false, code },
    { status, headers },
  );
}

export async function POST(request: NextRequest) {
  const limitResult = checkRateLimit(
    `chat:${getClientIp(request)}`,
    CHAT_RATE_LIMIT,
  );
  const headers = rateLimitHeaders(limitResult);

  if (!limitResult.allowed) {
    return jsonError(429, "rate_limited", headers);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError(500, "server_misconfigured", headers);
  }

  const parsedBody = await parseJsonBodyWithLimit<ChatRequestBody>(
    request,
    CHAT_REQUEST_MAX_BYTES,
  );

  if (!parsedBody.ok) {
    return jsonError(
      parsedBody.code === "payload_too_large" ? 413 : 400,
      parsedBody.code,
      headers,
    );
  }

  const requestBody = parsedBody.data;
  const message =
    typeof requestBody.message === "string" ? requestBody.message.trim() : "";
  const previousResponseIdRaw =
    typeof requestBody.previousResponseId === "string" &&
    requestBody.previousResponseId.trim()
      ? requestBody.previousResponseId.trim()
      : undefined;

  if (!message) {
    return jsonError(400, "message_required", headers);
  }

  if (message.length > CHAT_MESSAGE_MAX_LENGTH) {
    return jsonError(400, "message_too_long", headers);
  }

  if (
    previousResponseIdRaw &&
    !/^resp_[A-Za-z0-9]+$/.test(previousResponseIdRaw)
  ) {
    return jsonError(400, "invalid_request", headers);
  }

  try {
    const openAIResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: FITBOOKS_SYSTEM_PROMPT,
        input: message,
        store: true,
        ...(previousResponseIdRaw
          ? { previous_response_id: previousResponseIdRaw }
          : {}),
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!openAIResponse.ok) {
      console.error("[/api/chat] OpenAI request failed", {
        status: openAIResponse.status,
      });

      if (openAIResponse.status === 400) {
        return jsonError(400, "invalid_request", headers);
      }

      return jsonError(502, "provider_unavailable", headers);
    }

    let payload: OpenAIResponseBody;
    try {
      payload = (await openAIResponse.json()) as OpenAIResponseBody;
    } catch {
      return jsonError(502, "provider_unavailable", headers);
    }

    const answer = extractResponseText(payload);
    if (!answer) {
      return jsonError(502, "provider_unavailable", headers);
    }

    return NextResponse.json<ChatSuccessResponse>(
      {
        ok: true,
        code: "ok",
        answer,
        responseId: payload.id ?? null,
      },
      {
        status: 200,
        headers,
      },
    );
  } catch (caughtError) {
    if (
      caughtError instanceof Error &&
      (caughtError.name === "TimeoutError" || caughtError.name === "AbortError")
    ) {
      return jsonError(504, "provider_unavailable", headers);
    }

    console.error("[/api/chat] Unexpected chat handler error");
    return NextResponse.json<ChatErrorResponse>(
      { ok: false, code: "server_error" },
      {
        status: 500,
        headers,
      },
    );
  }
}
