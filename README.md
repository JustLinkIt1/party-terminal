# $DIAL

A terminal that calls people in the past. Turn the dial to any date 1500–today and talk to an ordinary person living that day, played by Claude — knowledge cutoff matches the dial, never breaks character.

Branded for a pump.fun launch. All token / brand / social strings live in [`src/config.ts`](src/config.ts) for a one-line pre-launch swap.

## Stack

- **Frontend**: React 18 + Vite 5 + TypeScript + styled-components (CRT terminal aesthetic, mobile responsive)
- **Backend**: Single serverless function `api/getBotResponse.ts` using the Anthropic SDK (`claude-sonnet-4-6`), prompt caching, in-memory rate limit, per-session persona cache
- **Repo structure** matches Vercel's filesystem-routed conventions (any platform supporting Node 22 serverless functions in `api/` works)

## Run locally

```bash
npm install
cp .env.example .env             # add your ANTHROPIC_API_KEY
npm run dev:vercel               # requires `vercel link` once
# or: npm run dev — frontend only, /api will 404
```

Open http://localhost:3000 (vercel dev) or http://localhost:5173 (vite dev).

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Auth token sent as `x-api-key`. Works with the real Anthropic API or a compatible proxy. |
| `ANTHROPIC_BASE_URL` | No | Override the upstream URL — point to a proxy (e.g. Claude Max relay). Must accept the Anthropic Messages API shape. |
| `CLAUDE_MODEL` | No | Override the model id. Defaults to `claude-sonnet-4-6`. Set this if your proxy expects a different upstream model name. |

## Deploy

Any platform that runs Node 22 serverless functions in an `api/` folder works without changes. The recommended path is **Vercel** (the repo is structured for it):

1. Import this repo in Vercel.
2. Add the env vars above under Settings → Environment Variables.
3. Deploy.

Set an Anthropic monthly spend cap before going public.

## Pre-launch checklist

1. Set the real CA in `src/config.ts` (`CA`); flip `liveOnDex: true` once Dexscreener has a pair and set `DEXSCREENER_PAIR`.
2. Verify pump.fun URL shape — `https://pump.fun/{CA}` is current, but pump.fun has shifted routes before.
3. Generate `public/og-image.png` (1200×630) for share previews.
4. Confirm `ANTHROPIC_API_KEY` is set in production env.
5. Anthropic console spend cap set.
6. Test the 10-question persona spot-check (see `/root/.claude/plans/could-you-turn-the-goofy-hennessy.md` Verification).
