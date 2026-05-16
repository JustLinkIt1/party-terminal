import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import {
  phosphorFlicker,
  scanlineLayer,
  vignetteLayer,
} from '../../styles/keyframes';

// The CRT well: a recessed cutout in the chassis. The screen surface sits
// inside it, bulged at the corners, lit from within, scanned by drifting
// horizontal lines.

const Well = styled.div`
  position: relative;
  padding: 14px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 50%, #2C2210 0%, #100B05 100%);
  box-shadow:
    ${theme.shadow.panelInset},
    inset 0 4px 10px rgba(0, 0, 0, 0.7);

  /* Engraved scroll decoration top + bottom (subtle, decorative). */
  &::before, &::after {
    content: '';
    position: absolute;
    left: 18%;
    right: 18%;
    height: 6px;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0 6px,
        rgba(212, 175, 55, 0.22) 6px 7px,
        transparent 7px 13px
      );
    pointer-events: none;
  }
  &::before {
    top: 4px;
  }
  &::after {
    bottom: 4px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 8px;
    border-radius: 18px;
  }
`;

const Surface = styled.div<{ $booting: boolean }>`
  position: relative;
  background: ${theme.color.crt.screen};
  border-radius: ${theme.radius.screen};
  box-shadow:
    ${theme.shadow.screenInset},
    0 0 0 1px rgba(0, 0, 0, 0.6),
    0 0 24px rgba(91, 255, 138, 0.08);
  padding: ${theme.space.base} ${theme.space.loose};
  min-height: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  animation: ${phosphorFlicker} ${theme.motion.phosphorFlicker.duration}
    ${theme.motion.phosphorFlicker.easing} infinite;

  ${(p) =>
    p.$booting &&
    css`
      animation: ${phosphorFlicker} 600ms ease-in-out 2;
    `}

  /* The scanline overlay + vignette live inside the well. */
  &::before {
    content: '';
    ${scanlineLayer}
  }
  &::after {
    content: '';
    ${vignetteLayer}
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space.snug} ${theme.space.base};
    min-height: 320px;
    border-radius: 10px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// The actual content layer sits above the overlays.
const Content = styled.div`
  position: relative;
  z-index: ${theme.z.screen};
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

type Props = {
  booting?: boolean;
  children: ReactNode;
};

export function ScreenWell({ booting, children }: Props) {
  return (
    <Well>
      <Surface $booting={!!booting} role="region" aria-label="Terminal screen">
        <Content>{children}</Content>
      </Surface>
    </Well>
  );
}
