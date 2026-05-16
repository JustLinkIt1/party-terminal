import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { lampPulse } from '../../styles/keyframes';

type Color = 'power' | 'transmit' | 'fault';

const colorMap: Record<Color, { lit: string; dim: string; glow: string }> = {
  power: {
    lit: theme.color.crt.phosphor,
    dim: '#0E331E',
    glow: theme.glow.phosphorSoft,
  },
  transmit: {
    lit: theme.color.crt.amberWarn,
    dim: '#3B2A14',
    glow: theme.glow.indicatorAmber,
  },
  fault: {
    lit: theme.color.crt.redFault,
    dim: '#2E0F08',
    glow: theme.glow.indicatorRed,
  },
};

const Bezel = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.snug};
`;

const Socket = styled.span`
  width: 22px;
  height: 22px;
  border-radius: ${theme.radius.knob};
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 220, 140, 0.6) 0%, transparent 35%),
    radial-gradient(circle, #5C4519 0%, #2A1C0A 100%);
  box-shadow:
    inset 0 2px 3px rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(212, 175, 55, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 16px;
    height: 16px;
  }
`;

const Bulb = styled.span<{ $color: Color; $lit: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: ${theme.radius.knob};
  background: ${(p) => (p.$lit ? colorMap[p.$color].lit : colorMap[p.$color].dim)};
  box-shadow: ${(p) => (p.$lit ? colorMap[p.$color].glow : 'none')};
  transition: background 0.2s ${theme.motion.overshoot},
    box-shadow 0.2s ${theme.motion.overshoot};
  ${(p) =>
    p.$lit &&
    css`
      animation: ${lampPulse} 2400ms ${theme.motion.gaugeWobble.easing} infinite;
    `}

  @media (max-width: ${theme.breakpoints.md}) {
    width: 6px;
    height: 6px;
  }
`;

const Caption = styled.span`
  font-family: ${theme.font.display};
  font-size: 11px;
  letter-spacing: ${theme.tracking.display};
  color: ${theme.color.text.onChassisMuted};
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

type Props = {
  color: Color;
  lit: boolean;
  label: string;
};

export function IndicatorLamp({ color, lit, label }: Props) {
  return (
    <Bezel aria-label={`${label} ${lit ? 'lit' : 'off'}`}>
      <Socket aria-hidden>
        <Bulb $color={color} $lit={lit} />
      </Socket>
      <Caption>{label}</Caption>
    </Bezel>
  );
}

export const LampRow = styled.div`
  display: flex;
  gap: ${theme.space.loose};
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.space.snug};
  }
`;
