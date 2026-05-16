import type { IncomingMessage, ServerResponse } from 'http';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT, BOOTSTRAP_INSTRUCTION } from './_lib/systemPrompt';
import { checkRateLimit } from './_lib/rateLimit';
import { rememberPersona, recallPersona } from './_lib/personaCache';

dotenv.config();

const MODEL = 'claude-sonnet-4-6';
const MAX_INPUT_CHARS = 500;
const MIN_DATE = '1500-01-01';

const client = new Anthropic();

type Msg = { role: 'user' | 'assistant'; text: string };
type Body = {
  date: string;
  sessionId: string;
  bootstrap?: boolean;
  messages?: Msg[];
};

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

function extractText(resp: Anthropic.Message): string {
  return resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

function parseBootstrapReply(raw: string): { persona: string; opening: string } | null {
  const trimmed = raw.trim();
  // Strip ```json fences if the model added them despite instructions
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
  // Last-ditch: find the first {...} block
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
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: userText }],
      });

      const raw = extractText(resp);
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
      if (m.text.length > MAX_INPUT_CHARS) {
        return send(res, 400, { error: 'message_too_long', maxChars: MAX_INPUT_CHARS });
      }
    }

    let persona = recallPersona(body.sessionId);

    // If we lost the persona (cold start, eviction), silently re-bootstrap once
    // using the session id as a seed and then continue.
    if (!persona) {
      const seedText = buildPersonaContext(body.date, body.sessionId, null);
      const seedResp = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: seedText }],
      });
      const parsed = parseBootstrapReply(extractText(seedResp));
      if (!parsed) {
        return send(res, 502, { error: 'persona_seed_failed' });
      }
      persona = parsed.persona;
      rememberPersona(body.sessionId, persona);
    }

    const prefix = buildPersonaContext(body.date, body.sessionId, persona);
    const apiMessages: Anthropic.MessageParam[] = body.messages.map((m, i) => ({
      role: m.role,
      content: i === 0 && m.role === 'user' ? `${prefix}\n\n${m.text}` : m.text,
    }));

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 350,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: apiMessages,
    });

    const reply = extractText(resp).trim();
    if (!reply) {
      return send(res, 502, { error: 'empty_reply' });
    }
    return send(res, 200, { reply, persona });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    if (err instanceof Anthropic.RateLimitError) {
      return send(res, 503, { error: 'upstream_rate_limited' });
    }
    if (err instanceof Anthropic.APIError) {
      return send(res, 502, { error: 'upstream_error', status: err.status, message });
    }
    return send(res, 500, { error: 'internal_error', message });
  }
}
