import type { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT, BOOTSTRAP_INSTRUCTION } from './_lib/systemPrompt';
import { checkRateLimit } from './_lib/rateLimit';
import { rememberPersona, recallPersona } from './_lib/personaCache';

dotenv.config();

// OpenAI-compatible Claude Max relay (e.g. localhost:3456 on the deepblue box).
// Set OPENAI_BASE_URL to the proxy root that exposes /v1/chat/completions.
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? 'http://localhost:3456';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
const MODEL = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';

const MAX_INPUT_CHARS = 500;
const MIN_DATE = '1500-01-01';

type Msg = { role: 'user' | 'assistant'; text: string };
type Body = {
  date: string;
  sessionId: string;
  bootstrap?: boolean;
  messages?: Msg[];
};

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function isValidDate(d: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return false;
  if (d < MIN_DATE) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (d > today) return false;
  return true;
}

function clientIp(req: IncomingMessage): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

function buildPersonaContext(date: string, sessionId: string, persona: string | null): string {
  if (!persona) {
    return `[TIME_DIAL: ${date}]\n[SESSION: ${sessionId}]\n[BOOTSTRAP]\n\n${BOOTSTRAP_INSTRUCTION}`;
  }
  return `[TIME_DIAL: ${date}]\n[SESSION: ${sessionId}]\n[PERSONA: ${persona}]\n\n(Stay in this persona for the entire conversation. Respond in plain text as this person would. Do not output JSON.)`;
}

class UpstreamError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`upstream ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function chatCompletion(messages: ChatMessage[], maxTokens: number): Promise<string> {
  const url = `${OPENAI_BASE_URL.replace(/\/$/, '')}/v1/chat/completions`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (OPENAI_API_KEY) headers['Authorization'] = `Bearer ${OPENAI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages }),
  });

  const text = await res.text();
  if (!res.ok) throw new UpstreamError(res.status, text);

  let parsed: { choices?: Array<{ message?: { content?: string } }> };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new UpstreamError(res.status, `non-json response: ${text.slice(0, 200)}`);
  }
  const content = parsed.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new UpstreamError(502, `missing content in upstream response: ${text.slice(0, 200)}`);
  }
  return content;
}

function parseBootstrapReply(raw: string): { persona: string; opening: string } | null {
  const trimmed = raw.trim();
  const stripped = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  try {
    const parsed = JSON.parse(stripped);
    if (
      parsed &&
      typeof parsed.persona === 'string' &&
      typeof parsed.opening === 'string' &&
      parsed.persona.trim() &&
      parsed.opening.trim()
    ) {
      return { persona: parsed.persona.trim(), opening: parsed.opening.trim() };
    }
  } catch {
    // fall through
  }
  const m = stripped.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const parsed = JSON.parse(m[0]);
      if (typeof parsed.persona === 'string' && typeof parsed.opening === 'string') {
        return { persona: parsed.persona.trim(), opening: parsed.opening.trim() };
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'method_not_allowed' });
  }

  const ip = clientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return send(res, 429, { error: 'rate_limited', retryAfter: rl.retryAfter });
  }

  let body: Body;
  try {
    const raw = await readBody(req);
    body = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: 'invalid_json' });
  }

  if (!body || typeof body !== 'object') return send(res, 400, { error: 'invalid_body' });
  if (typeof body.date !== 'string' || !isValidDate(body.date)) {
    return send(res, 400, { error: 'invalid_date', minDate: MIN_DATE });
  }
  if (typeof body.sessionId !== 'string' || body.sessionId.length < 8 || body.sessionId.length > 64) {
    return send(res, 400, { error: 'invalid_session' });
  }

  const isBootstrap = body.bootstrap === true;

  try {
    if (isBootstrap) {
      const userText = buildPersonaContext(body.date, body.sessionId, null);
      const raw = await chatCompletion(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userText },
        ],
        400,
      );
      const parsed = parseBootstrapReply(raw);
      if (!parsed) {
        return send(res, 502, { error: 'bootstrap_parse_failed', raw });
      }
      rememberPersona(body.sessionId, parsed.persona);
      return send(res, 200, parsed);
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return send(res, 400, { error: 'missing_messages' });
    }
    for (const m of body.messages) {
      if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') {
        return send(res, 400, { error: 'invalid_message_shape' });
      }
      if (m.role === 'user' && m.text.length > MAX_INPUT_CHARS) {
        return send(res, 400, { error: 'message_too_long', maxChars: MAX_INPUT_CHARS });
      }
    }

    let persona = recallPersona(body.sessionId);

    if (!persona) {
      const seedText = buildPersonaContext(body.date, body.sessionId, null);
      const seedRaw = await chatCompletion(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: seedText },
        ],
        400,
      );
      const parsed = parseBootstrapReply(seedRaw);
      if (!parsed) {
        return send(res, 502, { error: 'persona_seed_failed' });
      }
      persona = parsed.persona;
      rememberPersona(body.sessionId, persona);
    }

    const prefix = buildPersonaContext(body.date, body.sessionId, persona);
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...body.messages.map((m, i) => ({
        role: m.role,
        content: i === 0 && m.role === 'user' ? `${prefix}\n\n${m.text}` : m.text,
      })),
    ];

    const reply = (await chatCompletion(chatMessages, 350)).trim();
    if (!reply) {
      return send(res, 502, { error: 'empty_reply' });
    }
    return send(res, 200, { reply, persona });
  } catch (err) {
    if (err instanceof UpstreamError) {
      if (err.status === 429) return send(res, 503, { error: 'upstream_rate_limited' });
      return send(res, 502, { error: 'upstream_error', status: err.status, message: err.body.slice(0, 300) });
    }
    const message = err instanceof Error ? err.message : 'unknown';
    return send(res, 500, { error: 'internal_error', message });
  }
}
