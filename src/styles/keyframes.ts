import { keyframes, css } from 'styled-components';
import { theme } from '../theme';

// Vertical drift of the scanline overlay — 1-2px range, loops forever.
export const scanlineCreep = keyframes`
  0%   { background-position: 0 0; }
  100% { background-position: 0 6px; }
`;

// Tiny opacity wobble on the CRT layer — 0.95..1, irregular via steps().
export const phosphorFlicker = keyframes`
  0%, 100% { opacity: 1; }
  9%       { opacity: 0.97; }
  13%      { opacity: 0.99; }
  31%      { opacity: 0.96; }
  47%      { opacity: 0.995; }
  62%      { opacity: 0.94; }
  79%      { opacity: 0.99; }
  91%      { opacity: 0.97; }
`;

// Power-on sweep: vertical squish into a thin bright line, then expand.
export const screenBoot = keyframes`
  0%   { transform: scaleY(0); opacity: 0; filter: brightness(2); }
  20%  { transform: scaleY(0.04); opacity: 1; filter: brightness(2.6); }
  55%  { transform: scaleY(0.04); }
  100% { transform: scaleY(1); opacity: 1; filter: brightness(1); }
`;

// Indicator lamp pulse — gentle and irregular, never metronomic.
export const lampPulse = keyframes`
  0%, 100% { filter: brightness(1); }
  50%      { filter: brightness(1.18); }
`;

// Gauge needle wobble — small, continuous, organic.
export const gaugeWobble = keyframes`
  0%, 100% { transform: rotate(var(--needle, 0deg)); }
  25%      { transform: rotate(calc(var(--needle, 0deg) + 0.8deg)); }
  60%      { transform: rotate(calc(var(--needle, 0deg) - 1.1deg)); }
  82%      { transform: rotate(calc(var(--needle, 0deg) + 0.5deg)); }
`;

// Cursor blink for the prompt — slower than typical, more CRT than terminal-modern.
export const caretBlink = keyframes`
  0%, 50%  { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

// Lever throw — used by NewPersonLever.
export const leverThrow = keyframes`
  0%   { transform: rotate(0deg); }
  35%  { transform: rotate(34deg); }
  60%  { transform: rotate(28deg); }
  100% { transform: rotate(0deg); }
`;

// Phosphor scanline overlay — a reusable styled-components mixin.
export const scanlineLayer = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${theme.texture.scanlines};
  background-size: 100% 3px;
  mix-blend-mode: multiply;
  animation: ${scanlineCreep} ${theme.motion.scanlineCreep.duration}
    ${theme.motion.scanlineCreep.easing} infinite;
  z-index: ${theme.z.scanlines};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// CRT vignette — paint inside the screen well.
export const vignetteLayer = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${theme.texture.vignette};
  z-index: ${theme.z.scanlines};
`;
