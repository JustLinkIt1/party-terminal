# $DIAL — Component Library

Every component below assumes the **Hybrid: CRT-in-Brass** aesthetic from `tokens/tokens.json`. The mental model is: you are sitting in front of a Victorian-engineered chronograph. The interactive surface is a phosphor CRT screen, but the apparatus around it is brass, mechanical, and physical.

> **Naming convention:** `Chassis*` = brass/mechanical. `Screen*` = inside the CRT. `Gauge*` = decorative readouts.

---

## ChassisFrame
**Purpose** — The outer brass body the entire app sits inside.
**Desktop** — Fills viewport with `color.chassis.void` backdrop. The brass body is a centered panel max-width ~1200px with `shadow.panelInset` + `texture.brushedBrass`. Visible rivets at the four corners + every ~120px along edges (purely decorative SVG).
**Mobile** — Edge-to-edge brass; rivets shrink to half scale and snap to corners only. No padding waste.
**Hover** — None. The frame is static; it's furniture.
**Animation** — None.
**Notes** — This is the only component that should ever set the page background. Everything else sits on it.

---

## NameplatePanel
**Purpose** — The engraved brass header at the top of the chassis. Holds the wordmark `$DIAL` in `typography.display`, the tagline, and possibly the pump.fun "AWAITING DEPLOY" pill.
**Desktop** — Centered, ~80px tall. Etched letterforms — `color.text.onChassisMuted` with a 1px inset shadow to simulate engraving depth.
**Mobile** — 56px tall, tagline drops to a second line.
**Hover** — Wordmark `glow.brassWarm` if it's clickable (returns to home).
**Animation** — Subtle `motion.phosphorFlicker` on any indicator LEDs embedded in the plate.

---

## DialAssembly  (replaces the current "Time Dial" date picker)
**Purpose** — The main interaction. A rotatable brass disc with year/month/day rings.
**Desktop** — Three concentric brass rings (year/month/day). Each spins on click+drag; year ring has labeled ticks at 25-year intervals. Center hub shows the selected date in `typography.mono` + `glow.phosphorHot`. Outside the disc: a brass pointer rivet at 12 o'clock indicating "selection".
**Mobile** — Collapses to a single ring with year/month/day mode toggle (small brass switch above). Drag rotates; tap a position snaps.
**Hover** — Cursor becomes `grab`; ring under cursor gets `glow.brassWarm`.
**Drag** — Cursor becomes `grabbing`; ring rotates with momentum, settles on nearest tick with `motion.dialRotate`. Audible *click* would be ideal (defer until v2).
**Animation** — When date is committed, all three rings re-align with a 200ms staggered snap.
**State variants** — `idle` / `dragging` / `committed` / `out-of-range`. Out-of-range tints the digit display amber + plays a faint amber lamp.

---

## PresetChipRow
**Purpose** — Quick-jump buttons (MOON +1, 9/11 +1, JFK +1, …).
**Desktop** — Horizontal row of brass button-caps below the dial. Each is a rounded rectangle (radius `radius.button`), `color.chassis.brass` face, `typography.display` label engraved.
**Mobile** — Horizontal scroll, snap to chip. Edges fade with a vignette mask.
**Hover** — Lifts by 1px, `glow.brassWarm`.
**Active** — Settles into socket — swap `shadow.buttonResting` for `shadow.buttonPressed`, label momentarily brighter.
**Animation** — `motion.buttonPress`.
**Notes** — These are *event-jump* chips, not state-toggle chips. They don't stay pressed.

---

## NewPersonLever
**Purpose** — The "New Person" / re-roll action.
**Desktop** — A brass lever (vertical SVG) mounted to the right of the screen. Pull to re-roll persona for the current date.
**Mobile** — Collapses to a button labeled "PULL — NEW PERSON" with a small lever icon.
**Hover** — Lever handle glows.
**Active** — Lever swings down 30° then springs back. Triggers screen flicker as new persona loads.
**Animation** — `motion.dialRotate` for the lever throw; couple to a `screenBoot` re-init on the CRT.

---

## ScreenWell + ScreenSurface (the CRT)
**Purpose** — The chat interface itself.
**Desktop** — A recessed rectangular cutout in the chassis (`shadow.screenInset`), `radius.screen` corners, slight outward bulge via CSS `border-radius` + a faint `texture.vignette` overlay. Background `color.crt.screen`. All text inside is `typography.mono` + `glow.phosphorSoft`.
**Mobile** — Fills most of the chassis interior. Aspect ratio stretches; bulge stays.
**Hover** — None.
**Animation** — Permanent `motion.scanlineCreep` + `motion.phosphorFlicker`. Boot uses `motion.screenBoot`.
**Persona chip** — Renders inside the screen at top: `"Now talking to: <persona>"` in slightly hotter phosphor.

---

