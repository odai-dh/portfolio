'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, Mail, GripHorizontal } from 'lucide-react';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const QUESTION_LIMIT = 5;
const STORAGE_KEY = 'odai_chat_usage';
const CONTACT_EMAIL = 'odai@odaidh.dev';
const CONTACT_LINKEDIN = 'https://www.linkedin.com/in/odai-dahi/';

const STARTERS = [
  'What is your tech stack?',
  'Tell me about Aeoflo',
  'What projects have you built?',
  'Are you open to work?',
];

type Message =
  | { type?: never; role: 'user' | 'assistant'; content: string }
  | { type: 'limit'; role: 'assistant'; content?: never };

function ContactCard() {
  return (
    <div className="flex justify-start w-full">
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%] space-y-3">
        <p className="text-sm font-medium text-foreground">You've used all 5 questions for today 👋</p>
        <p className="text-xs text-muted-foreground">Want to know more? Reach out to Odai directly — he'd love to hear from you.</p>
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            Send an email
          </a>
          <a
            href={CONTACT_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-medium hover:bg-muted active:opacity-80 transition-colors"
          >
            <LinkedInIcon className="w-3.5 h-3.5 flex-shrink-0" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

function getUsage(): { count: number; day: string } {
  if (typeof window === 'undefined') return { count: 0, day: '' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, day: '' };
    return JSON.parse(raw);
  } catch {
    return { count: 0, day: '' };
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function incrementUsage(current: { count: number; day: string }) {
  const today = getTodayKey();
  const next = { count: current.day === today ? current.count + 1 : 1, day: today };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  return next;
}

function loadTodayCount(): number {
  const usage = getUsage();
  return usage.day === getTodayKey() ? usage.count : 0;
}

const MIN_W = 300;
const MAX_W = 680;
const MIN_H = 320;
const MAX_H = 820;
const DEFAULT_W = 380;
const DEFAULT_H = 500;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: DEFAULT_W, h: DEFAULT_H });

  useEffect(() => { setQuestionsUsed(loadTodayCount()); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
  }, [size]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = resizeStart.current.x - e.clientX;
      const dy = resizeStart.current.y - e.clientY;
      setSize({
        w: Math.max(MIN_W, Math.min(MAX_W, resizeStart.current.w + dx)),
        h: Math.max(MIN_H, Math.min(MAX_H, resizeStart.current.h + dy)),
      });
    };
    const onUp = () => { isResizing.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const limitReached = questionsUsed >= QUESTION_LIMIT;
  const remaining = Math.max(0, QUESTION_LIMIT - questionsUsed);

  const appendLimitCard = useCallback(() => {
    setMessages(m => {
      if (m.some(msg => msg.type === 'limit')) return m;
      return [...m, { type: 'limit', role: 'assistant' } as Message];
    });
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    if (questionsUsed >= QUESTION_LIMIT) {
      appendLimitCard();
      return;
    }

    const userMsg: Message = { role: 'user', content: trimmedText };
    const conversationMessages = [...messages.filter(m => !m.type), userMsg] as { role: 'user' | 'assistant'; content: string }[];
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const usage = incrementUsage(getUsage());
    setQuestionsUsed(usage.count);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationMessages }),
      });

      if (!res.ok) {
        if (res.status === 429) { appendLimitCard(); return; }
        setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let content = '';
      setMessages(m => [...m, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        setMessages(m => [...m.slice(0, -1), { role: 'assistant', content }]);
      }

      if (usage.count >= QUESTION_LIMIT) {
        appendLimitCard();
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection error. Check your network and try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, questionsUsed, appendLimitCard]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {open && (
        <div
          className="flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{ width: size.w, height: size.h }}
        >
          {/* Resize handle */}
          <div
            onMouseDown={onResizeMouseDown}
            className="absolute top-0 left-0 w-5 h-5 cursor-nw-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 rounded-br-lg hover:bg-muted"
            title="Drag to resize"
          >
            <GripHorizontal className="w-3 h-3 text-muted-foreground rotate-45" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/40 flex-shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Ask about Odai</p>
              <p className="text-xs text-muted-foreground truncate">
                {limitReached
                  ? 'Limit reached · contact directly below'
                  : `${remaining} of ${QUESTION_LIMIT} questions left today`}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1 rounded hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-muted flex-shrink-0">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(questionsUsed / QUESTION_LIMIT) * 100}%` }}
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && !limitReached && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Hi! I can answer questions about Odai 👋
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {STARTERS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs px-3 py-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 && limitReached && <ContactCard />}

            {messages.map((m, i) => {
              if (m.type === 'limit') return <ContactCard key={i} />;
              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {m.content || <span className="opacity-40">▍</span>}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={`flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0 ${limitReached ? 'opacity-40 pointer-events-none' : ''}`}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={limitReached ? 'Limit reached' : 'Ask something…'}
              disabled={loading || limitReached}
              maxLength={400}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 min-w-0"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading || limitReached}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground disabled:opacity-30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Robot toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-primary text-primary-foreground transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat with AI about Odai"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <Bot className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
          </>
        )}
      </button>
    </div>
  );
}
