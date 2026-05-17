// Renders a square brass-framed postcard PNG of a conversation snapshot.
// Used by the POSTCARD button — output is suitable for X/Telegram posts.
//
// Tries Web Share API first (mobile native), falls back to a download.

import type { ChatMessage } from '../components/Terminal/useChat';
import { config } from '../config';

const W = 1080;
const H = 1350;

function loadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.ready) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}

function bestLine(messages: ChatMessage[]): string {
  // Skip the opening (first assistant message) — the spirit of a postcard is
  // a moment that *answered* something. Pick the longest non-opening
  // assistant reply, falling back to the opening if there's nothing else.
  const replies = messages
    .map((m, i) => ({ m, i }))
    .filter(({ m, i }) => m.role === 'assistant' && i > 0);
  if (replies.length === 0) {
    const opening = messages.find((m) => m.role === 'assistant');
    return opening?.text ?? '';
  }
  return replies.reduce((a, b) => (b.m.text.length > a.m.text.length ? b : a)).m.text;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function brassGradient(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#B6914F');
  g.addColorStop(0.5, '#8E6E2E');
  g.addColorStop(1, '#5C4519');
  return g;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  const grad = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#FBE3A2');
  grad.addColorStop(0.6, '#D4AF37');
  grad.addColorStop(1, '#4A3A1A');
  ctx.fillStyle = grad;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawRule(
  ctx: CanvasRenderingContext2D,
  y: number,
  inset = 140,
) {
  const g = ctx.createLinearGradient(inset, y, W - inset, y);
  g.addColorStop(0, 'rgba(212, 175, 55, 0)');
  g.addColorStop(0.2, 'rgba(212, 175, 55, 0.55)');
  g.addColorStop(0.8, 'rgba(212, 175, 55, 0.55)');
  g.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(inset, y, W - inset * 2, 1);
}

export async function renderPostcard(
  date: string,
  persona: string,
  messages: ChatMessage[],
): Promise<Blob> {
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unsupported');

  // Brass card body.
  ctx.fillStyle = brassGradient(ctx);
  ctx.fillRect(0, 0, W, H);

  // Engraved inner border.
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  // Warm-light radial in the upper left, like the chassis.
  const lamp = ctx.createRadialGradient(W * 0.22, -120, 0, W * 0.22, -120, W * 0.7);
  lamp.addColorStop(0, 'rgba(255, 220, 140, 0.28)');
  lamp.addColorStop(1, 'rgba(255, 220, 140, 0)');
  ctx.fillStyle = lamp;
  ctx.fillRect(0, 0, W, H);

  // Top filigree
  drawRule(ctx, 120);
  drawDiamond(ctx, W / 2, 120, 18);

  // Header — stencil over the rule
  ctx.font = '500 26px "IM Fell English SC", serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#04140C';
  ctx.fillRect(W / 2 - 240, 100, 480, 36);
  ctx.fillStyle = '#5BFF8A';
  ctx.shadowColor = 'rgba(91, 255, 138, 0.7)';
  ctx.shadowBlur = 8;
  ctx.fillText('▮ TRANSMISSION FROM THE DIAL ▮', W / 2, 128);
  ctx.shadowBlur = 0;

  // Date — phosphor stencil block.
  const dateStr = fmtDate(date);
  ctx.fillStyle = '#04140C';
  ctx.fillRect(W / 2 - 320, 200, 640, 88);
  ctx.fillStyle = '#5BFF8A';
  ctx.shadowColor = 'rgba(91, 255, 138, 0.6)';
  ctx.shadowBlur = 14;
  ctx.font = '46px "VT323", "IBM Plex Mono", monospace';
  ctx.fillText(dateStr.toUpperCase(), W / 2, 258);
  ctx.shadowBlur = 0;

  // Persona — serif on brass.
  ctx.fillStyle = '#E7D7B1';
  ctx.font = '32px "IM Fell English SC", serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 1;
  const personaLines = wrapText(ctx, persona, W - 220);
  let py = 360;
  for (const line of personaLines.slice(0, 4)) {
    ctx.fillText(line, W / 2, py);
    py += 44;
  }

  drawRule(ctx, py + 12);
  drawDiamond(ctx, W / 2, py + 12, 14);

  // Best line — monospace, large, in a phosphor block.
  const line = bestLine(messages);
  ctx.shadowOffsetY = 0;
  ctx.font = '36px "VT323", "IBM Plex Mono", monospace';
  const innerW = W - 220;
  const wrapped = wrapText(ctx, '"' + line + '"', innerW);
  const blockTop = py + 50;
  const lineH = 50;
  const blockH = Math.min(wrapped.length, 12) * lineH + 60;
  ctx.fillStyle = '#04140C';
  ctx.fillRect(80, blockTop, W - 160, blockH);
  ctx.strokeStyle = 'rgba(91, 255, 138, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, blockTop, W - 160, blockH);
  ctx.fillStyle = '#9CFFB6';
  ctx.shadowColor = 'rgba(91, 255, 138, 0.5)';
  ctx.shadowBlur = 8;
  let yy = blockTop + 60;
  for (const l of wrapped.slice(0, 12)) {
    ctx.fillText(l, W / 2, yy);
    yy += lineH;
  }
  ctx.shadowBlur = 0;

  drawRule(ctx, blockTop + blockH + 40);
  drawDiamond(ctx, W / 2, blockTop + blockH + 40, 14);

  // Footer wordmark + url.
  ctx.fillStyle = '#E7D7B1';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowOffsetY = 1;
  ctx.font = '600 56px "IM Fell English SC", serif';
  ctx.fillText(config.NAME, W / 2, H - 140);
  ctx.font = '20px "IM Fell English SC", serif';
  ctx.fillStyle = '#9D8856';
  ctx.fillText('dial.deepbluebase.xyz', W / 2, H - 92);

  ctx.shadowOffsetY = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('toBlob-failed'));
    }, 'image/png');
  });
}

export async function sharePostcard(
  date: string,
  persona: string,
  messages: ChatMessage[],
): Promise<'shared' | 'downloaded'> {
  const blob = await renderPostcard(date, persona, messages);
  const fileName = `dial-${date}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${config.NAME} — ${date}`,
        text: `i called ${date} and got ${persona.split(',')[0]}.`,
      });
      return 'shared';
    } catch {
      // user cancelled — fall through to download
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
