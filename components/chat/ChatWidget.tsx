"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

// The website assistant: a button in the corner that opens a small chat.
//
// It only talks to this site's own /api/chat. The address and key of the
// chatbot never reach the browser. The chat does not remember earlier
// questions (each one is answered on its own), which keeps answers tied to the
// approved content and keeps the cost predictable.

type Message = { id: number; role: "bot" | "user"; text: string };

const WELCOME =
  "Hi! I'm the YB University assistant. Ask me about the program, how it works, or what to expect.";
const SUGGESTIONS = ["What will I learn?", "How long does it take?", "Do I need yacht experience?"];
const MAX_MESSAGES = 60;
const SESSION_KEY = "yb-chat-session";

// One identifier per browser tab, so the team can tell two chats apart. It holds
// no personal data and disappears when the tab is closed.
function sessionId(): string {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && /^[A-Za-z0-9_-]{8,64}$/.test(saved)) return saved;
  } catch {
    // Storage can be blocked; a fresh id still works for this message.
  }
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  try {
    sessionStorage.setItem(SESSION_KEY, fresh);
  } catch {
    // Ignored on purpose.
  }
  return fresh;
}

// `ready` says whether the chatbot is connected (see chatEnabled in lib/site-env.ts).
// While it is not, the button and the window still show, but the window says the
// assistant is almost ready and points to the FAQ and the contact page. Nothing is
// sent anywhere and no message box is shown, so nobody can ask a question that
// would go unanswered. Connecting the chatbot switches this on by itself.
export function ChatWidget({ ready }: { ready: boolean }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "bot", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // Opening the chat puts the cursor in the message box, or on the close button
  // while the chatbot is not connected yet.
  useEffect(() => {
    if (!open) return;
    if (ready) field.current?.focus();
    else closeButton.current?.focus();
  }, [open, ready]);

  // Esc closes the chat and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  function push(role: Message["role"], text: string) {
    const id = nextId.current++;
    setMessages((previous) => [...previous, { id, role, text }].slice(-MAX_MESSAGES));
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    push("user", text);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionId(), page: window.location.pathname }),
      });
      const data = (await res.json().catch(() => null)) as { answer?: string; handoff?: boolean; error?: string } | null;
      if (res.ok && data?.answer) {
        push("bot", data.answer);
        if (data.handoff) push("bot", "If you'd like a person to follow up, type your email address here.");
      } else {
        push("bot", data?.error ?? "Sorry, something went wrong. Please try again.");
      }
    } catch {
      push("bot", "I couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
      field.current?.focus();
    }
  }

  return (
    <div className="print:hidden">
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="YB University assistant"
          className="fixed bottom-20 right-4 z-40 flex max-h-[min(34rem,calc(100svh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col border border-navy-900/20 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between gap-4 bg-navy-950 px-4 py-3 text-white">
            <div>
              <p className="eyebrow !text-sand">YB UNIVERSITY</p>
              <p className="h-display text-xl leading-tight">Ask us anything</p>
            </div>
            <button
              ref={closeButton}
              type="button"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                launcher.current?.focus();
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-white/80 transition-colors hover:text-white"
            >
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </header>

          {!ready ? (
            <div className="space-y-4 px-4 py-5">
              <p className="text-sm leading-relaxed text-navy-900/80">
                Our assistant is almost ready. For now you can read the answers to the questions people ask
                most, or write to our team.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/faq"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center border border-navy-900 bg-navy-900 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy-700"
                >
                  Read the FAQ
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center border border-navy-900/40 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-900 transition-colors hover:border-navy-900"
                >
                  Contact us
                </Link>
              </div>
            </div>
          ) : (
          <>
          <div ref={log} role="log" aria-live="polite" aria-label="Conversation" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[88%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === "user" ? "ml-auto bg-navy-900 text-white" : "bg-ivory text-navy-900"
                }`}
              >
                {message.text}
              </p>
            ))}
            {busy && (
              <p role="status" className="px-1 text-xs text-navy-900/60">
                Typing…
              </p>
            )}
            {messages.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="min-h-9 border border-navy-900/30 px-3 text-left text-xs text-navy-900 transition-colors hover:border-navy-900"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex gap-2 border-t border-navy-900/15 p-3"
          >
            <label htmlFor={`${panelId}-message`} className="sr-only">
              Your message
            </label>
            <input
              ref={field}
              id={`${panelId}-message`}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              autoComplete="off"
              placeholder="Type your question…"
              className="min-w-0 flex-1 border border-navy-900/30 bg-white px-3 py-2.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
            <button
              type="submit"
              disabled={busy || input.trim() === ""}
              className="min-h-11 border border-navy-900 bg-navy-900 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <p className="border-t border-navy-900/10 px-4 py-3 text-[0.7rem] leading-relaxed text-navy-900/60">
            Automated assistant: answers may be incomplete, so check anything important with our team. Please don&apos;t share
            passwords or payment details.{" "}
            <Link href="/contact" className="underline underline-offset-2">
              Contact us
            </Link>
            {" · "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy
            </Link>
          </p>
          </>
          )}
        </section>
      )}

      <button
        ref={launcher}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-2.5 border border-sand bg-navy-950 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition-colors duration-300 hover:bg-navy-800"
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-sand">
          <path d="M2 3h14v9H8l-4 3.5V12H2V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        {open ? "Close" : "Ask us"}
      </button>
    </div>
  );
}
