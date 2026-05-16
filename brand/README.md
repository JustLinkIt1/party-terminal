# $DIAL — Web Design Pack

> Source-of-truth design system for $DIAL. The implementing agent (Claude Code, Cursor, etc.) should treat this folder as immutable input: tokens are binding, components are contracts, the master prompt is the starting instruction.

## What's in this pack

```
brand/
├── README.md                       (this file — start here)
├── tokens/
│   └── tokens.json                 design tokens (colors, type, spacing, shadows, glow, motion, z-index)
├── components/
│   └── components.md               component contracts (desktop/mobile/hover/animation per component)
├── prompts/
│   └── master-prompt.md            paste-into-agent build brief
├── sitemap.md                      single-page architecture
├── ux-rules.md                     non-negotiable behavioural rules
└── assets/
    └── moodboard/                  8 reference images generated via stablestudio
        ├── hero-machine.png        — north-star reference (full apparatus)
        ├── crt-plate.png           — phosphor screen + brass bezel
        ├── brass-dial.png          — three-ring time dial
        ├── gauge-cluster.png       — decorative gauges
        ├── brass-button-row.png    — preset-chip button reference
        ├── icon-plate.png          — etched UI icon style sheet
        ├── brass-texture.png       — tileable brushed-brass surface
        └── workshop-bg.png         — workshop ambient backdrop reference
```

## Aesthetic in one sentence

A phosphor-green CRT terminal recessed inside an engraved Victorian brass chronograph — chat content unchanged, the mechanism around the chat made physical.

See `assets/moodboard/hero-machine.png` for the north-star reference.

## How an implementing agent should use this pack

1. Read `prompts/master-prompt.md` end-to-end. That's the build brief.
2. Load `tokens/tokens.json` into the codebase (generate `src/theme.ts` or wire into `styled-components`' ThemeProvider).
3. Build components in the order specified at the bottom of `master-prompt.md`. After each step, run `npm run build` and sanity-check the live URL.
4. Use `assets/moodboard/*.png` as visual reference only — they are *not* runtime assets. Final brass surfaces are CSS gradients + SVG; final icons are hand-drawn SVGs. PNGs in this folder never enter the build.
5. When in doubt about behaviour, consult `ux-rules.md`. When in doubt about a component contract, consult `components.md`.

## What's intentionally NOT in this pack

- **Hand-drawn SVG icons.** The icon-plate moodboard sets the *style* — the implementing agent should re-draw each icon as an SVG so it can be styled in code. Burning the AI-generated PNG into runtime is banned by `ux-rules.md`.
- **A Figma file.** Tokens + components.md + moodboard PNGs are the design source. Figma is optional and not maintained.
- **Logos.** $DIAL is a wordmark in `typography.display`. There is no logo mark; the brass apparatus *is* the brand.
- **Dark/light mode.** There is no light mode. The machine sits in a dim workshop. Always.
- **Sound assets.** Specced as hooks in `components.md` and `ux-rules.md`. To be added in v2.

## Production traceability — image generation log

All 8 reference images generated 2026-05-16 via stablestudio (Nano Banana model, 1K, minimal-thinking, $0.07 each).

| File                    | Job ID                          | Base-chain tx hash                                                   |
|-------------------------|---------------------------------|----------------------------------------------------------------------|
| hero-machine.png        | cmp8gv0fv000104ljlr24dm8s       | 0xb125add6417d4ca9829b421d3003a1496753041e76377ca33711fff49be3fc78   |
| brass-texture.png       | cmp8gvese000104lgv88zspcb       | 0xe71dbefd1b6169988bafe96fef113c59ad849f7a6b0c90f72f230c7e86d4dfdb   |
| crt-plate.png           | cmp8gvid1000304lgwayhx6s6       | 0x0370c40b6493b526b1b28cd1495999d1dd41a65c31e55faaa36e3f0382889a26   |
| brass-dial.png          | cmp8gvm5p000504lgwbj94dc5       | 0xfc13ea0557d49543ae77801fa67a041de5a9cfb80f0e8532a4a8d5ca18b4eb9c   |
| gauge-cluster.png       | cmp8gvoit000704lg8h1i2hxh       | 0xdc450e45d38c3432d7ac584b1b9c16988c29c1105afc7c66c43f74a8b405e604   |
| brass-button-row.png    | cmp8gvw2a000904lgeqwth0o0       | 0x286cc5be797093f186eb219d41638bbf209687f1b25326cf6c393d3985f990b6   |
| icon-plate.png          | cmp8gvzsp000b04lgplevimw7       | 0x336b68725a70c463404d1c54ba82d0b4995f7efe519393964b19879f0ec6517a   |
| workshop-bg.png         | cmp8gw370000d04lgz2tlp02t       | 0xf724109caf66e4ffba5708e71ea5e1257744933b89de9a8c80e085b60c612b74   |

Total: **$0.56 USDC** on Base. Wallet before: $2.962428. Wallet after: $2.402428.

## Re-generating an image

If a reference image needs to be re-rolled (style miss, want a variant, etc.), use the prompt body recorded in the job-status JSON (`stablestudio.dev/api/jobs/<jobId>` returns the full input). Bump `thinkingLevel: "high"` for a more deliberate variant — same $0.07.

## Versioning

This pack is `0.1.0`. Bump tokens.json `meta.version` when:
- Any color, type, spacing token value changes (minor)
- A component contract changes shape or removes states (minor)
- The aesthetic direction changes (major)

Never delete a moodboard image. If superseded, move to `assets/moodboard/_deprecated/` so the on-chain payment trail stays intact.
