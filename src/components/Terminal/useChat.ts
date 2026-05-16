import { useCallback, useEffect, useRef, useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; text: string };

type ChatState = {
  date: string;
  sessionId: string;
  persona: string | null;
  messages: ChatMessage[];
  status: 'booting' | 'idle' | 'sending' | 'error';
  error: string | null;
};

function humanizeError(data: { error?: string }, status: number): string {
  switch (data.error) {
    case 'rate_limited':
      return 'too many requests — wait a minute';
    case 'message_too_long':
      return 'message too long';
    case 'upstream_timeout':
      return 'the line is silent — proxy not responding';
    case 'upstream_unreachable':
      return "can't reach the proxy — check ANTHROPIC_BASE_URL";
    case 'upstream_auth_failed':
      return 'auth rejected by proxy — check ANTHROPIC_API_KEY';
    case 'upstream_rate_limited':
      return 'upstream is throttling — wait a minute';
    case 'invalid_date':
      return 'date out of range';
    default:
      return status >= 500 ? `signal lost (${status})` : 'request rejected';
  }
}

const newSessionId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
  ).replace(/-/g, '').slice(0, 32);

export function useChat(initialDate: string) {
  const [state, setState] = useState<ChatState>({
    date: initialDate,
    sessionId: newSessionId(),
    persona: null,
    messages: [],
    status: 'booting',
    error: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Tracks the active bootstrap call so that quickly changing the dial cancels
  // the previous persona before it lands.
  const generationRef = useRef(0);

  const bootstrap = useCallback(async (date: string, sessionId: string) => {
    const gen = ++generationRef.current;
    setState((s) => ({
      ...s,
      date,
      sessionId,
      persona: null,
      messages: [],
      status: 'booting',
      error: null,
    }));

    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 60_000);

    try {
      const res = await fetch('/api/getBotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, sessionId, bootstrap: true }),
        signal: ac.signal,
      });
      clearTimeout(timeoutId);

      if (gen !== generationRef.current) return; // stale

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState((s) => ({ ...s, status: 'error', error: humanizeError(data, res.status) }));
        return;
      }
      const data: { persona: string; opening: string } = await res.json();
      setState((s) => ({
        ...s,
        persona: data.persona,
        messages: [{ role: 'assistant', text: data.opening }],
        status: 'idle',
      }));
    } catch (err) {
      clearTimeout(timeoutId);
      if (gen !== generationRef.current) return;
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      setState((s) => ({
        ...s,
        status: 'error',
        error: aborted ? 'no answer — line went dead' : 'signal lost',
      }));
    }
  }, []);

  // Initial bootstrap
  useEffect(() => {
    bootstrap(stateRef.current.date, stateRef.current.sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDate = useCallback(
    (date: string) => {
      bootstrap(date, newSessionId());
    },
    [bootstrap]
  );

  const reroll = useCallback(() => {
    bootstrap(stateRef.current.date, newSessionId());
  }, [bootstrap]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (stateRef.current.status !== 'idle') return;

    const messagesAfterUser: ChatMessage[] = [
      ...stateRef.current.messages,
      { role: 'user', text: trimmed },
    ];
    setState((s) => ({ ...s, messages: messagesAfterUser, status: 'sending', error: null }));

    const gen = generationRef.current;

    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 60_000);

    try {
      const res = await fetch('/api/getBotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: stateRef.current.date,
          sessionId: stateRef.current.sessionId,
          messages: messagesAfterUser,
        }),
        signal: ac.signal,
      });
      clearTimeout(timeoutId);

      if (gen !== generationRef.current) return; // dial changed mid-flight

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState((s) => ({ ...s, status: 'error', error: humanizeError(data, res.status) }));
        return;
      }
      const data: { reply: string; persona?: string } = await res.json();
      setState((s) => ({
        ...s,
        messages: [...s.messages, { role: 'assistant', text: data.reply }],
        persona: data.persona ?? s.persona,
        status: 'idle',
      }));
    } catch (err) {
      clearTimeout(timeoutId);
      if (gen !== generationRef.current) return;
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      setState((s) => ({
        ...s,
        status: 'error',
        error: aborted ? 'no answer — line went dead' : 'signal lost',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null, status: s.status === 'error' ? 'idle' : s.status }));
  }, []);

  return { state, setDate, reroll, send, clearError };
}
