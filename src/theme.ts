// Generated from brand/tokens/tokens.json. Source of truth lives there.
// If you change a value, change it in the brand pack first.

export const theme = {
  color: {
    chassis: {
      void: '#06070A',
      brassDark: '#3B2A14',
      brassBase: '#8A6A2E',
      brass: '#B08D57',
      brassBright: '#D4AF37',
      patina: '#4C5A4B',
    },
    crt: {
      screen: '#04140C',
      phosphor: '#5BFF8A',
      phosphorDim: '#2E8A4B',
      phosphorGhost: '#1A4429',
      amberWarn: '#E8A33D',
      redFault: '#C84B2E',
    },
    text: {
      onChassis: '#E7D7B1',
      onChassisMuted: '#9D8856',
      onScreen: '#9CFFB6',
      onScreenUser: '#E8FFE0',
    },
  },
  font: {
    display: '"IM Fell English SC", "UnifrakturCook", serif',
    mono: '"VT323", "IBM Plex Mono", ui-monospace, Menlo, monospace',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },
  tracking: {
    display: '0.06em',
    mono: '0',
  },
  radius: {
    rivet: '999px',
    knob: '999px',
    panel: '8px',
    screen: '14px',
    button: '6px',
  },
  space: {
    rivet: '4px',
    tight: '8px',
    snug: '12px',
    base: '16px',
    loose: '24px',
    panel: '40px',
  },
  shadow: {
    panelInset:
      'inset 0 2px 4px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(212,175,55,0.18)',
    screenInset:
      'inset 0 8px 24px rgba(0,0,0,0.85), inset 0 0 60px rgba(0,0,0,0.6)',
    rivet: '0 1px 1px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,220,140,0.5)',
    buttonResting: '0 2px 0 #3B2A14, 0 4px 6px rgba(0,0,0,0.55)',
    buttonPressed: 'inset 0 2px 3px rgba(0,0,0,0.7)',
  },
  glow: {
    phosphorSoft: '0 0 8px rgba(91,255,138,0.35), 0 0 24px rgba(91,255,138,0.15)',
    phosphorHot:
      '0 0 6px rgba(91,255,138,0.7), 0 0 18px rgba(91,255,138,0.4), 0 0 40px rgba(91,255,138,0.18)',
    brassWarm: '0 0 14px rgba(212,175,55,0.35)',
    indicatorAmber: '0 0 6px rgba(232,163,61,0.7), 0 0 14px rgba(232,163,61,0.35)',
    indicatorRed: '0 0 8px rgba(200,75,46,0.8), 0 0 20px rgba(200,75,46,0.35)',
  },
  texture: {
    scanlines:
      'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)',
    vignette:
      'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
    brass:
      // Procedural matte-polished brass: warm gold base + vertical brushed noise via stacked gradients.
      'linear-gradient(180deg, #B6914F 0%, #8E6E2E 50%, #6B5320 100%), repeating-linear-gradient(90deg, rgba(255,220,140,0.04) 0 1px, transparent 1px 3px)',
    brassDarker:
      'linear-gradient(180deg, #8A6A2E 0%, #5C4519 60%, #3B2A14 100%)',
  },
  motion: {
    overshoot: 'cubic-bezier(0.34, 1.2, 0.4, 1.0)',
    dialRotate: { duration: '1400ms', easing: 'cubic-bezier(0.34, 1.2, 0.4, 1.0)' },
    buttonPress: { duration: '60ms', easing: 'ease-out' },
    screenBoot: { duration: '900ms', easing: 'ease-in' },
    scanlineCreep: { duration: '5200ms', easing: 'linear' },
    phosphorFlicker: { duration: '3700ms', easing: 'steps(8, end)' },
    gaugeWobble: { duration: '2200ms', easing: 'ease-in-out' },
  },
  z: {
    void: 0,
    chassis: 10,
    rivets: 20,
    screenWell: 30,
    screen: 40,
    scanlines: 50,
    controls: 60,
    modal: 80,
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },
} as const;

export type Theme = typeof theme;
