import { createGlobalStyle } from 'styled-components';
import { theme } from '../theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: ${theme.colors.bg};
    color: ${theme.colors.text};
    font-family: ${theme.font.mono};
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    min-width: 320px;
    overflow-x: hidden;
  }

  a {
    color: ${theme.colors.phosphor};
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: ${theme.colors.phosphorMuted};
    transition: text-shadow 0.15s ease;
  }
  a:hover {
    text-shadow: ${theme.glow.soft};
  }

  button {
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: 1px solid ${theme.colors.phosphorDim};
    padding: 0.5em 1em;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background 0.15s ease, text-shadow 0.15s ease, border-color 0.15s ease;
  }
  button:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.08);
    text-shadow: ${theme.glow.soft};
    border-color: ${theme.colors.phosphor};
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  button:focus-visible {
    outline: 1px solid ${theme.colors.phosphor};
    outline-offset: 2px;
  }

  input, select {
    font-family: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
  }

  ::selection {
    background: ${theme.colors.phosphor};
    color: ${theme.colors.bg};
  }

  /* Phosphor scrollbar */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  *::-webkit-scrollbar-track {
    background: ${theme.colors.bg};
  }
  *::-webkit-scrollbar-thumb {
    background: ${theme.colors.phosphorMuted};
    border-radius: 0;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.phosphorDim};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001s !important;
    }
  }
`;
