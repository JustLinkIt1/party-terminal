import { useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { leverThrow } from '../../styles/keyframes';

const Frame = styled.div`
  position: relative;
  width: 56px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    height: auto;
    flex-direction: row;
    gap: ${theme.space.snug};
    justify-content: center;
  }
`;

// Brass mounting plate the lever lives on.
const Mount = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.space.snug} 0;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(0, 0, 0, 0.35);
    border-radius: 4px;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    padding: ${theme.space.tight} ${theme.space.snug};
    height: auto;
    width: 100%;
    justify-content: center;
    gap: ${theme.space.snug};
  }
`;

const Pivot = styled.button<{ $throwing: boolean; $disabled: boolean }>`
  position: relative;
  width: 12px;
  height: 130px;
  margin-top: ${theme.space.snug};
  transform-origin: 50% 100%;
  background: transparent;
  border: none;
  padding: 0;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  ${(p) =>
    p.$throwing &&
    css`
      animation: ${leverThrow} 720ms ${theme.motion.overshoot};
    `}

  /* Shaft */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    width: 6px;
    height: 100%;
    background: linear-gradient(180deg, #C9A14B 0%, #8A6A2E 50%, #5C4519 100%);
    border-radius: 4px;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.4),
      inset 1px 0 0 rgba(255, 220, 140, 0.35),
      inset -1px 0 0 rgba(0, 0, 0, 0.3);
  }

  /* Wooden handle ball at the top */
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 26px;
    border-radius: ${theme.radius.knob};
    background:
      radial-gradient(circle at 30% 30%, #8B5A2B 0%, #5A3A1B 60%, #2E1B0A 100%);
    box-shadow:
      inset -2px -2px 4px rgba(0, 0, 0, 0.55),
      inset 2px 2px 3px rgba(255, 200, 140, 0.25),
      0 2px 3px rgba(0, 0, 0, 0.55);
  }

  &:hover:not(:disabled)::after {
    box-shadow:
      inset -2px -2px 4px rgba(0, 0, 0, 0.55),
      inset 2px 2px 3px rgba(255, 200, 140, 0.35),
      0 2px 3px rgba(0, 0, 0, 0.55),
      ${theme.glow.brassWarm};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 8px;
    height: 28px;
    margin-top: 0;
    transform-origin: 50% 100%;

    &::before {
      width: 4px;
    }
    &::after {
      width: 18px;
      height: 18px;
      top: -8px;
    }
  }
`;

// Pivot pin at the bottom of the lever — purely visual.
const Pin = styled.span`
  width: 14px;
  height: 14px;
  border-radius: ${theme.radius.rivet};
  background: radial-gradient(circle at 35% 30%, #FBE3A2 0%, #B08D57 50%, #4A3A1A 100%);
  box-shadow: inset 0 1px 1px rgba(255, 220, 140, 0.55), 0 1px 1px rgba(0, 0, 0, 0.55);
`;

const Caption = styled.span`
  font-family: ${theme.font.display};
  font-size: 10px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  color: ${theme.color.text.onChassisMuted};
  margin-top: ${theme.space.tight};
  text-align: center;
  line-height: 1.2;
  width: 56px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);

  @media (max-width: ${theme.breakpoints.md}) {
    width: auto;
    font-size: 12px;
    margin-top: 0;
  }
`;

type Props = {
  disabled?: boolean;
  onPull: () => void;
};

export function NewPersonLever({ disabled, onPull }: Props) {
  const [throwing, setThrowing] = useState(false);

  const fire = () => {
    if (disabled || throwing) return;
    setThrowing(true);
    onPull();
    setTimeout(() => setThrowing(false), 720);
  };

  return (
    <Frame>
      <Mount>
        <Pivot
          $throwing={throwing}
          $disabled={!!disabled}
          type="button"
          onClick={fire}
          disabled={disabled}
          aria-label="Pull lever to meet a new person from this date"
        />
        <Pin aria-hidden />
        <Caption>Pull — New Person</Caption>
      </Mount>
    </Frame>
  );
}
