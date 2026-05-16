import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { config, isCaPlaceholder, pumpFunUrl } from '../../config';
import { Rivet } from './Rivet';

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
  color: ${(p) => (p.$disabled ? theme.color.text.onChassisMuted : theme.color.text.onChassis)};
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  box-shadow: ${theme.shadow.buttonResting};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
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
    `}

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 14px;
    padding: ${theme.space.tight} ${theme.space.base};
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
