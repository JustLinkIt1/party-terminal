# $DIAL — Master Prompt for the Implementing Agent

> Paste this whole file into the agent (Claude Code / Cursor / etc.) before any implementation pass. The agent should treat `tokens.json` as source-of-truth and `components.md` as binding contract.

---

## What you're building

`$DIAL` is a single-page React + Vite app already deployed at https://dial.deepbluebase.xyz. The user picks any date between 1500 and today on a tactile **time dial**, and a phosphor CRT terminal opens a chat with an ordinary person living on that day. The persona doesn't know the future.

Your job is to **upgrade the visual surface from a flat CRT-on-black layout to a CRT screen embedded in a Victorian brass chronograph machine.** The chat content itself does not change. The mechanism around the chat is what becomes physical.

---

## Aesthetic — non-negotiable

**Hybrid: CRT-in-Brass.**
- The chat surface is, and stays, a phosphor-green CRT screen. Scanlines, slight bulge, soft glow on text. This is sacred — do not modernize.
- Everything around the screen — frame, dial, levers, preset buttons, indicator lamps, gauges — is **engraved brass**. Warm gold highlights. Visible rivets. Inset shadows on every panel.
- The whole thing reads like a piece of furniture from a 19th-century laboratory that happened to be wired to an AI.

**Reference images** live in `brand/assets/moodboard/`. Match their color temperature, material quality, and lighting.

**Hard-banned** in this design:
- Flat modern SaaS card UI with subtle drop shadows
- Cool-grey palette, neutral whites, pure blacks for panels
- Geometric sans typography for chassis labels (Inter is okay, but only in the long-form footer)
- Plastic-looking gradients
- Animations that are "smooth and elegant" — motion here is mechanical, with overshoot and settle

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite (already in place) | Don't change |
| Styling | `styled-components` (already in place) | Don't change |
| Animation | `framer-motion` for dial/lever throws, raw CSS keyframes for ambient (scanline, flicker, lamp pulse) | Mechanical motion needs spring physics; ambient should be lightweight |
| Icons | Hand-drawn SVGs in `brand/assets/icons/` — not Lucide. The icons should feel etched, not pictogrammed | Brand consistency |
| 3D | CSS transforms + multi-layer SVG only. No WebGL | Performance + the "engraved" feel |

---

## Implementation order (do this exactly)

1. **Apply tokens.** Load `brand/tokens/tokens.json` and either generate a `src/theme.ts` from it or wire it into `styled-components`' `ThemeProvider`. Replace every hard-coded color in `src/` with the token name.
2. **`ChassisFrame`** — Build the outer brass body. Until it exists, the page should look like the inside of a velvet-lined box with a CRT floating in it.
3. **`ScreenWell` + `ScreenSurface`** — Move the existing Terminal into a recessed bezel. Keep all chat logic untouched.
4. **`DialAssembly`** — Replace the current date-picker with the three-ring brass dial.
5. **`PresetChipRow`** — Convert the existing preset chips to brass button caps.
6. **`NewPersonLever`** — Add the side-mounted lever.
7. **`GaugeCluster`** + **`IndicatorLamp`** — Decorative readouts and status lamps. Optional but specced because they sell the machine harder than anything else.
8. **`BuyButton`** — Re-skin the pump.fun CTA with the bolted-down → armed transformation.
9. **`ChassisFooter` sections** — Lore, Tokenomics, How-to-Buy, Roadmap, Footer keep their content but adopt the "instruction booklet" type treatment.

After each step, run `npm run build` and sanity-check the live URL via the verification steps below.

---

## UX rules (binding)

- **Smooth transitions are banned.** Every interactive transition has overshoot or settle. Use `cubic-bezier(0.34, 1.2, 0.4, 1.0)`.
- **Slight inertia on dials.** Rings carry momentum; they don't snap instantly.
- **Buttons sink into sockets, not press flat.** Use `shadow.buttonResting` → `shadow.buttonPressed`.
- **Phosphor only inside the CRT.** Brass never glows green. The green is a property of the screen, not the brand.
- **Engraved labels.** Display-font labels on brass should look pressed in, not stamped on. Use 1px inset shadow.
- **Tactility before polish.** If a choice is between "looks neat" and "feels mechanical," pick mechanical.

---

## Verification — run these after each pass

After implementing, hit the live URL on both desktop and mobile and confirm:

1. The page loads inside a visible brass chassis with rivets at the corners.
2. The CRT screen is recessed (visibly *inside* the chassis, not floating in front of it). Scanlines still drift; phosphor still flickers.
3. The dial assembly responds to drag, settles with overshoot, commits a date.
4. Preset chips look like brass buttons that sink into the chassis when pressed.
5. The "New Person" lever throws and triggers a screen reboot.
6. Indicator lamps light during request flight (TRANSMIT amber) and on rate-limit (FAULT red).
7. The chat content (persona, replies) is visually identical to today's behavior — only the frame changed.
8. The Buy button looks bolted down with "AWAITING DEPLOY"; verify the "armed" state works by toggling a flag locally.

---

## Files you can write to

- `src/` — all components
- `src/theme.ts` (create) — generated from tokens.json
- `src/styles/` — for keyframes (scanline, flicker, lamp-pulse)
- `public/` — for SVG assets you've drawn yourself; **do not** put generated PNGs here, only hand-tuned SVGs

## Files you must NOT change

- `api/` — backend is stable
- `dist/` — output of build
- Any file under `brand/` — that's the design pack, source of truth, immutable

---

## When in doubt

The vibe to nail: imagine the user has inherited a strange machine from a great-grandfather who claimed it could "phone the past." It's beautifully built. The brass is warm from the lamp above. The screen glows green. You don't quite trust it works — until you turn the dial.
