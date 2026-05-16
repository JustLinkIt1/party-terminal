import { createGlobalStyle } from 'styled-components';
import { theme } from '../theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background-color: ${theme.color.chassis.void};
    color: ${theme.color.text.onChassis};
    font-family: ${theme.font.body};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    min-width: 320px;
    overflow-x: hidden;
    /* Workshop backdrop: pooled lamp light at top-left, darkness at the rim. */
    background:
      radial-gradient(ellipse at 18% 8%, rgba(232, 163, 61, 0.10) 0%, transparent 38%),
      radial-gradient(ellipse at 82% 92%, rgba(212, 175, 55, 0.04) 0%, transparent 40%),
      ${theme.color.chassis.void};
    background-attachment: fixed;
  }

  a {
    color: ${theme.color.chassis.brassBright};
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: ${theme.color.chassis.brassBase};
    transition: text-shadow 0.18s ${theme.motion.overshoot};
  }
  a:hover {
    text-shadow: ${theme.glow.brassWarm};
  }

  button {
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:focus-visible {
    outline: 1px solid ${theme.color.chassis.brassBright};
    outline-offset: 3px;
  }

  input, select, textarea {
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
  }

  ::selection {
    background: ${theme.color.crt.phosphor};
    color: ${theme.color.crt.screen};
  }

  /* Brass scrollbar */
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  *::-webkit-scrollbar-track {
    background: ${theme.color.chassis.brassDark};
  }
  *::-webkit-scrollbar-thumb {
    background: ${theme.color.chassis.brassBase};
    border: 2px solid ${theme.color.chassis.brassDark};
    border-radius: 6px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: ${theme.color.chassis.brass};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001s !important;
    }
  }
`;
