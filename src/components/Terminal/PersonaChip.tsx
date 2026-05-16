import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { plateLatch } from '../../styles/keyframes';

// Engraved identification plate that names the person on the other end of the
// line. Rendered as a phosphor-bordered cartouche with corner brackets, a
// stencil header strip, and a glow-on monospace body. When the persona text
// changes the whole plate latches in with a brief CRT bloom (plateLatch).

const Plate = styled.div`
  position: relative;
  margin: 0 0 ${theme.space.snug};
  padding: ${theme.space.snug} ${theme.space.base} ${theme.space.snug};
  border: 1px solid rgba(91, 255, 138, 0.32);
  border-radius: 4px;
  background:
    linear-gradient(
      180deg,
      rgba(91, 255, 138, 0.06) 0%,
      rgba(91, 255, 138, 0.02) 100%
    );
  box-shadow:
    inset 0 0 18px rgba(91, 255, 138, 0.07),
    inset 0 1px 0 rgba(91, 255, 138, 0.18);
  transform-origin: 50% 50%;
  animation: ${plateLatch} 520ms ${theme.motion.overshoot};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Four corner brackets — purely typographic L-marks at the plate corners.
const Bracket = styled.span<{ $pos: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid ${theme.color.crt.phosphor};
  box-shadow: 0 0 6px rgba(91, 255, 138, 0.55);
  pointer-events: none;

  ${(p) =>
    p.$pos === 'tl' &&
    css`
      top: -1px;
      left: -1px;
      border-right: none;
      border-bottom: none;
    `}
  ${(p) =>
    p.$pos === 'tr' &&
    css`
      top: -1px;
      right: -1px;
      border-left: none;
      border-bottom: none;
    `}
  ${(p) =>
    p.$pos === 'bl' &&
    css`
      bottom: -1px;
      left: -1px;
      border-right: none;
      border-top: none;
    `}
  ${(p) =>
    p.$pos === 'br' &&
    css`
      bottom: -1px;
      right: -1px;
      border-left: none;
      border-top: none;
    `}
`;

// Stencil header strip — pulled up over the top border of the plate, like
// the channel-ident bug on a vintage broadcast.
const Header = styled.div`
  position: absolute;
  top: -10px;
  left: ${theme.space.base};
  padding: 1px ${theme.space.tight};
  background: ${theme.color.crt.screen};
  font-family: ${theme.font.mono};
  font-size: 10px;
  letter-spacing: 0.32em;
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorSoft};
  text-transform: uppercase;
  user-select: none;

  &::before,
  &::after {
    content: '▮';
    margin: 0 4px;
    color: ${theme.color.crt.phosphorDim};
    font-size: 8px;
  }
`;

// The persona line. Tight uppercase tracking when at rest; the keyframe
// expands letter-spacing during the latch so it reads as "tuning in."
const Body = styled.div`
  font-family: ${theme.font.mono};
  color: ${theme.color.text.onScreen};
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: 0.04em;
  text-shadow: ${theme.glow.phosphorHot};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 15px;
  }
`;

// Faint "no signal" placeholder used before the first persona arrives.
const Placeholder = styled.span`
  color: ${theme.color.crt.phosphorGhost};
  letter-spacing: 0.6em;
  text-shadow: none;
`;

type Props = { persona: string | null };

export function PersonaChip({ persona }: Props) {
  return (
    <Plate aria-live="polite">
      <Bracket $pos="tl" aria-hidden />
      <Bracket $pos="tr" aria-hidden />
      <Bracket $pos="bl" aria-hidden />
      <Bracket $pos="br" aria-hidden />
      <Header aria-hidden>Transmission Identified</Header>
      <Body>
        {persona ?? <Placeholder>· · · awaiting signal · · ·</Placeholder>}
      </Body>
    </Plate>
  );
}
