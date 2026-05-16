export const theme = {
  colors: {
    bg: '#000000',
    bgRaised: '#0a0f0a',
    phosphor: '#00ff00',
    phosphorDim: '#00aa00',
    phosphorMuted: '#005500',
    amber: '#ffb000',
    danger: '#ff3030',
    text: '#00ff00',
    border: '#003a00',
  },
  glow: {
    soft: '0 0 6px #00ff00, 0 0 12px rgba(0, 255, 0, 0.4)',
    text: '0 0 10px #00ff00, 0 0 20px #00ff00',
    strong: '0 0 12px #00ff00, 0 0 24px #00ff00, 0 0 48px rgba(0, 255, 0, 0.5)',
  },
  font: {
    mono: "'VT323', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },
  space: (n: number) => `${n * 4}px`,
} as const;

export type Theme = typeof theme;
