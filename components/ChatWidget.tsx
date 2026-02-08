"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  MessageCircle,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Role = "assistant" | "user";

type Message = {
  id: string;
  role: Role;
  text: string;
};

type ChatApiResponse = {
  ok?: boolean;
  code?: string;
  answer?: string;
  responseId?: string;
};

const chatErrorMessageByCode: Record<string, string> = {
  message_required: "Please enter a message.",
  message_too_long: "Message is too long. Please shorten it.",
  invalid_request: "Session reset. Please send your message again.",
  payload_too_large: "Message is too large. Please shorten it.",
  captcha_required:
    "Verification required. Please wait a moment and try again.",
  captcha_failed: "Verification failed. Please try again.",
  rate_limited: "Too many messages sent. Please wait a moment and retry.",
  provider_unavailable:
    "Assistant is temporarily unavailable. Please try again.",
  server_error: "Unexpected error. Please try again.",
  server_misconfigured: "Assistant is temporarily unavailable.",
  invalid_json: "Invalid request. Please try again.",
};

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I can answer questions about FitBooks services, pricing, and onboarding.",
};

function makeMessage(role: Role, text: string): Message {
  const random = Math.random().toString(36).slice(2, 10);
  return {
    id: `${Date.now()}-${random}`,
    role,
    text,
  };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  const startFreshChat = () => {
    setMessages([welcomeMessage]);
    setPreviousResponseId(null);
    setError(null);
    setInput("");
    setCaptchaToken("");
    turnstileRef.current?.reset();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) {
      return;
    }

    setInput("");
    setError(null);
    setMessages((current) => [...current, makeMessage("user", question)]);
    setIsLoading(true);

    // Include captchaToken only on the first message (no previousResponseId).
    const isFirstMessage = !previousResponseId;

    if (isFirstMessage && !captchaToken) {
      setError(chatErrorMessageByCode.captcha_required);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          previousResponseId,
          ...(isFirstMessage ? { captchaToken } : {}),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;
      const answer = data.answer;

      if (!response.ok || !data.ok || !answer) {
        if (data.code === "invalid_request") {
          setPreviousResponseId(null);
        }

        if (
          data.code === "captcha_failed" ||
          data.code === "captcha_required"
        ) {
          setCaptchaToken("");
          turnstileRef.current?.reset();
        }

        throw new Error(
          chatErrorMessageByCode[data.code ?? "server_error"] ??
            "Unable to answer right now.",
        );
      }

      if (data.responseId) {
        setPreviousResponseId(data.responseId);
      }

      setMessages((current) => [...current, makeMessage("assistant", answer)]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unexpected error while sending your question.";
      setError(message);
      setMessages((current) => [
        ...current,
        makeMessage(
          "assistant",
          "I had trouble answering that. Please try again, or use the contact form for urgent requests.",
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <Card className="flex h-[70vh] max-h-[640px] w-[calc(100vw-2rem)] flex-col overflow-hidden border-primary-100 shadow-2xl sm:w-[390px]">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  FitBooks Assistant
                </CardTitle>
                <CardDescription>
                  Ask about bookkeeping services and next steps.
                </CardDescription>
                <p className="mt-1 text-[10px] leading-tight text-slate-400">
                  Chats are recorded to improve the service and are processed in
                  accordance with our{" "}
                  <a href="/privacy" className="underline hover:text-slate-600">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startFreshChat}
                  disabled={isLoading}
                >
                  New
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 p-0">
            <ScrollArea className="h-full px-4 py-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm",
                        message.role === "user"
                          ? "rounded-br-md bg-primary-600 text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-800",
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-sm text-slate-600 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <p className="text-xs text-red-600" role="status">
                    {error}
                  </p>
                ) : null}

                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex-col gap-2 border-t border-slate-100 bg-white">
            {!previousResponseId && !captchaToken ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
                options={{ size: "compact", action: "chat" }}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
              />
            ) : null}
            <form
              onSubmit={onSubmit}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                aria-label="Your question"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canSubmit}
                aria-label="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl shadow-primary-200"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
