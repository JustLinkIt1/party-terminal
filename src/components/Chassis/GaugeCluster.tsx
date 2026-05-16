import { useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';

// Three small brass gauges. Round face, glass cover, painted-on dial, brass needle.
// Decorative — the values are derived from chat state, not measurements that matter.

const Cluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.base};
  flex-shrink: 0;

  /* Hidden on mobile — free real estate is too valuable on small screens. */
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const GaugeBody = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: ${theme.radius.knob};
  background: radial-gradient(
    circle at 35% 30%,
    #E8C66A 0%,
    #B08D57 35%,
    #6B5320 80%,
    #3B2A14 100%
  );
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 -2px 3px rgba(212, 175, 55, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.55);
`;

const Glass = styled.div`
  position: absolute;
  inset: 8px;
  border-radius: ${theme.radius.knob};
  background:
    radial-gradient(circle at 50% 55%, #2A2418 0%, #18130A 100%);
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.7),
    inset 0 -1px 2px rgba(212, 175, 55, 0.18);
  overflow: hidden;

  /* Subtle reflection highlight on the "glass" */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35%;
    background: radial-gradient(
      ellipse at 50% -50%,
      rgba(255, 255, 255, 0.18) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const TickRing = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Needle is a thin brass line pinned at the center, rotates by CSS variable.
const Needle = styled.div<{ $angle: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 32px;
  background: linear-gradient(180deg, #D4AF37 0%, #B08D57 60%, #4A3A1A 100%);
  border-radius: 1px;
  transform-origin: 50% 100%;
  transform: translate(-50%, -100%) rotate(${(p) => p.$angle}deg);
  transition: transform 800ms ${theme.motion.overshoot};
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
`;

const Hub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: ${theme.radius.knob};
  background: radial-gradient(circle at 35% 30%, #FBE3A2 0%, #B08D57 50%, #3B2A14 100%);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
`;

const Caption = styled.div`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${theme.font.display};
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${theme.color.text.onChassis};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.7);
`;

type GaugeProps = {
  label: string;
  /** 0..1 → mapped to -120deg..+120deg */
  value: number;
};

function Gauge({ label, value }: GaugeProps) {
  const angle = -120 + Math.max(0, Math.min(1, value)) * 240;
  // Tick marks: 11 short, with major every 5th.
  const ticks = useMemo(() => {
    const arr: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    const cx = 44;
    const cy = 44;
    const rOuter = 30;
    for (let i = 0; i <= 10; i++) {
      const major = i % 5 === 0;
      const a = (-120 + (i / 10) * 240) * (Math.PI / 180);
      const rInner = rOuter - (major ? 6 : 3);
      arr.push({
        x1: cx + Math.sin(a) * rInner,
        y1: cy - Math.cos(a) * rInner,
        x2: cx + Math.sin(a) * rOuter,
        y2: cy - Math.cos(a) * rOuter,
        major,
      });
    }
    return arr;
  }, []);

  return (
    <GaugeBody role="img" aria-label={`${label} gauge`}>
      <Glass>
        <TickRing viewBox="0 0 88 88" aria-hidden>
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? theme.color.text.onChassis : theme.color.text.onChassisMuted}
              strokeWidth={t.major ? 1.3 : 0.8}
              strokeLinecap="round"
            />
          ))}
        </TickRing>
        <Needle $angle={angle} />
        <Hub />
        <Caption>{label}</Caption>
      </Glass>
    </GaugeBody>
  );
}

type Props = {
  /** Conversation length 0..∞ — maps to a "drift" reading 0..1 (saturates ~40 turns). */
  drift: number;
  /** Connection state: booting → 0.2, idle → 0.95, sending → 0.6, error → 0.05. */
  signal: number;
  /** Selected year — mapped to 1500..today as 0..1. */
  epoch: number;
};

export function GaugeCluster({ drift, signal, epoch }: Props) {
  return (
    <Cluster aria-hidden={false}>
      <Gauge label="Drift" value={drift} />
      <Gauge label="Signal" value={signal} />
      <Gauge label="Epoch" value={epoch} />
    </Cluster>
  );
}
