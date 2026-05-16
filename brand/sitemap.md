# $DIAL — Site Architecture

The site is a **single page**. Everything below scrolls inside one ChassisFrame.

```
/
├── ChassisFrame
│   ├── NameplatePanel              — $DIAL wordmark + tagline + BuyButton(AWAITING DEPLOY)
│   ├── HeroBlock                   — "TURN THE DIAL. MEET SOMEONE WHO DOESN'T KNOW WHAT'S COMING."
│   ├── MachineBlock                — the actual interactive surface
│   │   ├── GaugeCluster            — DRIFT / SIGNAL / EPOCH (left)
│   │   ├── DialAssembly            — three-ring brass time dial (center-top)
│   │   ├── PresetChipRow           — MOON+1 / 9/11+1 / JFK+1 / WALL+1 / TITANIC+1 / CRASH+1
│   │   ├── ScreenWell
│   │   │   └── ScreenSurface       — phosphor CRT
│   │   │       ├── PersonaChip     — "Now talking to: <persona>"
│   │   │       └── ScreenLine[]    — assistant + user lines
│   │   │       └── InputField      — "> _" prompt
│   │   ├── NewPersonLever          — pull to re-roll persona (right side)
│   │   └── IndicatorLamp[]         — POWER / TRANSMIT / FAULT
│   └── ChassisFooter
│       ├── LoreSection             — what $DIAL is, why it exists
│       ├── SampleDispatches        — a few starter conversations as static content
│       ├── TokenomicsSection       — supply, distribution, wallet
│       ├── HowToBuySection         — step-by-step pump.fun guide
│       ├── RoadmapSection          — bolted-down items + glowing future ones
│       └── FooterLinks             — X, Telegram, contract (when deployed)
└── ServiceModal                    — overlay; mounts on demand for errors / info
```

## Routing
None. Hash-fragment scroll only (`#lore`, `#tokenomics`, etc.). No client-side router.

## Future expansion (not in v1, sketched only)
- `/archive/<sessionId>` — shareable read-only transcript view
- `/dial/<YYYY-MM-DD>` — bookmarkable dial state
