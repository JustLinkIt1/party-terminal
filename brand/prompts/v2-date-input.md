# v2 Brief — Date input + dial debounce

> Boss feedback 2026-05-16. Two coupled UX bugs in the current `DialAssembly`:
>
> 1. Changing the year by **one tick** (+/- 1) fires a re-bootstrap immediately. Scrolling 1925 → 2001 = 76 LLM calls. Burns proxy slots, jarring chat experience, blocks any kind of "tune in slowly" interaction.
> 2. The only way to set a date is the +/- pills (or drag, deferred). There's no way to **type a date** or **pick year from a list** for fast jumps.

## What to change

### 1. Detach the dial position from the chat

The dial should only commit a date when the user **explicitly confirms**. Until then, the dial readout updates but the chat stays on the previously-committed date.

- Add a `committedDate` separate from `pendingDate` in the dial state.
- All dial controls (rings, +/- pills, ring drag in v2.1) update `pendingDate`.
- The chat / persona / re-bootstrap calls only react when `committedDate` changes.

### 2. Add a "COMMIT" / "TUNE IN" affordance

Inside the chassis, beside the dial:
- A brass **"TUNE IN"** button (cap style matching `PresetChipRow`).
- Disabled when `pendingDate === committedDate` (i.e., no change to commit).
- Engraved label glows soft phosphor when armed.
- On press: `committedDate = pendingDate`, triggers the existing re-bootstrap path (with the screen flicker we already have).

### 3. Add typed-date entry

A small monospace input field showing the current `pendingDate` as `YYYY-MM-DD`.
- User can type/paste a full date.
- `onBlur` or `Enter` parses + validates against `MIN_DATE = 1500-01-01` and today.
- Invalid → field turns amber (`color.crt.amberWarn`), tooltip "out of range".
- Valid → `pendingDate` updates; user still has to press TUNE IN to commit.

### 4. Year dropdown (fast jump)

Replace the year **+/- pills** with a click-anywhere year input that opens a small brass-bezel dropdown of decade jumps:
- 1500s, 1600s, 1700s, 1800s, 1900s, 1910s, 1920s, …, 2020s.
- Pick a decade → year ring snaps to the middle of that decade.
- Then fine-tune via the still-existing month/day pills or the typed input.

Month and day +/- pills can stay — small adjustments are fine to do via pills.

### 5. Preset chips stay one-shot

Existing `PresetChipRow` ("MOON +1", "9/11 +1", etc.) already commits on click — that behavior is correct. They should set **both** `pendingDate` and `committedDate` and trigger re-bootstrap in the same gesture.

## Acceptance

- Scrolling year +/- 30 times produces **zero** API calls until TUNE IN is pressed.
- Typing `2001-09-12` and pressing Enter sets the pending date; press TUNE IN to actually re-roll persona.
- Decade dropdown lets a user jump from 2001 to 1500 in 2 clicks.
- Preset chips still re-roll on click (one gesture = one commit).
- Invalid typed dates don't fire the API.

## Implementation notes

- `useChat.tsx` (or wherever the bootstrap is currently triggered) probably listens to a `date` prop. Repoint it at `committedDate`.
- `DialAssembly.tsx` owns `pendingDate` state and renders the TUNE IN button.
- The screen's `PersonaChip` should subtly indicate "tuning…" between TUNE IN press and bootstrap complete, then update with the new persona.
- Don't break preset chips. Don't break the "AWAITING DEPLOY" Buy button transformation.

## Runtime assets now available

`public/assets/` was just populated with 2K isolated component PNGs. Use these as raster overlays in the relevant components — they're served at `/assets/<name>.png` after build:

| File | Use in |
|---|---|
| `chassis-frame.png` | `ChassisFrame` — background plate behind the rest |
| `dial-disc.png` | `DialAssembly` — the three-ring face (CSS-rotate the whole image, or layer rings) |
| `gauge-cluster.png` | `GaugeCluster` — full 3-gauge strip |
| `lever.png` | `NewPersonLever` — rotate via CSS transform on user pull |
| `button-cap.png` | `PresetChipRow` + TUNE IN button — use as background-image, label overlaid in CSS |
| `indicator-lamp.png` | `IndicatorLamp` — bezel; color the inner glow via a CSS pseudo-element |
