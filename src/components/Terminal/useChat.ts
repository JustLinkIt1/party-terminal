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

    try {
      const res = await fetch('/api/getBotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, sessionId, bootstrap: true }),
      });

      if (gen !== generationRef.current) return; // stale

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState((s) => ({
          ...s,
          status: 'error',
          error: data.error === 'rate_limited' ? 'too many requests — wait a minute' : 'signal lost',
        }));
        return;
      }
      const data: { persona: string; opening: string } = await res.json();
      setState((s) => ({
        ...s,
        persona: data.persona,
        messages: [{ role: 'assistant', text: data.opening }],
        status: 'idle',
      }));
    } catch {
      if (gen !== generationRef.current) return;
      setState((s) => ({ ...s, status: 'error', error: 'signal lost' }));
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

    try {
      const res = await fetch('/api/getBotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: stateRef.current.date,
          sessionId: stateRef.current.sessionId,
          messages: messagesAfterUser,
        }),
      });

      if (gen !== generationRef.current) return; // dial changed mid-flight

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState((s) => ({
          ...s,
          status: 'error',
          error:
            data.error === 'rate_limited'
              ? 'too many requests — wait a minute'
              : data.error === 'message_too_long'
                ? 'message too long'
                : 'signal lost',
        }));
        return;
      }
      const data: { reply: string; persona?: string } = await res.json();
      setState((s) => ({
        ...s,
        messages: [...s.messages, { role: 'assistant', text: data.reply }],
        persona: data.persona ?? s.persona,
        status: 'idle',
      }));
    } catch {
      if (gen !== generationRef.current) return;
      setState((s) => ({ ...s, status: 'error', error: 'signal lost' }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null, status: s.status === 'error' ? 'idle' : s.status }));
  }, []);

  return { state, setDate, reroll, send, clearError };
}
