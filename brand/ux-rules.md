# $DIAL — UX Rules

These are non-negotiable behavioural rules. If a design or implementation choice violates one of these, it's wrong, regardless of how "nice" the alternative looks.

## Motion

- Every transition between two interactive states uses **overshoot + settle** physics, not smooth easing. Reference curve: `cubic-bezier(0.34, 1.2, 0.4, 1.0)`.
- Linear motion is banned except for **ambient** effects (scanline creep, gauge wobble).
- The dial rings carry **inertia.** Release a drag and the ring keeps moving briefly before settling.
- Buttons **sink into a socket** on press. They never go flat with an opacity change.
- The lever **swings past the stop and bounces back.** It doesn't ease to position.

## Material

- Brass is **matte-polished**, not chrome. Highlights are warm gold (`brassBright`), not pure white.
- Every brass surface has either an **inset shadow** (concave / panel face) or a **drop shadow + bright top edge** (convex / button cap). No flat brass.
- Rivets and bolts are **decorative but required.** Every brass panel has visible fasteners at its corners.
- The CRT screen **bulges** at the edges. Use `border-radius` + a faint outer `box-shadow` that gets brighter near corners.
- Scanlines **drift slowly** (vertical 1–2px range). Never static.

## Color

- Phosphor green appears **only inside the CRT.** Brass surfaces never glow green.
- Amber and red are **status colors only.** Never use them for accents.
- Pure white is **banned.** The brightest white in the design is `color.text.onChassis` (warm cream).
- Pure black is **banned** as a surface color. Use `color.chassis.void` (#06070A) instead.

## Typography

- Brass labels are **engraved.** Use display serif + 1px inset text-shadow. Never use sans on a brass surface (except in the long-form footer).
- CRT text is **monospace, glow-soft, slight blur.** Never sharp, never sans.
- Long-form copy (Lore, How-to-Buy) is in `Inter`. This is the only place modernity is allowed — it's the "instruction booklet" voice.
- No emoji. Anywhere. Ever.

## Sound (deferred, design hooks required now)

Every interactive component should accept an `onSound` prop. We will wire actual audio in v2:

- Dial: tick on each ring position change, clunk on settle.
- Preset chip: brass clack.
- Lever: spring throw + return clack.
- Modal: heavy thunk on open.

## Accessibility

- All decorative SVG (rivets, gauges, engraved flourishes): `aria-hidden="true"`.
- Functional controls (dial, chips, lever, buttons): full keyboard support + `aria-label`s describing the action ("Set dial to year X", "New person", "Buy $DIAL").
- The CRT screen content is a `role="log"` `aria-live="polite"` region.
- Reduce-motion users get: no scanline creep, no flicker, no gauge wobble, dial snaps instantly, lever just toggles. The aesthetic is *preserved* (it's still brass and CRT) — only motion drops.
- Minimum tap targets: 44x44 on mobile for chips and lamps.

## Performance

- First-paint budget: under 80KB JS gzipped (current build is 64KB — room for ~16KB of new motion/SVG).
- All brass textures are SVG or CSS gradients. No raster brass PNGs in the runtime bundle. The PNGs in `brand/assets/` are reference only.
- Scanline overlay is one CSS `repeating-linear-gradient`, not a PNG.
- No web fonts > 50KB total. Subset display serif aggressively (caps + numerals + dial punctuation only).
