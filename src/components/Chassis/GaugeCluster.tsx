import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { gaugeWobble } from '../../styles/keyframes';

// Three vertical brass-bezel gauges driven by drift/signal/epoch.
// Each needle rotates with overshoot easing when the underlying prop changes,
// and an idle wobble keyframe gives ambient motion so the cluster never
// reads as "frozen." Hidden on mobile — real estate is too tight for them
// to land legibly there.

const SWEEP_MIN = -110; // deg, left rest
const SWEEP_MAX = 110;  // deg, right peg

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const angleOf = (v: number) => SWEEP_MIN + clamp01(v) * (SWEEP_MAX - SWEEP_MIN);

const Cluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.snug};
  flex-shrink: 0;
  align-items: center;
  padding: ${theme.space.snug};
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: 5px;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Gauge = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 50%, #1A1208 0%, #2A1E0B 70%, #4A371A 100%);
  border: 3px solid;
  border-color: ${theme.color.chassis.brassBright} ${theme.color.chassis.brassBase}
    ${theme.color.chassis.brassDark} ${theme.color.chassis.brassBase};
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.7),
    0 1px 0 rgba(255, 220, 140, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.55);
`;

const Tick = styled.span<{ $angle: number; $major?: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: ${(p) => (p.$major ? '7px' : '4px')};
  background: ${(p) =>
    p.$major ? theme.color.chassis.brassBright : theme.color.chassis.brassBase};
  opacity: ${(p) => (p.$major ? 0.85 : 0.5)};
  transform-origin: 50% calc(50% + 30px);
  transform: translate(-50%, -100%) rotate(${(p) => p.$angle}deg);
`;

const Needle = styled.span<{ $angle: number; $wobble: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 28px;
  background: linear-gradient(
    180deg,
    ${theme.color.chassis.brassBright} 0%,
    ${theme.color.chassis.brassBase} 60%,
    ${theme.color.chassis.brassDark} 100%
  );
  border-radius: 1px;
  transform-origin: 50% 100%;
  --needle: ${(p) => p.$angle}deg;
  transform: translate(-50%, -100%) rotate(var(--needle));
  transition: transform 720ms ${theme.motion.overshoot};
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  pointer-events: none;

  ${(p) =>
    p.$wobble &&
    css`
      animation: ${gaugeWobble} ${theme.motion.gaugeWobble.duration}
        ${theme.motion.gaugeWobble.easing} infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

const Hub = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 35% 30%, #FBE3A2 0%, #D4AF37 50%, #4A3A1A 100%);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
`;

const Label = styled.div`
  font-family: ${theme.font.display};
  font-size: 9px;
  letter-spacing: 0.22em;
  color: ${theme.color.text.onChassisMuted};
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
  margin-top: 4px;
  text-align: center;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  drift: number;
  signal: number;
  epoch: number;
};

const TICKS = [-110, -73, -36, 0, 36, 73, 110];

function GaugeFace({ label, value, wobble }: { label: string; value: number; wobble: boolean }) {
  return (
    <Cell>
      <Gauge role="img" aria-label={`${label} gauge`}>
        {TICKS.map((a, i) => (
          <Tick key={i} $angle={a} $major={a === -110 || a === 0 || a === 110} aria-hidden />
        ))}
        <Needle $angle={angleOf(value)} $wobble={wobble} aria-hidden />
        <Hub aria-hidden />
      </Gauge>
      <Label>{label}</Label>
    </Cell>
  );
}

export function GaugeCluster({ drift, signal, epoch }: Props) {
  return (
    <Cluster aria-hidden>
      <GaugeFace label="Drift" value={drift} wobble />
      <GaugeFace label="Signal" value={signal} wobble={false} />
      <GaugeFace label="Epoch" value={epoch} wobble={false} />
    </Cluster>
  );
}