## ScreenLine (assistant / user message)
**Purpose** — A single message inside the CRT.
**Variants**
- `assistant` — `color.text.onScreen`, default soft glow, leading `·` prefix glyph.
- `user` — `color.text.onScreenUser`, leading `>` prefix glyph, slightly brighter, tighter line-height.
**Animation** — Type-on character-by-character at ~24 chars/sec for the assistant; instant for user (already typed).
**Edge case** — If a reply is over 280 chars, line-break manually at sentence boundaries — long unbroken phosphor blocks look like a wall.

---

## InputField (terminal prompt)
**Purpose** — The user types here.
**Desktop** — Bottom line of the CRT. Prefix `> ` is always-visible. Cursor blinks at `motion.phosphorFlicker` cadence. No visible border — it's just a line on the screen.
**Mobile** — Same. Keyboard avoidance via `padding-bottom: env(safe-area-inset-bottom)`.
**Hover** — None.
**Focus** — Cursor glows `glow.phosphorHot`.
**Animation** — Cursor blink.

---

## GaugeCluster
**Purpose** — Decorative readouts on the chassis to sell the "machine" idea. Optional but high impact.
**Desktop** — 2–3 small brass gauges (round, glass faces) placed left-of-screen. Each shows something semi-real:
  1. **DRIFT** — wobbles 0–100% based on conversation length.
  2. **SIGNAL** — drops on first message, recovers (fakes a connection-establishing feel).
  3. **EPOCH** — needle pointing at the dial year on a 1500–today arc.
**Mobile** — Hidden. Free real estate on small screens is too valuable.
**Hover** — Gauge face brightens slightly.
**Animation** — `motion.gaugeWobble` always on; SIGNAL spikes on each user send.

---

## IndicatorLamp
**Purpose** — Status LEDs on the chassis. Three default lamps:
  1. **POWER** — phosphor green, always on, gentle pulse.
  2. **TRANSMIT** — amber, lights during a request in flight.
  3. **FAULT** — red, lights on error (rate limit, upstream fail).
**Desktop** — Round 10px lit dot inside a brass bezel. Use the matching `glow.indicator*` token.
**Mobile** — Smaller (6px); group inline beside the nameplate.
**Hover** — Tooltip in `typography.mono` describing the lamp state.

---

## ServiceModal (errors, "AWAITING DEPLOY", info panels)
**Purpose** — Anything that needs to obscure the chat momentarily.
**Desktop** — A second brass panel slides up from the bottom edge of the chassis like a maintenance hatch opening. Inside, content in `typography.display`. Close button is a brass toggle switch in the top-right of the modal.
**Mobile** — Full-screen, slides up.
**Hover** — Switch handle glows.
**Animation** — 240ms slide + 80ms settle bounce.

---

## ChassisFooter (Lore / Tokenomics / How-to-Buy / Roadmap / Footer)
**Purpose** — Long-form marketing sections under the chassis.
**Desktop** — These leave the machine metaphor — they're the "instruction booklet" that came with the device. Set `typography.body` (Inter), generous line-height, `color.text.onChassis` on a darker brass field. Section headings keep `typography.display` to retain identity.
**Mobile** — Same, single column.
**Hover** — Standard link underline in `color.chassis.brassBright`.
**Animation** — None — these should feel like printed paper.

---

## BuyButton (pump.fun CTA)
**Purpose** — The headline conversion button.
**Desktop** — Larger version of `PresetChipRow` cap. When the contract isn't deployed yet, label reads `AWAITING DEPLOY` and the cap is *visibly bolted down* with extra rivets, `color.text.onChassisMuted` text, no hover lift. Once a CA exists, it transforms: rivets fade out, label becomes `BUY $DIAL`, full `glow.brassWarm` on hover.
**Mobile** — Sticky to bottom of chassis until scrolled into footer.
**Hover** (when active) — Lift + glow.
**Active** — Buttonpress, then opens pump.fun in new tab.
**Animation** — On deploy transition, a 600ms rivet-fade + cap-rise sequence sells the "machine just got armed" moment.

---

## Behaviour rules — applies to everything

- **No flat shadows.** Every interactive piece either sits *into* the chassis (inset) or *on top of* it (drop + bright top-edge highlight).
- **Brass is matte-polished, not chrome.** Highlights are warm gold (`brassBright`), never pure white.
- **Phosphor never appears outside the CRT.** Brass surfaces never glow green; the green is a property of the screen only.
- **No rounded-corner SaaS cards.** Use `radius.panel` (8px) at most for chassis sub-panels.
- **Motion is mechanical, not eased-elegant.** Prefer `cubic-bezier(0.34, 1.2, 0.4, 1.0)` (overshoot + settle) over the smooth Material curves.
- **Sound (deferred):** dial-click, lever-throw, button-clack, modal-thunk. Add in v2; design the components to accept an `onSound` callback now so retrofitting is one prop.
