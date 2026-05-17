import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../theme';
import { config, isCaPlaceholder, pumpFunUrl } from '../../config';
import { Rivet } from './Rivet';

// Amber "armed-but-locked" pulse for the pre-launch state. Slow, irregular —
// reads as a powered button waiting for trigger, not a dead one.
const armedPulse = keyframes`
  0%, 100% { box-shadow: ${theme.shadow.buttonResting}, 0 0 0 0 rgba(232, 163, 61, 0.0); }
  50%      { box-shadow: ${theme.shadow.buttonResting}, 0 0 22px 2px rgba(232, 163, 61, 0.45); }
`;

// Bolted-down cap (AWAITING DEPLOY) → armed lift state on hover.
const Cap = styled.a<{ $disabled: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.snug};
  padding: ${theme.space.snug} ${theme.space.loose};
  border-radius: ${theme.radius.button};
  text-decoration: none;
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 16px;
  text-transform: uppercase;
  color: ${(p) => (p.$disabled ? theme.color.crt.amberWarn : theme.color.text.onChassis)};
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  box-shadow: ${theme.shadow.buttonResting};
  text-shadow: ${(p) =>
    p.$disabled
      ? '0 1px 0 rgba(0, 0, 0, 0.55), 0 0 6px rgba(232, 163, 61, 0.5)'
      : '0 1px 0 rgba(0, 0, 0, 0.55)'};
  transition:
    transform 140ms ${theme.motion.overshoot},
    box-shadow 140ms ${theme.motion.overshoot},
    color 200ms ease;

  ${(p) =>
    !p.$disabled &&
    css`
      &:hover {
        transform: translateY(-1px);
        box-shadow:
          ${theme.shadow.buttonResting},
          ${theme.glow.brassWarm};
        color: ${theme.color.chassis.brassBright};
      }
      &:active {
        transform: translateY(1px);
        box-shadow: ${theme.shadow.buttonPressed};
      }
    `}

  ${(p) =>
    p.$disabled &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      animation: ${armedPulse} 2400ms ease-in-out infinite;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
        box-shadow: ${theme.shadow.buttonResting},
          0 0 14px 1px rgba(232, 163, 61, 0.35);
      }
    `}

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 14px;
    padding: 13px ${theme.space.base};
    min-height: 44px;
    justify-content: center;
  }
`;

// Decorative rivets pinning the cap when AWAITING DEPLOY. Fade out on arm.
const Bolts = styled.span<{ $armed: boolean }>`
  position: absolute;
  inset: 4px;
  pointer-events: none;
  opacity: ${(p) => (p.$armed ? 0 : 1)};
  transition: opacity 600ms ${theme.motion.overshoot};

  & > span {
    position: absolute;
  }
  & > span:nth-child(1) { top: 0; left: 0; }
  & > span:nth-child(2) { top: 0; right: 0; }
  & > span:nth-child(3) { bottom: 0; left: 0; }
  & > span:nth-child(4) { bottom: 0; right: 0; }
`;

export function BuyButton() {
  const placeholder = isCaPlaceholder(config.CA);
  const href = placeholder ? '#' : pumpFunUrl(config.CA);
  const label = placeholder ? 'Awaiting Deploy' : `Buy ${config.NAME} on pump.fun`;

  return (
    <Cap
      href={href}
      target={placeholder ? undefined : '_blank'}
      rel={placeholder ? undefined : 'noopener noreferrer'}
      $disabled={placeholder}
      aria-disabled={placeholder}
      aria-label={placeholder ? `${config.NAME} contract not yet deployed` : `Buy ${config.NAME} on pump.fun`}
      onClick={(e) => {
        if (placeholder) e.preventDefault();
      }}
    >
      <Bolts $armed={!placeholder}>
        <Rivet $size={5} />
        <Rivet $size={5} />
        <Rivet $size={5} />
        <Rivet $size={5} />
      </Bolts>
      {label}
    </Cap>
  );
}
